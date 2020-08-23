# AWS Developer Associate Certification Notes

# Security

## IAM

Identity Access Management (IAM) is used to define user access permissions within AWS.

**Users**
**Groups**
**Roles** Assigned to EC2, Lambdas etc, they allow access to AWS resources without need to use Key IDs and Secret Keys.
Roles are controlled by policies
You can change a policy on a role and it will take immediately effect.
You can attach and detach a role from ec2 without need to stop (only one role per ec2).

**Policies**
IAM has three types of policies. Inline, Managed and Customer Managed.

**Managed Policies**
A Managed Policy is an IAM policy which is created and administered by AWS.
AWS provide Managed Policies for common use cases based on job function. e.g: AmazonDynamoDBFullAccess, AWSCodeCommitPowerUser etc.
These AWS-provided policies allow you to assign appropriate permissions to your users, groups and roles without having to write the policy yourself.
A single Managed Policy can be attached to multiple users, groups, or roles within the same AWS account `and across different accounts`.
You cannot change the permissions defined in an AWS Managed Policy.

**Inline Policies**
An Inline Policy is a IAM policy which is actually embedded within the user, group, or role to which it applies. There is a strict 1:1 relationship between the entity and the policy.
Once you delete the user, group or role in which the policy is embedded, the policy will also be deleted.

In most cases, AWS recommends using Managed Policies over Inline Policies.

Inline Policies are useful when you want to be sure that the permissions in a policy are not inadvertently assigned to any other user, group, or role than the one for which they're intended.

**Customer Managed Policies**
A Customer Managed Policy is a standalone policy that you create and administer inside your own AWS account. You can attach this policy to multiple users, groups or roles - `but only within your won account`.

In order to create a Customer Managed Policy, you can copy an existing AWS Managed Policy and customize it to fit the requirements of your organization.

Recommended for use cases where the existing AWS Managed Policies don't meet the needs of your environment.

**Policy Structure**
This is known as the PARC model.

```
{
    "Statement": [{
        "Effect": "Allow | Deny",
        "Principal": "principal",                                           // P
        "Action": ["ec2:Describe*", "ec2:action1", "ec2:action2"],          // A
        "Resource": "arn",                                                  // R
        "Condition": {                                                      // C
            "condition": {
                "key": "value"
            }
        }
    }]
}
```

`Effect`: Allow or Deny
`Principal`: Use the Principal element in a policy to specify the principal that is allowed or denied access to a resource. You cannot use the Principal element in an IAM identity-based policy. You can use it in the trust policies for IAM roles and in resource-based policies.
`Action`: The Action element describes the specific action or actions that will be allowed or denied. e.g: `"Action": "sqs:SendMessage"`
`Resource`: The Resource element specifies the object or objects that the statement covers. Statements must include either a Resource or a NotResource element. You specify a resource using an ARN. For more information about the format of ARNs, see IAM ARNs (see ARNs anatomy below).
`Condition`: The Condition element (or Condition block) lets you specify conditions for when a policy is in effect. e.g: `"Condition" : { "StringEquals" : { "aws:username" : "johndoe" }}`
Tip on Conditions: You can point to managed policies. e.g:

```
"Condition": {
    "StringEquals": {
        "iam:PermissionsBoundary": "arn:aws:iam:123...:policy/region-restriction"
    }
}
```

**ARNs Anatomy**
`"Resource": "arn:aws:[service]:[region]:[account]:resourceType/resourcePath"`
e.g: `"Resource": "arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0"`
You can specify all instances that belong to a specific account by using the \_ wildcard as follows.
e.g: `"Resource": "arn:aws:ec2:us-east-1:123456789012:instance/*"`
WildCards can be used in any position of the ARN path.
e.g: `"Resource": "arn:aws:ec2:us-east-1:123456789012:*"` or `"Resource": "*"`

**Identities providers**: allows you to manage user identities outside AWS. This is useful if your organization already has its own identity system, such as a corporate user directory. It is also useful if you are creating a mobile app or web application that requires access to AWS resources.When you use an IAM identity provider, you don't have to create custom sign-in code or manage your own user identities. The IdP provides that for you. Your external users sign in through a well-known IdP, such as Login with Amazon, Facebook, or Google. You can give those external identities permissions to use AWS resources in your account. IAM identity providers help keep your AWS account secure because you don't have to distribute or embed long-term security credentials, such as access keys, in your application. IAM Identity Providers is compatible with OpenID and SAML (security assertion markup language).

**STS (Security Token Service)**

AWS Security Token Service (AWS STS) is a web service that enables you to request temporary, limited-privilege credentials for AWS Identity and Access Management (IAM) users or for users that you authenticate (federated users). Credentials are valid frm 900 seconds (15 minutes) tup to a maximum og 3600 seconds (1 hour). Default is 1 hour.

**AssumeRoleWithWebIdentity**
AssumeRoleWithWebIdentity is an API provided by STS. It returns temporary security credentials for users authenticated by a mobile or web application or using a Web ID Provider like Amazon, Facebook, Google etc.
For mobile applications, Cognito is recommended (Cognito makes calls to STS on your behalf).
Regular web applications where you are not using cognito, use the STS assume-role-with-web-identity API.
For example you authenticate users with your own database, then you make a call to STS AssumeRoleWithWebIdentity to fetch temporary credentials and give them to your user.

The response will include an ARN so you can identity the user and also a temporary AccessKeyId and SecretAccessKey.

**Cross Account Access**

Used by creating Cross Account Role "Role For Cross-Account Access" in the production account. Then in the development account you add a Policy to a user or group with Action and Resource as below:

```
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "sts:AssumeRole",
    "Resource": "arn:aws:iam::PRODUCTION-ACCOUNT-ID:role/MyDevelopersAccess"
  }
}
```

Allows you to work with multiple AWS accounts. For example a different account for development and production.
This is a good practice to reduce risks of a failed configuration and security issues.
Cross account access makes it easier to work productively within a multi-account (or multi-role) AWS environment by making it easy for you to switch roles within the AWS Management Console. You can now sign in to the console using your IAM user name then switch the console to manage another account without having to enter (or remember) another user name and password.

**IAM Policy Simulator**
It is a tool where you can test the effects of your policies before committing them to production.

NOTES:
Remember the 3 different types of policies.

## Cognito

NOTES:
Cognito uses User Pools to manage user sign-up and sign-in directly or via Web Identity Providers.
Cognito acts as an Identity Broker, handling all interaction with Web Identity Providers.
Cognito uses Push Synchronization to send a silent push notification of user data updates to multiple devices types associated with a user ID.

## KMS & Encryption

AWS Key Management Service (KMS) makes it easy for you to create and manage cryptographic keys and control their use across a wide range of AWS services and in your applications. AWS KMS is a secure and resilient service that uses hardware security modules that have been validated under FIPS 140-2, or are in the process of being validated, to protect your keys. AWS KMS is integrated with AWS CloudTrail to provide you with logs of all key usage to help meet your regulatory and compliance needs.

Best practice is to have a user with ability to manage the keys but no ability to encrypt and decrypt keys.
And another user with ability to encrypt and decrypt but no ability to manage keys.

Create the Key under IAM Keys menu option, while creating you'll be asked about what group can manage and what group can use the keys. This will create a policy and apply it to the key.

Master Key can never leave the KMS, never exported, if you need to own the master key you need to use AWS CloudHSM service instead of KMS.

**API calls**
aws kms encrypt
aws kms decrypt
aws kms re-encrypt (re-encrypt takes an already encrypted file, decrypts it on the cloud and re-encrypts it, this way non-encrypted text never has to transmit across the internet)
aws kms enable-key-rotation

**Envelop Encryption**
Envelop encryption is the process of encrypting your keys.
A master key is used to encrypt the data key (AKA envelop key) and the data key is used to encrypt the data.
When you encrypt your data, your data is protected, but you have to protect your encryption key. One strategy is to encrypt it. Envelope encryption is the practice of encrypting plaintext data with a data key, and then encrypting the data key under another key.

You can even encrypt the data encryption key under another encryption key, and encrypt that encryption key under another encryption key. But, eventually, one key must remain in plaintext so you can decrypt the keys and your data. This top-level plaintext key encryption key is known as the master key.

NOTES:
KMS is under IAM.
KMS is multi-tenant whereas CloudHSM is dedicated hardware.
Encryption Keys are regional (keys have to be in the same AZ region they are used).
Learn the API calls (most questions are here).
To delete a key you have first to disable it, then schedule for deletion with a waiting period between 7 and 30 days.

## System Management Parameter Store

Provides secure, hierarchical storage for configuration data management and secrets management. You can store data such as passwords, database strings, Amazon Machine Image (AMI) IDs, and license codes as parameter values. You can store values as plain text or encrypted data. You can reference Systems Manager parameters in your scripts, commands, SSM documents, and configuration and automation workflows by using the unique name that you specified when you created the parameter.

You can create a parameter as:
String, String List and Secure String (which is encrypted using AWS KMS).

## AWS WAF

