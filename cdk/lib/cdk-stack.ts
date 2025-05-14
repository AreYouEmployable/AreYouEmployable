import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export interface ExtendedStackProps extends cdk.StackProps {
  environmentName: string;
  instanceType: string;
  minInstances: number;
  maxInstances: number;
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });


    // Create S3 bucket to store application versions
    const areYouEmployableBucketName = `are-you-employable-${props.environmentName}-bucket`;
    const areYouEmployable = new s3.Bucket(this, areYouEmployableBucketName, {
      bucketName: areYouEmployableBucketName,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      accessControl: s3.BucketAccessControl.PRIVATE,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });


    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'are-you-employable-distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(areYouEmployable, {
          originAccessLevels: [cloudfront.AccessLevel.READ],
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Create security group for RDS
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc,
      description: 'Security group for RDS instance',
      allowAllOutbound: true,
    });

    // Create RDS instance
    const areYouEmployableDbName = `areYouEmployableDB`;
    const database = new rds.DatabaseInstance(this, areYouEmployableDbName, {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      publiclyAccessible: true,
      securityGroups: [dbSecurityGroup],
      databaseName: areYouEmployableDbName,
      allocatedStorage: 20,
      maxAllocatedStorage: 20,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
    });

    // Create IAM role and instance profile for EC2 instances
    const areYouEmployableRoleName = `are-you-employable-${props.environmentName}-role`;
    const ebInstanceRole = new iam.Role(this, areYouEmployableRoleName, {
      roleName: areYouEmployableRoleName,
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    ebInstanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    );

    // Add policy to allow RDS access
    ebInstanceRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'rds-db:connect',
        'rds:DescribeDBInstances',
      ],
      resources: [database.instanceArn],
    }));

    const instanceProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
      roles: [ebInstanceRole.roleName],
    });

    // Create security group for Elastic Beanstalk
    const ebSecurityGroup = new ec2.SecurityGroup(this, 'EBSecurityGroup', {
      vpc,
      description: 'Security group for Elastic Beanstalk instances',
      allowAllOutbound: true,
    });

    // Allow Elastic Beanstalk to connect to RDS
    dbSecurityGroup.addIngressRule(
      ebSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow Elastic Beanstalk to connect to PostgreSQL'
    );

    // Allow public access to the database for testing purposes
    dbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432),
      'Allow public access to PostgreSQL'
    );

    // Create Elastic Beanstalk service role
    const ebServiceRole = new iam.Role(this, 'ElasticBeanstalkServiceRole', {
      assumedBy: new iam.ServicePrincipal('elasticbeanstalk.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSElasticBeanstalkEnhancedHealth'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSElasticBeanstalkService')
      ],
    });

    // Create Elastic Beanstalk application
    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: 'are-you-employable-api',
    });

    // Create Elastic Beanstalk environment
    const environment = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: 'are-you-employable-api-env',
      applicationName: app.applicationName || 'are-you-employable-api',
      solutionStackName: '64bit Amazon Linux 2023 v6.5.1 running Node.js 20',
      optionSettings: [
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: instanceProfile.attrArn,
        },
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'InstanceType',
          value: props.instanceType,
        },
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'SecurityGroups',
          value: ebSecurityGroup.securityGroupId,
        },
        {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MinSize',
          value: props.minInstances.toString(),
        },
        {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MaxSize',
          value: props.maxInstances.toString(),
        },
        {
          namespace: 'aws:elasticbeanstalk:environment',
          optionName: 'EnvironmentType',
          value: 'SingleInstance',
        },
        {
          namespace: 'aws:elasticbeanstalk:environment',
          optionName: 'ServiceRole',
          value: ebServiceRole.roleName,
        },
        {
          namespace: 'aws:elasticbeanstalk:environment:process:default',
          optionName: 'HealthCheckPath',
          value: '/health',
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'NODE_ENV',
          value: 'production',
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'DB_HOST',
          value: database.instanceEndpoint.hostname,
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'DB_PORT',
          value: '5432',
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'DB_NAME',
          value: areYouEmployableDbName,
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'DB_USERNAME',
          value: database.secret?.secretValueFromJson('username').unsafeUnwrap() || '',
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'DB_PASSWORD',
          value: database.secret?.secretValueFromJson('password').unsafeUnwrap() || '',
        },
        {
          namespace: 'aws:ec2:vpc',
          optionName: 'VPCId',
          value: vpc.vpcId,
        },
        {
          namespace: 'aws:ec2:vpc',
          optionName: 'Subnets',
          value: vpc.publicSubnets.map(subnet => subnet.subnetId).join(','),
        },
        {
          namespace: 'aws:ec2:vpc',
          optionName: 'ELBSubnets',
          value: vpc.publicSubnets.map(subnet => subnet.subnetId).join(','),
        },
      ],
    });

    const apiDistribution = new cloudfront.Distribution(this, 'AreYouEmployableApiDistribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin('are-you-employable-api-env.eba-smptqyru.af-south-1.elasticbeanstalk.com', {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
        }),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
      comment: 'CloudFront distribution in front of Elastic Beanstalk API'
    });

    // Create outputs
    new cdk.CfnOutput(this, 'ApplicationURL', {
      value: `http://${environment.attrEndpointUrl}`,
      description: 'URL of the Elastic Beanstalk environment',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.instanceEndpoint.hostname,
      description: 'Database endpoint',
    });

    new cdk.CfnOutput(this, 'ApiCloudFrontUrl', {
      value: `https://${apiDistribution.distributionDomainName}`,
      description: 'CloudFront HTTPS URL for Beanstalk API'
    });
  }
}
