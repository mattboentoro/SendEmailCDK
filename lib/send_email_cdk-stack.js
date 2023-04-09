const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const lambda = require("aws-cdk-lib/aws-lambda");
const s3 = require("aws-cdk-lib/aws-s3");
const iam = require("aws-cdk-lib/aws-iam");
const { HttpLambdaIntegration } = require("@aws-cdk/aws-apigatewayv2-integrations-alpha");
const {CorsHttpMethod, HttpApi, HttpMethod} = require("@aws-cdk/aws-apigatewayv2-alpha")

class SendEmailCdkStack extends cdk.Stack {
  /**
   * @param {Construct | undefined} scope
   * @param {string | undefined} id
   * @param {cdk.StackProps | undefined} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const bucket = new s3.Bucket(this, "Store");
  
    const handler = new lambda.Function(this, "sendEmailFunction", {
      description: 'Function to send email to pre-determined email address',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "lambda.main",
      environment: {
        BUCKET: bucket.bucketName
      }
    });
    handler.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ses:SendEmail',
        'ses:SendRawEmail'
      ],
      resources: ["*"],
    }));
  
    const sendEmailIntegration = new HttpLambdaIntegration("sendEmailIntegration", handler);

    const httpApi = new HttpApi(this, 'sendEmailApi', {
      description: 'API to send email',
      corsPreflight: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000', 'https://mattboentoro.herokuapp.com', 'http://mattboentoro.herokuapp.com'],
      },
    });

    httpApi.addRoutes({
      path: '/sendEmail',
      methods: [ HttpMethod.POST ],
      integration: sendEmailIntegration,
    });
}
}

module.exports = { SendEmailCdkStack }