AWS WAF is a web application firewall that helps protect your web applications or APIs against common web exploits that may affect availability, compromise security, or consume excessive resources. AWS WAF gives you control over how traffic reaches your applications by enabling you to create security rules that block common attack patterns, such as SQL injection or cross-site scripting, and rules that filter out specific traffic patterns you define. You can get started quickly using Managed Rules for AWS WAF, a pre-configured set of rules managed by AWS or AWS Marketplace Sellers. The Managed Rules for WAF address issues like the OWASP Top 10 security risks. These rules are regularly updated as new issues emerge. AWS WAF includes a full-featured API that you can use to automate the creation, deployment, and maintenance of security rules.
With AWS WAF, you pay only for what you use. The pricing is based on how many rules you deploy and how many web requests your application receives. There are no upfront commitments.
You can deploy AWS WAF on Amazon CloudFront as part of your CDN solution, the Application Load Balancer that fronts your web servers or origin servers running on EC2, or Amazon API Gateway for your APIs.
**Web traffic filtering**
Filter web traffic based on conditions that include IP addresses, HTTP headers and body, or custom URIs.

## AWS Shield

AWS Shield is a managed Distributed Denial of Service (DDoS) protection service that safeguards applications running on AWS. AWS Shield provides always-on detection and automatic inline mitigations that minimize application downtime and latency, so there is no need to engage AWS Support to benefit from DDoS protection. There are two tiers of AWS Shield - Standard and Advanced.

## Amazon Macie

Amazon Macie is a fully managed data security and data privacy service that uses machine learning and pattern matching to discover and protect your sensitive data in AWS.
Macie automatically provides an inventory of Amazon S3 buckets including a list of unencrypted buckets, publicly accessible buckets, and buckets shared with AWS accounts outside those you have defined in AWS Organizations. Then, Macie applies machine learning and pattern matching techniques to the buckets you select to identify and alert you to sensitive data, such as personally identifiable information (PII). Macie’s alerts, or findings, can be searched and filtered in the AWS Management Console and sent to Amazon CloudWatch Events for easy integration with existing workflow or event management systems, or to be used in combination with AWS services, such as AWS Step Functions to take automated remediation actions. This can help you meet regulations, such as the Health Insurance Portability and Accountability Act (HIPAA) and General Data Privacy Regulation (GDPR). You can get started with Amazon Macie with a few clicks in the AWS Management Console.

# Compute and Related Storage

## EC2

eg. X1: Memory Optimise (large amounts of memory): eg: SAP, Apache Spark
use mnemonic: FIGHT DR McPX.

1. F = FPGA
2. I = IOPS
3. G = Graphcs
4. H = Hight Disk Throughput
5. T = Cheap general purpose
6. D = Density
7. R = RAM
8. M = Main choice for general purpose
9. c = Compute
10. P = Graphcs (think Pics)
11. X = eXtreme Memory

NOTES:
Remember mnemonic FIGHT DR McPX and what they refer to.
Remember Pricing models

1. On Demand.
2. Reserved (cheaper but require contract1 or 3 years).
3. Spot (bid for): You place a bid and While the price is within your bid you are provisioned instances, when it goes up your instances are terminated, if the instance is terminate because the spot price went up you won't be charged for partial hour, you are charge for partial hour if you terminate the instance(s) yourself (\*popular question).
4. Dedicated Hosts (physical server dedicated to your use).Remember EC2 instance Types use cases (see docs folder).

**User Data (running scripts etc)**
You can specify user data to configure an instance or run a configuration script during launch. If you launch more than one instance at a time, the user data is available to all the instances in that reservation.

**Placement Groups**
When you launch a new EC2 instance, the EC2 service attempts to place the instance in such a way that all of your instances are spread out across underlying hardware to minimize correlated failures. You can use placement groups to influence the placement of a group of interdependent instances to meet the needs of your workload. Depending on the type of workload, you can create a placement group using one of the following placement strategies:

`Cluster` – packs instances close together inside an Availability Zone. This strategy enables workloads to achieve the low-latency network performance necessary for tightly-coupled node-to-node communication that is typical of HPC applications.

`Partition` – spreads your instances across logical partitions such that groups of instances in one partition do not share the underlying hardware with groups of instances in different partitions. This strategy is typically used by large distributed and replicated workloads, such as Hadoop, Cassandra, and Kafka.

`Spread` – strictly places a small group of instances across distinct underlying hardware to reduce correlated failures.

## EBS (Elastic Block Storage) : Disk

You can create storage volumes and attach them to EC2 instances. EBS volumes are loosely coupled to EC2 instances, can attache and detach except for the root volume.
**Types of volumes**:
**SSD**

1.  General Purpose SSD(GP2) (Ideal when <= 10K IOPS is needed): Ration 3 IOPS per GB with up to 10K IOPS. Also ability to burst up to 3000 IOPS for extended periods of time for volumes at 3334 GB and above.
2.  Provisioned IOPS SSD(IO1) (Ideal when >= 10K IOPS is needed): Max 20K IOPS per GB.

**Magnetic**

1.  Throughput Optimized HDD (ST1) (cannot be a boot volume): Ideal for big data, data warehouse, log processing.
2.  Cold HDD (SC1) (cannot be a boot volume): Lowest cost storage for infrequently accessed workloads.
3.  Magnetic: Previous generation (can be used for boot).

NOTES:
Remember EBS volume types.
You can encrypt the root device volume (the volume the OS is installed) using OS level encryption (which is not ideal) or instead you can encrypt the root device volume by first taking a snapshot of a volume, and then creating a copy of that snap with encryption. You can then make an AMI of this snap and deploy the encrypted root device volume in with a new instance. You can also encrypt additional attached volumes using console, CLI or API.
2 Different caching strategy: LazyLoading and Write Through.
Avoid stale data by implementing TTL.

## EFS

Amazon Elastic File System (Amazon EFS) provides a simple, scalable, fully managed elastic NFS file system for use with AWS Cloud services and on-premises resources. It is built to scale on demand to petabytes without disrupting applications, growing and shrinking automatically as you add and remove files, eliminating the need to provision and manage capacity to accommodate growth.
Amazon EFS offers two storage classes: the Standard storage class, and the Infrequent Access storage class (EFS IA). EFS IA provides price/performance that's cost-optimized for files not accessed every day. By simply enabling EFS Lifecycle Management on your file system, files not accessed according to the lifecycle policy you choose will be automatically and transparently moved into EFS IA. The EFS IA storage class costs only \$0.025/GB-month\*.

## AMI

An Amazon Machine Image (AMI) provides the information required to launch an instance. You must specify an AMI when you launch an instance. You can launch multiple instances from a single AMI when you need multiple instances with the same configuration. You can use different AMIs to launch instances when you need instances with different configurations.

## ELB (Elastic Load Balancers)

The Open Systems Interconnection (OSI) model is a conceptual model that characterises and standardises the communication functions of a telecommunication or computing system without regard to its underlying internal structure and technology. Its goal is the interoperability of diverse communication systems with standard communication protocols. The model partitions a communication system into abstraction layers.
7.Application layer
6.Presentation layer
5.Session layer
4.Transport layer
3.Network layer
2.Data link layer
1.Physical layer

Types of Load Balancers.

1. Application load balancers: powerful routing rules, best suited for HTTP(s) traffic, operates on the 7th layer of OSI.
   https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html

2. Network load balancers. very fast, best suited for tcp traffic, operates on the 4th layer of OSI. (more expensive).

3. Classic load balancers. (legacy elastic load balancers). You can load balance HTTP(s) traffic applications and use layer-7 specific features, such as X-Forward and sticky sessions.You can also use strict layer 4 load balancing for applications that rely purely on the TCP protocol.
   If the application stops responding the classic ELB responds with a 504 error.
   EC2 instance will only see the private IP address for the ELB for all requests, to know the user's IP ELB forwards the X-Forward-For header with the user's IP address.

NOTES:
You will be more tested on classic load balancers even thought they are legacy.

## Lambda

Lambadas functions can trigger other lambadas functions.
AWS X-ray can be used to debug complex Lambda infrastructures.

**How are compute resources assigned to an AWS Lambda function?**
In the AWS Lambda resource model, you choose the amount of memory you want for your function, and are allocated proportional CPU power and other resources. For example, choosing 256MB of memory allocates approximately twice as much CPU power to your Lambda function as requesting 128MB of memory and half as much CPU power as choosing 512MB of memory. To learn more, see our Function Configuration documentation.

**Lambda Triggers:**
**Services that invoke Lambda functions synchronously:**

1. Elastic Load Balancing (Application Load Balancer)
2. Amazon Cognito
3. Amazon Lex
4. Amazon Alexa
5. Amazon API Gateway
6. Amazon CloudFront (Lambda@Edge)
7. Amazon Kinesis Data Firehose

**Services that invoke Lambda functions asynchronously:**

1. Amazon Simple Storage Service
2. Amazon Simple Notification Service
3. Amazon Simple Email Service
4. AWS CloudFormation
5. Amazon CloudWatch Logs
6. Amazon CloudWatch Events
7. AWS CodeCommit
8. AWS Config

Poll-Based Invokes

This invocation model is designed to allow you to integrate with AWS Stream and Queue based services with no code or server management. Lambda will poll the following services on your behalf, retrieve records, and invoke your functions. The following are supported services:

1. Amazon Kinesis
2. Amazon SQS
3. Amazon DynamoDB Streams

**Lambda ARN**
To get the latest: `arn:aws:lambda:aws-region:acct-i:function:helloworld:$LATEST`
To get specific version: `arn:aws:lambda:aws-region:acct-i:function:helloworld:1`, `arn:aws:lambda:aws-region:acct-i:function:helloworld:2` etc
Once a lambda version is released it cannot be changed (they only one we can change is the \$LATES, once we publish it, a version is created and this version cannot be changed).

