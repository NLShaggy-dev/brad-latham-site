#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FrontEndStack } from '../lib/frontend';

const app = new cdk.App();
new FrontEndStack(app, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  hostedZoneDomain: process.env.HOSTEDZONE_NAME || 'bradlatham.com'
});