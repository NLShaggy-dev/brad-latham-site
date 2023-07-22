import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import * as path from 'path';

interface FrontEndStackProps extends cdk.StackProps {
  hostedZoneDomain: string;
}

export class FrontEndStack extends cdk.Stack {
  constructor(scope: Construct, props: FrontEndStackProps) {
    super(scope, 'FrontEndStack', props);

    // Lookup hosted zone of props.hostedZoneDomain
    const zone = route53.HostedZone.fromLookup(this, `${props.hostedZoneDomain}`, {
      domainName: props.hostedZoneDomain
    });

    const assetsBucket = new s3.Bucket(this, 'AssetsBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    const cert = new acm.DnsValidatedCertificate(this, `${props.hostedZoneDomain}Cert`, {
      domainName: `${props.hostedZoneDomain}`,
      hostedZone: zone,
      region: props.env?.region
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(assetsBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      domainNames: [props.hostedZoneDomain],
      certificate: cert,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName
    });

    // add a record to hostedzone
    new route53.ARecord(this, 'CDNARecord', {
      zone,
      target: route53.RecordTarget.fromAlias(new CloudFrontTarget(distribution))
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(
        path.join(__dirname, '..', 'assets')
      )],
      destinationBucket: assetsBucket
    });
  }
}
