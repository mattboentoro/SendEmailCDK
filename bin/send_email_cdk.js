#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { SendEmailCdkStack } = require('../lib/send_email_cdk-stack');

const app = new cdk.App();
new SendEmailCdkStack(app, 'SendEmailCdkStack');