Qualifies ARN have the version suffix, for Example `$LATEST`, or `1`. eg: `arn:aws:lambda:aws-region:acct-i:function:helloworld:$LATEST`
Unqualified ARN doesn't have the version suffix eg: `arn:aws:lambda:aws-region:acct-i:function:helloworld`
Unqualified alway point to \$LATEST.

**Alias**
We can also create aliases for specify lambdas, let's say we release lambda v1 `arn:aws:lambda:aws-region:acct-i:function:helloworld:1` we can create an alias `arn:aws:lambda:aws-region:acct-i:function:helloworld:PROD` which points to it.
Then we launch the v2 `arn:aws:lambda:aws-region:acct-i:function:helloworld:2` and we can point `arn:aws:lambda:aws-region:acct-i:function:helloworld:PROD` to v2. This is very good to rollback changes.

We can also split traffic between different versions, for example 50% for v1 and 50% for v2.

**Limits**
Concurrent execution limit is 1000 concurrent invocations across all functions in a specific region.
If you pass you'll start getting the error `TooManyRequestsException`.
HTTP status code is 429.
Request throughput limit exceeded.
You can contact AWS and request that limit to be increased.
For lambdas that are really critical to your business, you can reserve concurrency for them to guarantee a set number of executions which will always be available for your critical function, however this also can act as a limit.
Environment Variables: There is no limit to the total of environment variables as long as the total size does not exceed 4KB.

**Versions**
When you create a new Lambda there is only one version, $LATEST.
When you upload a new version this version will become $LATEST.
You can create multiple versions of your Lambda and use aliases to reference the version you want to use s part of your ARN.

**Lambda and VPCs**
To enable this you need to allow the function to connect to the private subnet.
Lambda needs the following VPC configuration information to connect to the VPC:

1. Private Subnet ID.
2. Security Group ID (with required access).

Lambda uses this information to setup ENIs (Elastic Network Interfaces) using an available IP address from your private subnet.
You can add this information to your Lambda using the `vpc-config` parameter.
`aws lambda update-function-configuration --function-name my-function --vpc-config SubnetIds=xxxx,SecurityGroupIds=xxxx`
You can also use console or CloudFormation.

NOTES:

Lambdas scale horizontally.
Lambdas are independents, 1 event === 1 lambda.
Lambdas can trigger other Lambda functions.
Memorize list of available triggers.
Lambdas can have multiple versions.
Latest version will use \$LATEST suffix.
Qualified ARN – The function ARN with the version suffix.
Unqualified ARN – The function ARN without the version suffix. (always point to \$LATEST)
You can split traffic between different lambda versions by using aliases.
You cannot split traffic with \$LATEST.
Lambdas are region based but they can do things globally (accessing resources in other regions).
You can have multiple versions of a lambda.
Latest version will be \$LATEST.
Published versions cannot be changed.
Concurrent execution limit is 1000 across all functions in a specific region.
USe `vpc-config` to set VPC Private Subnet ID and Security Group ID, so Lambda can setup Elastic Network Interfaces to access resources inside a VPC subnet.

**Versioning**

## Step Functions

AWS Step Functions is a serverless function orchestrator that makes it easy to sequence AWS Lambda functions and multiple AWS services into business-critical applications. Through its visual interface, you can create and run a series of checkpointed and event-driven workflows that maintain the application state. The output of one step acts as input into the next. Each step in your application executes in order and as expected based on your defined business logic.

**Amazon States Language**
The Amazon States Language is a JSON-based, structured language used to define your state machine, a collection of states, that can do work (Task states), determine which states to transition to next (Choice states), stop an execution with an error (Fail states), and so on.

```
{
  "Comment": "An example of the Amazon States Language using a choice state.",
  "StartAt": "FirstState",
  "States": {
    "FirstState": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FUNCTION_NAME",
      "Next": "ChoiceState"
    },
    "ChoiceState": {
      "Type" : "Choice",
      "Choices": [
        {
          "Variable": "$.foo",
          "NumericEquals": 1,
          "Next": "FirstMatchState"
        },
        {
          "Variable": "$.foo",
          "NumericEquals": 2,
          "Next": "SecondMatchState"
        }
      ],
      "Default": "DefaultState"
    },

    "FirstMatchState": {
      "Type" : "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:OnFirstMatch",
      "Next": "NextState"
    },

    "SecondMatchState": {
      "Type" : "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:OnSecondMatch",
      "Next": "NextState"
    },

    "DefaultState": {
      "Type": "Fail",
      "Error": "DefaultStateError",
      "Cause": "No Matches!"
    },

    "NextState": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FUNCTION_NAME",
      "End": true
    }
  }
}
```

## API Gateway

What API Gateway can do:

1. Expose HTTPS endpoints to create a RESTful API.
2. Serverless-ly connect connect to services like Lambda & DynamoDB.
3. Send each API endpoint to a different target.
4. Track and Control usage by API key.
5. Throttle requests to prevent attacks.
6. Connect to Cloudwatch to monitor.
7. Maintain multiple versions of the API.
8. Caching.

**Advanced Features**

Import Using Swagger Files:
You can use API Gateway Import API feature to import an API from an external definition file into API Gateway. Currently it supports Swagger v2.
With the Import API, you can either create a new API by submitting a POST request that includes a Swagger definition in the payload and endpoint configuration, or you can update an existing API by using a PUT request that contains a Swagger definition in the payload. You can update an API by overwriting it with a new definition, or merge a definition with an existing API. You specify the options using a mode query parameter int he request URL.

Throttling:
By default API Gateway limits the steady-state request rate to 10K requests per second.
The maximum concurrent requests is 5K requests across all APIs within an AWS account.
If you go over 10K requests per second or 5K concurrent requests you will receive a 429 Too Many requests error response.

NOTES:
API Gateway has caching capabilities.
It scales automatically.
You can throttle to prevent attacks.
You can log results to CloudWatch.
If you are using Ajax requests that uses multiple domains make sure you enable CORS on API Gateway.
CORS is enforced by the client.

## ECR (Elastic Container Registry)

Amazon Elastic Container Registry (ECR) is a fully-managed Docker container registry. Amazon ECR is integrated with Amazon Elastic Container Service (ECS), simplifying your development to production workflow. Amazon ECR hosts your images in a highly available and scalable architecture, allowing you to reliably deploy containers for your applications.

It uses S3 for highly availability.
It uses IAM for access control management.

Containers are faster to deploy than VMs.

Bellow is a container structure:
//--------------------
/|App1|App2|App3|App4|
/|-------------------|
/| Docker Engine |
/|-------------------|
/| Operation System |
/---------------------

Bellow is a VM structure:
//--------------------
/|App1|App2|App3|App4|
/|-------------------|
/|Bins|Bins|Bins|Bins|
/|Libs|Libs|Libs|Libs|
/|-------------------|
/|Gest|Gest|Gest|Gest|
/| OS| OS| OS| OS|
/|-------------------|
/| Hypervisor |
/---------------------
/| HOST OS |
/---------------------

**Security:**
Integration with AWS Identity and Access Management (IAM) provides resource-level control of each repository.

**Costs:**
With Amazon ECR, there are no upfront fees or commitments. You pay only for the amount of data you store in your repositories and data transferred to the Internet.

TODO: What can be controlled with IAM role and what granularity?
TODO: What can be controlled with IAM Policies and what granularity?
TODO: S3 What granularity can control Bucket Policy?
TODO: S3 What granularity can control with Bucket ACL?

## ECS (Elastic Container Service)

Amazon Elastic Container Service (Amazon ECS) is a fully managed container orchestration service.
ECS is a great choice to run containers for several reasons. First, you can choose to run your ECS clusters using AWS Fargate, which is serverless compute for containers. Fargate removes the need to provision and manage servers, lets you specify and pay for resources per application, and improves security through application isolation by design. Second, ECS is used extensively within Amazon to power services such as Amazon SageMaker, AWS Batch, Amazon Lex, and Amazon.com’s recommendation engine, ensuring ECS is tested extensively for security, reliability, and availability.

Additionally, because ECS has been a foundational pillar for key Amazon services, it can natively integrate with other services such as Amazon Route 53, Secrets Manager, AWS Identity and Access Management (IAM), and Amazon CloudWatch providing you a familiar experience to deploy and scale your containers. ECS is also able to quickly integrate with other AWS services to bring new capabilities to ECS. For example, ECS allows your applications the flexibility to use a mix of Amazon EC2 and AWS Fargate with Spot and On-Demand pricing options. ECS also integrates with AWS App Mesh, which is a service mesh, to bring rich observability, traffic controls and security features to your applications. ECS has grown rapidly since launch and is currently launching 5X more containers every hour than EC2 launches instances.

## ElasticBeansTalk

AWS Elastic Beanstalk is an easy-to-use service for deploying and scaling web applications and services developed with Java, .NET, PHP, Node.js, Python, Ruby, Go, and Docker on familiar servers such as Apache, Nginx, Passenger, and IIS.
You can simply upload your code and Elastic Beanstalk automatically handles the deployment, from capacity provisioning, load balancing, auto-scaling to application health monitoring. At the same time, you retain full control over the AWS resources powering your application and can access the underlying resources at any time.
There is no additional charge for Elastic Beanstalk - you pay only for the AWS resources needed to store and run your applications.

