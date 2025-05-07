#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CdkStack(app, 'CdkStack', {
  stackName: 'are-you-employable',
  description: 'Are You Employable - AWS CDK Stack',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "af-south-1",
  },
  environmentName: 'production',
  instanceType: 't3.micro',
  minInstances: 1,
  maxInstances: 1,
});