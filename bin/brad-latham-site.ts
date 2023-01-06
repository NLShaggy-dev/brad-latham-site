#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FrontEndStack } from '../lib/frontend';

const app = new cdk.App();
new FrontEndStack(app, {
  env: {
    account: '433431717427',
    region: 'us-east-1'
  }
});