**Different Types of Updates**
**All at once**: All instances simultaneously. There is downtime because instances become unavailable. If update fails you need to roll back by re-deploying the previous version.
**Rolling**: Deploys in batches (you can define the batch size), your environment capacity will reduce so this is not ideal for performance sensitive applications. If the update fails, you need to perform and additional rolling update to roll back the instances.
**Rolling with Additional Batch**: It creates an additional batch of instances and deploy on them, with this your capacity never goes down. If the update fails you need to perform and additional rolling update to roll back the changes.
**Immutable**: Deploys a new version to a fresh group of instances in their own auto-scaling group, when the new instances pass the health check they are moved to the existing scaling group, and finally, the old instances are terminated. The impact of a failing update is far less, and rolling back process requires only terminating the new autoscaling group. This is the preferred option for Mission Critical production systems.

**Configuration File**
You can customize your environment using configuration files inside the `.ebextensions` folder. The files are written in YAML or JSON and they can have any name but must have `.config` extension.
With these files you can specify shell commands, specify packages to install, create linux users and groups, specify services to enable, even to configure your loadbalancer. The folder must be put on the root directory of your application source code.

**RDS and ElasticBeansTalk**
ElasticBeansTalk supports two ways of integrating RDS databases with your Beanstalk environment.

1. You can launch the RDS instance within the beanstalk console, which means the RDS instance is created with your environment. Great for test and dev environments. This ties the lifecycle of the database to your environment, you terminate the environment and the database is also terminated.
2. Launch RDS db from outside and manage it separately. This way you decouple the database from the environment. You will need to provide the security group to allow the environment to access the DB, and you will also need to provide the environment with the connections string, ideally using environment variables.

**Docker and ElasticBeansTalk**
You can deploy docker containers using beanstalk.
When you deploy a Docker container on beanstalk you can choose from:

1. Single Docker Container per EC2: Single Docker container o a EC2 instance.
2. Multiple Docker Containers: Use ElasticBeansTalk to build an ECS cluster and deploy multiple containers er instance.

**Beanstalk Worker Environment**
If your AWS Elastic Beanstalk application performs operations or workflows that take a long time to complete, you can offload those tasks to a dedicated worker environment. Decoupling your web application front end from a process that performs blocking operations is a common way to ensure that your application stays responsive under load.
To avoid running long-running tasks locally, you can use the AWS SDK for your programming language to send them to an Amazon Simple Queue Service (Amazon SQS) queue, and run the process that performs them on a separate set of instances.
Elastic Beanstalk worker environments simplify this process by managing the Amazon SQS queue and running a daemon process on each instance that reads from the queue for you. When the daemon pulls an item from the queue, it sends an HTTP POST request locally to http://localhost/ on port 80 with the contents of the queue message in the body. All that your application needs to do is perform the long-running task in response to the POST.
With periodic tasks, you can also configure the worker daemon to queue messages based on a cron schedule.
You can define periodic tasks in a file named cron.yaml in your source bundle to add jobs to your worker environment's queue automatically at a regular interval.

# DNS

## Route 53

AWS DNS service. Allows you to map domains names to EC2, ELBs, CLoudFront, S3 buckets.

# Databases

## RDS (Relational Database Service) (Used for OLTP).

Supported engines:
PostgreSQL, MySQL, Oracle, MS SQL Server,
AWS Aurora: Amazon SQL Database, fully compatible with MySQL (Aurora is not available in Free tier).
Maria DB: Also Commercially supported fork of MySQL.

OLTP: Online Transaction Processing (more simple transactions)
example: Order number 1234 pulls up a row of data with name, data, address to delivery and status

NOTES:
If you have an EC2 in one security group and a RDS DB in another you need to give access to the EC2 security group inside the RDS security group, chose Type MySql port 3306 and add Ec2 security group in the source.

**Multi AZ** vs **Read Replica**
**Multi AZ** (for disaster recovery only)
Is for disaster recovery, so if the database is in zone us-east-1a you can have a copy in another(s) region(s), let's say on us-east-1b, when something is writhen to us-east-1a it will be synchronously copied to us-east-1b. So the RDS DNS registry points to us-east-1a, if this instance becomes unavailable AWS will update the DNS registry and point to us-east-1b.

**Read Replica** (for improved performance)
When you create read replicas, writes to the primary instance will be replicated to the replicas asynchronously. Instance should use the read replicas to optimise read performance, for example you have instances in 3 different regions, the primary database is in us-east-1a and you add read replicas in us-east-1a, us-east-1b, us-east-1c. Instance then read from the replica in their own regions and write to the primary in us-east-1a.
You can also have read replicas of a read replica, they will be some synchronization latency, but if you can work with eventual consistency this is a way to lower replication load from the primary database.
Available for: MySQL, Postgre, MariaDB and Aurora.
You must have automatic backup on in order to have read replica.
You can have up to five read replica copies of any database.
Each read replica will have their own DNS address.
You can have read replicas that have MultiAZ enabled.
Read replicas can be promoted to become their own database. This breaks the replication with the primary as the read replica becomes a primary by itself.

**Backups**
Whenever you restore either an automatic backup or a manual snapshot the restored version of the database will be a new RDS instance with a new DNS and point.

There are two types of backups for RDS:

**Automated**
Allows you to recover your data at any point in time within a "retention period". The retention period can be between 1 and 35 days. It takes a full daily snapshot and will also store transactions logs throughout the day. When you do a recover AWS will choose the most ecently daily backup and then apply transactions logs relevant to that day. This allows you to point in time recovery down to a second.
Enabled by default.
Backup date is stored on S3 and you get a free storage space equal to the size of your database.
During the backup window, storage I/O may be suspended while your data is being backed up and you may experience elevated latency.
**Snapshots**
DB snapshots are done manually (user initiated). They are stored even after you delete the original RDS instance, unlike automated backups.

**encryption**
Encryption at rest is supported for MySQL, Aurora, Oracle, MS SQL, Postgre and MariaDB. Encryption is done using AWS Key Management Service (KMS). Once your RDS instance is encrypted,so it's automated backups, read replicas and snapshots. ATM encrypting an existing db is not supported, so you need to take an snapshot, make a copy and encrypt it, then create a new instance with it.

## RedShift (Relational Database Service for Data Warehouse) (Used for OLAP).

OLAP: Online Analytics Processing (more complex transactions, pull up large numbers of records)
example: Pull up net profit for all radios in europe.
Data Warehousing databases use different type of architecture both from a database perspective and infrastructure layer.

## ElasticCache

Web service that makes easy to deploy and scale and in-memory cache in the cloud. It supports:

1. Memcached: Multi-threaded, No Multi-AZ capacity

2. Redis: Supports Primary/Secondary replication and Multi-AZ which can be used to achieve cross AZ redundancy.

Although both MemCached and Redis may appear similar in the surface (in hat they are both in-memory cache), they are actually quite different in practice. Because of the replication and persistence features of Redis, elasticache manages Redis more like a relational database. Redis Elasticache clusters are managed as stateful entities that include failover, similar how Amazon RDS manages databases failover.
Memcached is designed as a pure cache solution with no persistence. Elasticache manages MemCached nodes a pool that can grow ans shrink, similar to EC2 Autoscaling Group. Individual nodes are expendable, and Elasticache provides additional capabilities here, such as automatic node replacement and Auto Discover.

Use cases MemCached:
Is object caching the primary goal, for example offloading a database. Use Memcached.
Do you want the simplest cache model possible. Use Memcached.
Are you planning to use large cache nodes, and require multithreaded performance with utilization of multiple cores? If so use Memcached.
Do you want the ability to scale to scale your cache horizontally as you grow? Use MemCached.

Use cases Redis:
Are you looking for more advanced data types, such as lists, hashes and sets. Use Redis.
Does sorting and ranking datasets in memory helps, such as a leader board?. Use Redis.
Is persistence of your key-store important: Use Redis.
Do you want to run in multiple AWS Availability Zones (Multi-AZ) with failover? Use Redis.

**Caching Strategies**

1. Lazy Loading: Loads the data into cache only when necessary. If requested data is in the cache, Elasticcache returns the data to the application, if not (or data has expired) it returns null and the applications fetched the DB and writes writes the data to the cache.
2. Write-Through: Adds or updates data to the cache whenever data is written to the database.
   Pros: Data in cache is never stale.
   Cons: Every write involves writing to the cache as well as a write to the database. Wasted resroucers if most data is never used.

NOTES:
Typically you will be given a scenario where a database is under a lot of stress/load. You may be asked which service you should use to alleviate this.
ElasticCached is good choice if your database is particularly read-heavy and not prone to frequent change.

Redshift is a good answer if your database is being used for running OLAP transactions (remember redshift is used for large processing with loads of records).

## DynamoDB

Support Documents and Key/Value Data models.
Serverless.
Tables are backed by SSDs.
Underline hardware is always spread across 3 geographically distinct data centers.
Choice of two consistency models:
Eventually consistency reads.
Strongly consistency reads.

Database is made of Tables, Items (like a row in a SQL DB) and Attributes (like columns in a SQL DB).
It supports key-value and document data structures.
Documents can be written in JSON, HTML, or XML.

**Primary Keys**
DynamoDB stores and retrieve data based on the primary key.
There are two types of primary keys:

