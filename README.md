# Welcome to your bradlatham.com source code

this CDK App defines the construction of bradlatham.com (my own CV website)

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Development

by default, the CDK app will use `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION` to determine which account to deploy to.
For the HostedZone name, I added a section to pass in your on env variable to use for the hostedZone domain name called `HOSTEDZONE_NAME`,
although this is for lookups in the same AWS account and will not create a hosted zone with that name

I've also added support for [VS Code dev containers](https://code.visualstudio.com/docs/devcontainers/containers), this already includes CDK and Git in a Node.js and Typescript container