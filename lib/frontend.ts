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
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FrontEndStack extends cdk.Stack {
  constructor(scope: Construct, props?: cdk.StackProps) {
    super(scope, 'FrontEndStack', props);

    // Lookup hosted zone of `bradlatham.com`
    const zone = route53.HostedZone.fromLookup(this, 'bradlatham', {
      domainName: 'bradlatham.com'
    });

    const assetsBucket = new s3.Bucket(this, 'AssetsBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    const cert = new acm.DnsValidatedCertificate(this, 'bradlathamCert', {
      domainName: 'www.bradlatham.com',
      hostedZone: zone,
      region: 'us-east-1'
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(assetsBucket),
      },
      domainNames: ['www.bradlatham.com'],
      certificate: cert,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName
    });

    // add a record to hostedzone
    const aRecord = new route53.ARecord(this, 'CDNARecord', {
      zone,
      recordName: 'www',
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