1. Partition Key: unique attribute, eg.: userID.
   The value of the primary key is used as input for an internal hash function which determines the partition of physical location on which the data is stored. If you are using the Partition Key as Primary Key then no two items can have the same partition key.

2. Composite Primary Key (Partition Key + Sort Key): Composite keys are used when the partition key is not necessarrily unique, for example a table which stores forum posts, a user post several posts, so the composite key would be formed of `userId+postTimestamp`.

2 items may have the same Partition Key, but they must have a different Sort key.
All items with the same partition key are stored together, then sorted according to the sorting key.

**Eventually Consistency Reads**
Consistency across all copies of data is usually reached within 1 second. Repeating a read after a short time should return the updated data. (Best read performance).

**Strongly Consistency Reads**
Returns result that reflects all writes that received a successful response prior to the read.

**DynamoDB Access Control**

1. Authentication and Access Control is managed using IAM. You can create a IAM user within your AWS account which has specific permissions to access and create DynamoDB Tables. You can create a IAM role which enables you to obtain temporary access keys which can be used to access DynamoDB.

You can also use a special IAM Cognito condition to restrict user access to only their own records. This is done by adding a condition to the IAM Policy to allow access only to items where the partition key value matches the user id.

**Indexes**

1. Local Secondary Index (LSI) (Updates are strongly consistent)
   Can only be created when you create your table.
   You cannot add, remove or modify later.
   It has the same Partition Key as your original table.
   But a different sorting key.
   Gives you a different view over you data, organized according to an alternative sorting key.
   Any queries based on this Sort Key are much faster using the index than the main table.
   e.g: Partition Key: userId, Sort Key: account creation date.

2. Global Secondary Index (GSI) (Updates are eventually consistent)
   Can be created any time.
   Different Partition Key as well as different sort key.
   So it gives a completely different view of the data.
   Speeds up queries related to this Partition Key and Sort Key.
   e.g: Partition Key: email address, Sort Key: last login date.

**Scan vs Query API**
A `Query` operation finds items in a table based on the Primary Key attribute and a distinct value to search for. e.g: select a user where id equals 123.
You can use an optional Sort Key name and value to refine the results.
e.g: if your Sort Key is a timestamp, you can refine the query to only select items with a timestamp of the last 7 days.

By default, a Query return all the attributes for the item but you can specify the `ProjectionExpression` parameter if you want to query the specific attributes you want.

Result are always sorted by Sort Key.
Numeric order by default is ascending.
You can reverse the order by setting the `ScanIndexForward` parameter to `false`.
By default Queries are `eventually consistent`.
You need to explicitly set the query to be `Strong Consistent`.

A `Scan` operation examines every item on the table.
By default it returns all the attributes but you can specify the `ProjectionExpression` parameter if you want to query the specific attributes you want.
You can filter the results of the Scan.
The larger the table the longer the scan operation takes. In a very large table scans could use up all the table's provisioned throughout in just a single operation.

Tips:
You can reduce the impact of a query and scan by setting page size which uses fewer read operations. e.g: set the page size to return 40 items. This is so because larger number of smaller operations will allow other requests to succeed without throttling (thread won't be blocked by a single operation).
Avoid using scans as much as possible by design the tables in a way that you can perform queries instead.

Another option sis to use parallel scans, by default a scan operation processes data sequentially returning 1MB increments before moving to retrieve the next 1MB of data and it can only scan one partition at a time.
You can configure DynamoDB to use Parallel scans by logically dividing a table or index into segments and scanning each segment in parallel. But it is best to avoid parallel scans if your table or index is already incurring heavy read / write activity from other applications.

**Provisioned Throughput**
DynamoDB provisioned throughput is measured in Capacity Units.
When you create a table, you specify the requirements in terms of Read and Write Capacity Units.
1 x Write Capacity Unit = 1KB write per second.
1 x Read Capacity Unit = 2 x Eventually Consistent Read of 4K per second (Default) or
1 x Read Capacity Unit = 1 x Strongly Consistent Read of 4K per second.

If you application reads or writes larger items it will consume more Capacity Units and will cost more as well.

**On Demand Price Option**
DynamoDB also allows on-demand capacity instead of provisioned.
Charges apply for reading, writing and storing data.
With on-demand you don't need to specify your requirements as it scales up and down based on the activity of your application. You pay for only what you use.
You are able to switch between Provisioned and On Demand once per day.

**DAX (DynamoDB Accelerator)**
Fully-managed cluster in memory cache for DynamoDB.
Delivers up to 10X read performance improvement.
Microsecond performance for millions of requests per second.
Ideal for Read-Heavy or bursty workloads e.g: auction application, gaming, retail during black friday.
DAX is a write-through caching service, that means data is written to the cache as well as to the back end store at the same time.
You point your API calls to the DAX cluster instead of the Table, if data iis in cache (cache hit) cahced data is returned, else, data is loaded from table and returned and stays in cache.

**DynamoDB Transactions**
ACID (Atomic, Consistent, Isolated, Durable) Transactions.

1. Atomicity guarantees that each transaction is treated as a single "unit", which either succeeds completely, or fails completely: if any of the statements constituting a transaction fails to complete, the entire transaction fails and the database is left unchanged.
2. Consistency ensures that a transaction can only bring the database from one valid state to another, maintaining database invariants: any data written to the database must be valid according to all defined rules, including constraints, cascades, triggers, and any combination thereof.
3. Isolation guarantees the individuality of each transaction, and prevents them from being affected from other transactions.
4. Durability ensures transactions are saved permanently and do not accidentally disappear or get erased, even during a database crash.

**Conditional Write Operations**
Conditional writes are a way of asking DynamoDB to perform a write operation like PutItem , UpdateItem , or DeleteItem , but only if certain attributes of the item still have the values that you expect, right before the write goes through. You can have conditional PUT, Delete, Update and Transactions.

**Batch Operations**
BatchWriteItem, BatchGetItem

**Optimistic Lock with Version Number**
Optimistic locking is a strategy to ensure that the client-side item that you are updating (or deleting) is the same as the item in Amazon DynamoDB. If you use this strategy, your database writes are protected from being overwritten by the writes of others, and vice versa.
With optimistic locking, each item has an attribute that acts as a version number. If you retrieve an item from a table, the application records the version number of that item. You can update the item, but only if the version number on the server side has not changed.
If there is a version mismatch, it means that someone else has modified the item before you did. The update attempt fails, because you have a stale version of the item. If this happens, you simply try again by retrieving the item and then trying to update it.

**DynamoDB TTL**
Define an expiry time for your data. Expired items are marked for deletion and deleted.
Great for removing old irrelevant data such as expired sessions, event logs, temporary data.
Reduces cost by automatically removing unnecessary data.

**DynamoDB Streams**
A Time-ordered sequence of item level modifications (insert, updated, delete).
Logs are encrypted at rest and stored for 24 hours.
Accessed using a dedicated endpoint.
You can use trigger lambdas or listen to the stream in your application.
Events are recorded in near real-time.

**ProvisionedThroughputExceededException**
ProvisionedThroughputExceededException occurs when your request rate is higher than the read/write capacity provisioned for the table.
SDK will automatically retry the request until successful.
If you are not using the SDK you can reduce requests frequency and use Exponential Backoff.

**Exponential Backoff**
Exponential Backoff = Use progressive waits between consecutives retries. e.g: 50ms, 100ms, 200ms...
If after 1 minute this doesn't work then maybe verify that your request size is not exceeding the throughput for your read/write capacity.
This is a feature for every AWS Service in the SDK.

NOTES:

Understand the difference between LSI and GSI.
Understand the difference between Query and Scan.
2 consistency models: Strongly and Eventually Consistency.
Access is controlled using IAM policies.
Fine grained control using IAM Conditional Parameter `dynamodb:LeadingKeys` to allow users to access only the items where the partition key/value matches their user ID.
Indexes enable fast queries.
Partition keys + Sort Keys gives you different view of the database.
Queries: find items using primary query and sort keys.
Queries: are always sorted by sort keys in ascending order but you can set `ScanIndexForward` to false to reverse the sorting order.
Scans: Examines every item in the table, very expensive (\$) because it must read all items.
Queries and Scans by default returns all parameters, use the `ProjectionExpression` parameter to specify the attributes you want to return from the database.
Reduce the impact of queries and scans by setting a smaller page size which uses fewer read operations.
Isolate scan operations to specific tables and segregate them from your mission-critical traffic.
Try parallel scan rather than the default sequential scan.
Avoid using scan operations, if a query is to frequent it is better to create a Global Secondary Index to work on.

1 write capacity unit = 1 x 1KB write per second.
1 read capacity unit = 1 x 4KB consistent read per second.
1 read capacity unit = 2 x 4KB eventually consistent read per second.

**DAX**
DAX is an in-memory caching for readings. You point your API to DAX cluster instead of your table.
Some API Calls: GetItem, BatchGetItem, PutItem, BatchWriteItem.
It delivers microseconds performance for eventual consistent reads.
Dax provides operation costs reduction because you can reduce the required read capacity unit to serve intense or burst reading demands. DAX is ReadThrough/WriteThrough.

# Storage

## S3

It is an Object-based storage, it allows to upload files.
Files can be from 0 to 5TB and there are no limit for how many files you can upload.
The data is spread across multiple devices and facilities.
Buckets are like folders, which can have sub-folders. Bucket names must be unique globally.
Built for 99.99% availability.
AWs guarantees 99.999999% durability.
Tiered Storage available.
Versioning.
Encryption.
Secured Access with Access Control Lists and Bucket Policies.

**S3 core fundamentals**
Key (full path name).
Value (data).
Version ID.
metadata.
Sub-resources (Bucket policies, ACLs) and CORS.

Limits:
5G max put size (max file size is 5TB, so you need multi-part upload to upload files larger then 5GB)
3500 put requests/s.
5500 get requests/s.

**Data Consistency Models**

1. Read and Write consistency for PUTS of new Objects. This means as soon you upload the file it becomes available to read.
2. Eventual Consistency for overwrite PUTS and DELETES (can take some time to propagate).

S3 is a key-value store, the key is the name of the object and the value is the file data.
S3 also supports version control, so files have version ID.
Files have metadata (data about the stored file).

**Sub-resources**

1. Bucket Policies and Access Control Lists.
2. Cross Origin Resource Charing (CORS). Allows files located in one bucket to access files located in another bucket by specifying on the bucket the origin of request coming from another bucker.
3. Transfer Acceleration.

**Tired Storage**
More info here but vary occurs on read, for example glacier can take a while. see this
https://aws.amazon.com/s3/storage-classes/?nc=sn&loc=3#Performance_across_the_S3_Storage_Classes
S3 Standard storage class is designed for 99.99% availability.
S3 Standard-IA (IA = infrequently accessed) (charged when you retrieve the data, low ee to store) storage class is designed for 99.9% availability.
S3 One Zone-IA (IA = infrequently accessed) (data stored only in a single availability zone) storage class is designed for 99.5% availability.
S3 Glacier and S3 Glacier Deep Archive class are designed for 99.99% availability and SLA of 99.9% (takes between 3-5 hours to restore you data, very cheap to store, pays for GB read).
S3 Intelligent Tearing: Suitable for unknown and unpredictable pattern. It has two different tears, frequent and infrequent access. Automatically moves you data to the most cost-effective tear based on how frequently you access each object.

**Charges**
Per GB stored
Number of requests (GETm PUT, COPY etc).
Fee for storage management (Inventory, Analytics, Object Tags).
Fee for Data Management Pricing (data transfered out of S3).
Fee for transfer acceleration.

NOTES:
S3 is object based.
Files form 0 to 5TB.
Unlimited storage.
S3 is a universal namespace.
S3 Tiers. (S3 default, IA, One Zone IA, Glacier, Intelligent).
S3 core fundamentals
S3 core fundamentals.
read https://aws.amazon.com/s3/faqs/
Performance:
For GET-Intensive workloads use Cloudfront.
For Mixed-workloads avoid sequential key names for your objects. Instead add a random prefix like an hex or timestamp to the key name to prevent multiple objects from being store in the same partition (avoiding likelihood of IO contention).

**S3 Security**
By default all created buckets are private and only the owner can manage files.
You can control using ACL or Policies.
S3 buckets can be configured to create access logs, which logs all requests made to it. The logs can be stored in another bucket.

Bucker Policies: Applied at a BUCKET level.

ACLs: Applied at an OBJECT level.

**Policy Language Overview**

`Resources` – Buckets, objects, access points, and jobs are the Amazon S3 resources for which you can allow or deny permissions. In a policy, you use the Amazon Resource Name (ARN) to identify the resource. For more information, see Amazon S3 Resources.

`Actions` – For each resource, Amazon S3 supports a set of operations. You identify resource operations that you will allow (or deny) by using action keywords.
For example, the s3:ListBucket permission allows the user to use the Amazon S3 GET Bucket (List Objects) operation. For more information, see Amazon S3 Actions.

`Effect` – What the effect will be when the user requests the specific action—this can be either allow or deny.
If you do not explicitly grant access to (allow) a resource, access is implicitly denied. You can also explicitly deny access to a resource.You might do this to make sure that a user can't access the resource, even if a different policy grants access. For more information, see IAM JSON Policy Elements: Effect.

`Principal` – The account or user who is allowed access to the actions and resources in the statement. In a bucket policy, the principal is the user, account, service, or other entity that is the recipient of this permission. For more information, see Principals.

`Condition` – Conditions for when a policy is in effect. You can use AWS‐wide keys and Amazon S3‐specific keys to specify conditions in an Amazon S3 access policy. For more information, see Amazon S3 Condition Keys.

**S3 Encryption**
SSL/TLS (in-transit)
At rest: use x-amz-server-side-encryption: AES256
Ideally, to enforce the use of encryption for a bucket, because encryption only happen if PUT request includes the x-amz-server-side-encryption, it is safer to create a Policy to deny all PUT requests that dont' include x-amz-server-side-encryption.

1. SS3-S3: S3 Managed Keys. (the encryption key is also encrypted with another key that AWS rotates periodically).
2. SSE-KMS: AWS Key Management Service, Managed Keys.
3. SSE-C: Server side encryptions with customer provided keys.

**transfer acceleration**
Amazon S3 Transfer Acceleration enables fast, easy, and secure transfers of files over long distances between your client and an S3 bucket. Transfer Acceleration takes advantage of Amazon CloudFront’s globally distributed edge locations. As the data arrives at an edge location, data is routed to Amazon S3 over an optimized network path.

**S3 Select**
S3 Select capability is designed to pull out only the data you need from an object, which can dramatically improve the performance and reduce the cost of applications that need to access data in S3.
Most applications have to retrieve the entire object and then filter out only the required data for further analysis. S3 Select enables applications to offload the heavy lifting of filtering and accessing data inside objects to the Amazon S3 service. By reducing the volume of data that has to be loaded and processed by your applications, S3 Select can improve the performance of most applications that frequently access data from S3 by up to 400%.
You can use S3 Select from the AWS SDK for Java, AWS SDK for Python, and AWS CLI.

# Distribution

## CloudFront

CloudWatch is a metric repository, metrics have retention period, across the dirrerent services CloudWatch has default metrics and you can create your own custom metrics.
CloudWatch has alarms, which is a way to watch metrics and trigger SNS or SQL when a specific condition is met.

Terminology:
Origin: This is the origin of all files that the CDN will distribute. Origin can be an S3, EC2 instance, ELB or Route53.
EdgeLocation: Location where content is cached and can also be written. Separate to an AWS Region/AZ.
Distribution: This is the name given to the CDN, which consist of a collection of Edge locations.
Web Distribution: Typically used for websites.
RTMP: Used for media streaming.

MaxCache: 365 days (31536000 milliseconds).
Default: 24 hours (86400 milliseconds).
Forward Cookies:

NOTES:
Learn the terminology.

## SNS

Push notifications to Apple, Google, Fire OS and Windows devices as well as Android devices in China with Baidu Cloud Push.
SNS can also deliver messages by SMS, email, SQS or any HTTP endpoint.
SNS notifications can also trigger Lambda functions: when a message is published to an SNS topic that has a Lambda function subscribed to it, the Lambda is invoked with the payload of the published message.
Stored redundantly across multiple AZs.
Push based (not need for pulling). Follows a Pub-Sub pattern.

**SNS vs SQL**
SNS is push based and SQS is pull based.

**Topics**
SNS allows you to group multiple recipients using topics. A topic is an access point for allowing recipients to dynamically subscribe for identical copies of the same notification. One topic can support deliveries to multiple endpoint types. For example you could group together IOS, Android and SMS recipients. When you publish to a topic, SNS delivers appropriately formatted copies of your message to each subscriber.

## SES (Simple Email Service)

SES is a cost-effective, flexible, and scalable email service that enables developers to send mail from within any application. You can configure Amazon SES quickly to support several email use cases, including transactional, marketing, or mass email communications. Amazon SES's flexible IP deployment and email authentication options help drive higher deliverability and protect sender reputation, while sending analytics measure the impact of each email. With Amazon SES, you can send email securely, globally, and at scale.

Can also be used to receive emails: incoming emails can be delivered automatically to an S3 bucket.

Incoming emails can be used to trigger Lambda functions and SNS notifications.

# Streams and Queues

## SQS

Simple Queue Service
Distributed queue system, Pull Based (SNS is Push Based).
Visibility Timeout: When message is read it becomes invisible, when the visibility timeout expires the message is readable again. While a message is being processed it is hidden from other Workers. This can be set or reset to a maximum of 12 hours.

**Queues Types**
`Standard`

1. Nearly an unlimited number of transactions per second.
2. Guarantees that message is delivered at least once.
3. Due to highly distributed architecture (which allows high throughput) a message may be delivered more than once and out of order.
4. Best-effort ordering which ensures that messages are generally delivered in order.

`FIFO: First In First Out`

1. Delivery order is guaranteed.
2. Limited to 300 transactions per second but have all the capabilities of standard queues.

**Long Polling**
It is a way to retrieve messages from the queue. Regular short polling returns immediately and if the queue is empty it returns empty and you pay for this request, with long polling your request waits until a message is available in the queue or the long polling times out. This saves you money.
MAx long pooling timeout is 20 seconds.

NOTES:
SQS is pull based.
Messages are 256Kb max size.
Messages are kept in queue from 1 minute to 14 days.
Default retention period is 4 days.
SQS guarantee that a message will be delivered at least once.
Default message visibility is 30 seconds (increase it if the task that handles it takes longer, max is 12 hours).

**API Calls**
ChangeMessageVisibility

**Delay Queues**
You can postpone the delivery of a message to a queue for a number of seconds.
Default delay is 0 max is 900 seconds.
For the standard queue, changing this settings won't affect messages already in the queue.
For FIFO queues, the change will affect the messages already in the queue.

**Large Messages**
For large message, from 256KB to 2GB, use S3 to store the message and use AWS SQS Extend Client library for Java to manage them.

**Encryption**
You can enable encrypted messages in both Standard and FIFO queues using a key provided by AWS KMS.
To enable SSE for a queue, you can use the AWS-managed customer master key (CMK) for Amazon SQS or a custom CMK.
To enable SSE for a new or existing queue using the Amazon SQS API, specify the customer master key (CMK) ID: the alias, alias ARN, key ID, or key ARN of the an AWS-managed CMK or a custom CMK by setting the KmsMasterKeyId attribute of the CreateQueue or SetQueueAttributes action.
To send messages to an encrypted queue, the producer must have the kms:GenerateDataKey and kms:Decrypt permissions for the CMK.
To receive messages from an encrypted queue, the consumer must have the kms:Decrypt permission for any CMK that is used to encrypt the messages in the specified queue.

## Kinesis

Amazon Kinesis makes it easy to collect, process, and analyze real-time, streaming data so you can get timely insights and react quickly to new information.
Amazon Kinesis offers key capabilities to cost-effectively process streaming data at any scale, along with the flexibility to choose the tools that best suit the requirements of your application. With Amazon Kinesis, you can ingest real-time data such as video, audio, application logs, website slipstreams, and IoT telemetry data for machine learning, analytics, and other applications. Amazon Kinesis enables you to process and analyze data as it arrives and respond instantly instead of having to wait until all your data is collected before the processing can begin.

Three code services: Suitable

1. Kinesis Streams
   Pipe data produced on different environments, phones, web, ec2 instance etc to Kinesis. The data is stored in shards. Then the data consumers (EC2 instances). If you want to send stream records directly to services such as Amazon Simple Storage Service (Amazon S3), Amazon Redshift, Amazon Elasticsearch Service (Amazon ES), or Splunk, you can use a Kinesis Data Firehose delivery stream instead of creating a consumer application.
   Consumers can be applications that aggregate the data and store that some place else.
   Each shard gives you:
   5 transactions per second for reads up to a maximum data read rate of 2MB per second.
   Up to 1000 records per second for writes, up to a maximum total data rate of 1MB per second.
   The capacity of your stream is based on the number of shards you specify for the stream.

By default data is stored for 24 hours but this can be increased to 7 days.

2. Kinesis Firehose
   Pipes data directly to services such as Amazon Simple Storage Service (Amazon S3), Amazon Redshift, Amazon Elasticsearch Service (Amazon ES), Splunk and Lambda.
   You don't need to concern about shards, capacity etc. It auto scales.

3. Kinesis Analytics
   Amazon Kinesis Data Analytics is the easiest way to analyze streaming data using SQL in real time.

**Shards Capacity**
Per Shard:
5 reads/s up to max of 2MB/s.
1000 writes/s up to max of 1MB/s.
As your data rate increases you increase the number of shards, and this is called resharding.

**Consumers**
Consumers (EC2s) use the Kinesis client library. The library tracks the number of shards in your stream and they will discover new shards whenever you reshard.
The Kinesis Client Library (KCL) ensures that for every shard there is a record processor.
It manages the number of record processors relative to the number of shards & consumers.
If you have only one consumer, the KCL will create all the record processors on a single consumer.
If you have two consumers it will load balance and create half the processors in one instance and half in the other.

**Scaling**
With KCL, generally you should ensure that the number of instances does not exceed the number of shards (except for failure and standby purposes).
You never need multiple instances to handle the processing load of one shard.
One worker can process multiple shards.
Use CPU Utilization to drive the quantity of consumer instances you need, not the number of shards in your stream.
Use the autoscaling group, and base scaling decisions on CPU load.

**Security**
Kinesis provides Encryption in Flight with HTTPS.
It also allows for server-side encryption, which automatically encrypts data before it's at rest by using an AWS KMS customer master Key (CMK) you specify. Data is encrypted before it is written to the Kinesis stream storage layer, and decrypted after it is retrieved from storage.

NOTES:
In the exam you will be given different scenarios and you have to identify which kinesis service should be used.

# CI/CD

## CodeCommit

Source Control.

## CodeBuild

Compiles source code, run tests and produces packages to be deployed.

**Encryption**
If you want to encrypt CodeBuild build output artifacts you have to specify a KMS key to use. CodeBuild needs access to an AWS KMS customer master key (CMK). By default CodeBuild uses the AWS-managed CMK for Amazon S3 in your AWS account. You can

NOTES:
Remember the docker commands to build tag and push docker images

Login to ECR `$(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)`

Build image based on ECR image `docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .`
The docker build command builds Docker images from a Dockerfile and a “context”. A build’s context is the set of files located in the specified PATH or URL.

Tag Image `docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG`

Push Docker Image to ECR `docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG`

## CodeDeploy

Automate code deployment to any instance, including EC2, Lambda and On-premises.

**types of deployment**

1. In-Place: The application is stopped on each instance and the update is applied.
   RollBack is through re-deploying the previous version.
2. Blue-green: New instances are provisioned and the new version is deployed to them, then these instances are promoted to production (loadbalancer points to them) and the other removed.
   RollBack is easy, just set the loadbalancer to redirect to the previous environment.
   Here you pay for the two environments until you terminate the old servers.

**AppSpec File**
A configuration file which define the parameters to be used during a CodeDeploy deployment. With deployment based on EC2 AppSpec must be written in YAML, with Lambda it can be written in YAML and JSON.

The four significant sections of the file:

1. version: 0.0
2. os: The operation system version (linux or windows).
3. files: the location of any application files that need to be copied and where they should be copied to.
4. hooks: Lifecycle events hooks. Scripts which need to run at certain points in the deployment lifecycle. Hooks have a very specific run order.

**LifeCycle Hooks**

In-Place Deployment: The whole process has 3 phases.
Phase 1: De-register instance to deploy from he loadbalancer.
Hooks: BeforeBlockTraffic, BlockTraffic, AfterBlockTraffic.
Phase 2: Deploy the application (most things happen here).
Hooks: ApplicationStop, DownloadBundle, BeforeInstall, Install, AfterInstall, ApplicationStart, ValidateService.
Phase 3: Re-register instance with load balancer.
Hooks: BeforeAllowTraffic, AllowTraffic, AfterAllowTraffic.

ApplicationStop -> DownloadBundle -> BeforeInstall -> Install -> AfterInstall -> ApplicationStart -> ValidateService.

```
version: 0.0
os: linux
files:
   - source: config/config.txt
     destination: /webapps/config
   - source: source
     destination: /webapps/myApp
hooks:
   BeforeInstall:
      - location: scripts/unzipResource.sh
      - location: scripts/unzipData.sh
   AfterInstall:
      - location: scripts/runTests.sh
         timeout: 180
   ApplicationStart:
      - location: scripts/runFunctionalTests.sh
         timeout: 180
   ValidateService:
      - location: scripts/monitorService.sh
         timeout: 180
         runas: codedeployuser
```

The `appspec.yml` file must be placed in the root folder of your application deployment package.
For the above example we'd have a folder with the `appspc.yml` and sub-folders `config/`, `sorce/` and `scripts/`

NOTES:
Learn everything about the appspec file.
Remember the lifecycle hooks (there are many).

## CodePipeline

Fully manage CI/CD Service. It manages the entire workflow (from commit, to build to deploy).
Orchestrates Build, Test and Deploy. The pipeline is triggered every time there is a change in your code (configurable).
It integrates with github, jenkins ans other aws services, beanstalk, cloudformation, lambda, ECS.

## CloudFormation

Infrastructure as code.
It always source its templates from S3.
Resources are defined using a CloudFormation template, YAML or JSON.
CloudFormation interprets the template and makes the appropriate API calls to create the resources you have defined. The resulting resources are called a stack.

If during the creation phase any resource in the stack cannot be created, CloudFormation will delete the previous created resources and the stack creation is terminated.

Template Structure:

```
{
  "AWSTemplateFormatVersion" : "version date",

  "Description" : "JSON string",

  "Metadata" : {
    template metadata //Objects that provide additional information about the template.
  },

  "Parameters" : {
    Values to pass to your template at runtime (when you create or update a stack). You can refer to parameters from the Resources and Outputs sections of the template.
  },

  "Mappings" : {
    A mapping of keys and associated values that you can use to specify conditional parameter values, similar to a lookup table. You can match a key to a corresponding value by using the Fn::FindInMap intrinsic function in the Resources and Outputs sections.
  },

  "Conditions" : {
    Conditions that control whether certain resources are created or whether certain resource properties are assigned a value during stack creation or update. For example, you could conditionally create a resource that depends on whether the stack is for a production or test environment.
  },

  "Transform" : {
    For serverless applications (also referred to as Lambda-based applications), specifies the version of the AWS Serverless Application Model (AWS SAM) to use. When you specify a transform, you can use AWS SAM syntax to declare resources in your template. The model defines the syntax that you can use and how it is processed.
    You can also use AWS::Include transforms to work with template snippets that are stored separately from the main AWS CloudFormation template. You can store your snippet files in an Amazon S3 bucket and then reuse the functions across multiple templates.
  },

  "Resources" : { (the only mandatory section of the template)
    Specifies the stack resources and their properties, such as an Amazon Elastic Compute Cloud instance or an Amazon Simple Storage Service bucket. You can refer to resources in the Resources and Outputs sections of the template.
  },

  "Outputs" : {
    Describes the values that are returned whenever you view your stack's properties. For example, you can declare an output for an S3 bucket name and then call the aws cloudformation describe-stacks AWS CLI command to view the name. Exported output values must have a unique name within a single region to avoid conflicts.
  }
}

```

**Serverless Application Model SAM**
It is an extension to CloudFormation used to defined serverless applications.
Simplified syntax for defining serverless resources: APIs Lambda Functions, DynamoDB Tables etc.

Use the SAM CLI to package your deployment code, upload it to S3 and deploy your serverless application.
`sam package`: packages your app and uploads to S3.
`sam deploy`: deploys your serverless application using CloudFormation.

Example:

```
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31  // => This is what tell CloudFormation that this is a SAM application
Resources:
  TestFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs12.x
      Environment:
        Variables:
          S3_BUCKET: cfsambucket
```

**CloudFormation Nested Stacks**
It allows for reuse of of CloudFormation code for common use cases.
e.g: standard configuration for a loadbalancer, web server, application server etc.
So instead of copying code each time, create a standard template for each common use case and reference from within your CloudFormation template.

Example:

```
AWSTemplateFormatVersion: '2010-09-09'
Resources:
   Type: AWS::CloudFormation::Stack // we specify here that this resource is coming from a stack
   Properties:
      NotificationARNs:
         - String
      Parameters:
         AWS CloudFormation Stack Parameters
      Tags:
         - Resource Tag
      TemplateURL: https://aws.amazon.com/s3/.../template.yml  // here we indicate where the nested stack file is

```

**Parameters and Functions**
`!GetAtt`: Intrinsic function which returns the value of a parameter of an attribute from a resource in the template. We can use it to get for example, the region ID attribute of the required instance in the resource.
`Ref`: The intrinsic function Ref returns the value of the specified parameter or resource.

Exams tips:
Remember `buildspac.yml` file is for CodeBuild
Remember `appspec.yml` file is for CodeDeploy

### Notes on security

Security Groups: Used for EC2, RDS where they act as firewalls to restrict/allow connection to services.
ACL: Access Control Lists is for S3, work on bucket and Object levels.
Bucket Policies: For S3, work only on bucket and object levels.
IAM Policies: More global, many services.

- Use S3 bucket policies if you want to:
  Control access in S3 environment
  Know who can access a bucket
  Stay under 20kb policy size max

- Use IAM policies if you want to:
  Control access in IAM environment, for potentially more than just buckets
  Manage very large numbers of buckets
  Know what a user can do in AWS
  Stay under 2-10kb policy size max, depending if user/group/role

- Use ACLs if you want to:
  Control access to buckets and objects
  Exceed 20kb policy size max
  Continue using ACLs and you're happy with them

# Monitoring

## X-Ray

AWS X-Ray helps developers analyze and debug production, distributed applications, such as those built using a microservices architecture. With X-Ray, you can understand how your application and its underlying services are performing to identify and troubleshoot the root cause of performance issues and errors. X-Ray provides an end-to-end view of requests as they travel through your application, and shows a map of your application’s underlying components. You can use X-Ray to analyze both applications in development and in production, from simple three-tier applications to complex microservices applications consisting of thousands of services.

**X-Ray can help**
Create a Service Map.
Identify Errors and Bug by analyzing the response code for each request made in your application.
Identify performance bottlenecks.
It provides a set of query APIs so you can build your own analysis and visualization apps.

**Architecture**

Use AWS X-Ray SDK in the application, you need to install AWS X-Ray daemon in the box(es) you want to monitor (it listens UDP), then the SDK publishes a JSON using UDP, the daemon captures it and sends to X-Ray API.

The X-RAy SDK provides:

1. Interceptors to add to your code to trace incoming HTTP requests.
2. Client handlers to instrument AWS SDK clients that your application uses to call other AWS services.
3. An HTTP client to use to instrument calls to other internal and external HTTP web services.

**X-Ray Integrations**
X-Ray integrates with the following AWS Services:
Elastic Load Balancing.
AWS Lambda.
Amazon API Gateway.
Amazon Elastic Computer Cloud (EC2).
AWS Elastic Beanstalk.

It supports all languages supported by Lambda.
Java, Go, NodeJS, Python, Ruby and .Net

The AWS X-Ray SDK send the data to the X-Ray daemon which buffers segments in a queue and uploads them to X-Ray in batches.
You need both the X-Ray SDK and daemon in your system.
On Premises or EC2: Install the daemon on your machines or instances.
Beanstalk: Instal on the EC2 instances inside your beanstalk environment.
Elastic Container Service: In Amazon ECS, create a Docker image that runs the X-Ray daemon, upload it to a Docker image repository, and then deploy it to your Amazon ECS cluster.

**Anotations and Metadata**
`Annotations` are key-value pairs with string, number, or Boolean values. Annotations are indexed for use with filter expressions. Use annotations to record data that you want to use to group traces in the console, or when calling the GetTraceSummaries API.

`Metadata` are key-value pairs that can have values of any type, including objects and lists, but are not indexed for use with filter expressions. Use metadata to record additional data that you want stored in the trace but don't need to use with search.

NOTES:
Understand what it is.
What the SDK provides.
What it integrates with.
Remember the languages it supports.

## CloudWatch

Amazon CloudWatch is a monitoring and observability service built for DevOps engineers, developers, site reliability engineers (SREs), and IT managers. CloudWatch provides you with data and actionable insights to monitor your applications, respond to system-wide performance changes, optimize resource utilization, and get a unified view of operational health. CloudWatch collects monitoring and operational data in the form of logs, metrics, and events, providing you with a unified view of AWS resources, applications, and services that run on AWS and on-premises servers.

**Monitoring EC2**
By default CloudWatch monitors the following properties:

1. CPU
2. Network
3. Disk
4. Status Check (health of EC2 instance and EC2 host).

1, 2, 3 are called Host Level Metrics.

CloudWatch logs are stored the data indefinitely by default but you can customize the retention period for each Log Group at a time.

NOTES:
Ram utilization is a custom metric.
By default EC2 monitoring is 5 minutes interval (enable detailed monitoring for 1 minute interval).
Default Ec2 properties that are monitored.

**CloudWatch vs CloudTrail**
CloudTrail monitor API calls.
We also have aWS Config, which records the state of your AWS environment and can notify you when changes occur.

## CloudTrail

AWS CloudTrial stores logs on API usage on S3, it can be used to help you answer questions requiring detailed analysis such as:
Who shut down a specific instance?
Who changed a security group configuration?
Is any activity coming from an unknown IP address?
What activities were denied due to lack of permissions?

## AWS Application Discovery Service

AWS Application Discovery Service helps enterprise customers plan migration projects by gathering information about their on-premises data centers.
Planning data center migrations can involve thousands of workloads that are often deeply interdependent. Server utilization data and dependency mapping are important early first steps in the migration process. AWS Application Discovery Service collects and presents configuration, usage, and behavior data from your servers to help you better understand your workloads.
The collected data is retained in encrypted format in an AWS Application Discovery Service data store. You can export this data as a CSV file and use it to estimate the Total Cost of Ownership (TCO) of running on AWS and to plan your migration to AWS. In addition, this data is also available in AWS Migration Hub, where you can migrate the discovered servers and track their progress as they get migrated to AWS.

# Other

## AWS CLI

NOTES::
Always give your users the minimum amount of access required.
You are not expected to know much about the CLI commands bu try to learn some S3 commands.

**pagination**
When you run an AWS CLI command, by default it paginates the result with a page size of 1000.
So if you run `aws s3api list-objects mybucket` and the bucket has 3K objects, the CLI makes 3 API calls to S3 but displays the entire output at once.
For this cases you are likely to see a `timed out` error, because the API call has exceeded the max allowed time to fetch the required results.
You can fix this by adjusting the default page size with `--page-size` option to request a smaller page size.
e.g: `aws s3api list-objects mybucket --page-size 100`.
Another option for a few commands is to use the option `--max-items`.

When you do the above the AWS CLI will still return the full list of objects but it will perform more API calls in the background.

NOTES:
If you see "timeout" error, adjust page size.

## Test Axioms

1. Always check security groups and network access control list when troubleshooting.
2. Instances launched into a private subnet in a VPC can't access the internet unless you use NAT.
3. You need an IGW (Internet Gateway) and a route in the route table to talk to the internet.
4. EBS volumes are loosely coupled to EC2 instances, can attache and detach except for the root volume.

## Whitepaper and Videos

[VPC Fundamentals and Connectivity Options](https://www.youtube.com/watch?v=jZAvKgqlrjY)
[Serverless Architectureswith AWS Lambda](https://d1.awsstatic.com/whitepapers/serverless-architectures-with-aws-lambda.pdf)
[AWS Security Best Practices](https://d1.awsstatic.com/whitepapers/Security/AWS_Security_Best_Practices.pdf)
[Become an IAM Policy Master in 60 Minutes or Less](https://www.youtube.com/watch?v=YQsK4MtsELU&t=2s)
[Running Containerized Microservices on AWS](https://d1.awsstatic.com/whitepapers/DevOps/running-containerized-microservices-on-aws.pdf)
