# Databases and Well-Architected Framework

## Well-Architected Framework

Each pillar has: Design principles, Definition, Best Practices and Key AWS services associated with this pillar and resources.

Design principles :

1. Do not guess your capacity.
2. Automate your architecture using cloud formation/Chef.
3. Allow for evolutionary architecture through incremental change (design based on changing requirements).
4. Improve through testing the system at regular event days (AKA game days).
5. Test your system at scale of real time production system.
6. Data driven architecture.

Pillars:

1. Security
   Data : data at rest and data at transit (encrypt/SSL)
   Privilege management : root account , defining roles and groups,access to resources and managing keys and credentials.
   Infrastructure protection:Network and host level boundary, service level protections level protection.
   Detective control: capturing and monitoring AWS logs.

2. Reliability
   Foundation : Service limits ,Network topology , handling technical issues.
   Change Management :adapting the change on demand, monitoring resources,
   Failure Management : backing up data, component failure and recovery.

3. Performance Efficiency
   Compute : instance type, post launch instance state, is it meeting your demand
   Storage :appropriate storage,monitoring, throughput is matching demand.
   Database :appropriate db,monitoring, throughput is matching demand.
   Space time trade off : proximity and caching solution, performance is expected.

4. Cost optimization
   Match supply and Demand : should not exceed your budget,optimize your usage.
   Cost effective resources : correct resource cost target, pricing model, using managed service to reduce the cost like RDS to DynamoDB etc.
   Expenditure awareness : usage and spending,decomission resources, data transfer charges, resource getting used for user not active any more .
   Optimising over time : adopting new services (like Lamda) from was blogs etc.

5. Operational Excellence
   Preparation : what best practices are getting used, configuration management.
   Operation: evolving workload with minimizing the impact, monitor workload expectation.
   Responses :Responding to unplanned events, managing escalation for these events.

## RDS

`Operations`: small downtime when failover, maintenance happens. Restore EBS implies manual intervention.
`Security`: AWS is responsible for OS security, we are responsible for setting up KMS, security groups, IAM policies, authorizing users in DB, using SSL.
`Reliability`: Multi AZ feature and failover.
`Performance`: Depends on EC2 instance type , EBS volume type, ability to add Read Replicas. It doesn't auto-scale. Up to 5 Read Replicas.
`Cost`: Pay per hour based on provisioned Ec2 and EBS.

## Aurora

Compatible API Postgre and MySQL
Data is held in 6 replicas across 3 AZ.
Auto healing capability.
Multi AZ, Auto Scaling Read Replicas.
Read Replicas can be global.
Aurora can be global for DR (Disaster Recovery) or latency purposes.
Auto-scaling of storage from 10GB to 64TB.
We have to define the instance type for aurora instances but this can be changed anytime.
"Aurora Serverless" option which remove all need to manage resources.
`use case`: Same as RDS but less operations, more flexibility and performance. This is an enterprise grade database. It is more expensive.

`Operations`: Less operation, auto-scaling storage.
`Security`: AWS is responsible for OS security, we are responsible for setting up KMS, security groups, IAM policies, authorizing users in DB, using SSL.
`Reliability`: Multi AZ, highly available with 6 replicas and also the serverless option.
`Performance`: 5x more performance than RDS. Up to 15 Read Replicas ()
`Cost`: Pay per hour based on provisioned Ec2 and storage usage. Possible lower costs compared to enterprise grade DBs such as Oracle.

## ElastiCache

Managed Redis / Memecached.
In-memory data store, sub-milliseconds latency.
Must provision and EC2 instance type.
Support for Cluster and Multi AZ, Read Replicas (sharding) when using Redis.
Security through IAM, Security Groups, KMS and Redis Auth.
Backup / Snapshot / Point in time restore failure.  
Managed and scheduled maintenance.
Monitor through CloudWatch.

`Operations`: small downtime when failover, maintenance happens. Restore EBS implies manual intervention.
`Security`: AWS is responsible for OS security, we are responsible for setting up KMS, security groups, IAM policies, authorizing users with Redis Auth, using SSL.
`Reliability`: Clustering, Multi AZ (Redis).
`Performance`: Sub-millisecond performance, in memory, read replicas for sharding.
`Cost`: Pay per hour based on provisioned EC2 and storage usage.

## DynamoDB

Managed NoSQL, proprietary to AWS.
Serverless, provisioned capacity, auto scaling, on demand capacity.
Can replace ElastiCache as key/value store (not as fast unless using DAX).
Highly available, Multi AZ by default, Read and Writes are decoupled, DAX for read caching.
Reads can be eventually consistent or strongly consistent.
Security, authentication and authorization is done through IAM.
DynamoDB stream to integrate with Lambda.
Backup / restore feature.
Global Tables for improved latency and availability.
Can only be queried on primary key, sor key and local/Global indexes.
Has transaction capabilities.
Max row size is 400KB.

`Operations`: fully managed.
`Security`: full security through IAM policies, KMS encryption, SSL in flight.
`Reliability`: Multi AZ and Backups (When enabled, DynamoDB maintains incremental backups of your table for the last 35 days until you explicitly turn it off. You can enable PITR or initiate backup and restore operations with a single click in the AWS Management Console or a single API call).
`Performance`: Single digit millisecond performance, DAX for caching reads (10 times performance improvement—from milliseconds to microseconds), performance doesn't degrade if your application scales (can scale to 100s of terabytes).
`Cost`: Pay per provisioned capacity and storage usage (no need to provision and can auto-scale).

## S3

Although not a read database (Object-based storage), it behaves as one. We can store key/value, ideal for big objects.
Infinite storage, serverless.
Max object size is 5TB (max upload size is 5GB).
Eventual consistency for overrides and deletes.
Tiers: Standard, IA, One Zone IA, Glacier, Glacier Deep.
Features: Versioning, Encryption, Cross Region Replication.
Security: IAM, Bucket Policies (object policies), ACL.
Encryption: SSE-S3, SSE-KMS, SSE-C, client-side encryption, SSL in transit.

`Operations`: nothing.
`Security`: IAM, Bucket policies, Object policies, ACL, encryption (Server/Client), and SSL.
`Reliability`: 11 9s durability, 4 9s availability, Multi AZ by default, Cross Region Replication (CRR).
`Performance`: Scales to thousands of read/write per second, has transfer acceleration (using CloudFront network edges) and supports multi-part upload.
`Cost`: Per per storage, network costs, read depending on the tier.

## Athena

Fully Serverless query engine with SQL capabilities, not a database because it doesn't hold data, but it behaves as one with the data on S3.
Per per query and terabyte of data scanned.
Output result is saved back to a S3 bucket.
Secured through IAM.
use case: serverless query on S3, logs analyse etc.

`Operations`: nothing.
`Security`: IAM + S3 security.
`Reliability`: Managed service, highly available.
`Performance`: Queries scale based on data size.
`Cost`: Per per query and terabyte of data scanned.

## Redshift

Based in Postgres SQL but adjusted for OLAP (online analytics processing) workloads (analytics and data warehouse).
10x better performance than other data warehouses, scale to PBs of data.
Columnar storage of data (instead of row based like PostgresSQL).
The database is highly distributed and so it has a massive parallel query execution (MPP) capability, highly available.
Pay as you go based on instances provisioned.
Has a SQL interface for performing queries.
use case: as a query layer to integrate with other BI tools like Quicksight or Tableau.
Data is loaded from S3, DynamoDB, DMS (Database Migration Service) and other DBs (for example you can pull from a read replica in RDS).
It can scale from 1 node to up to 128 nodes, up to 160GB of space per node.
It has two types of nodes, `leader node` (for query planning and results aggregation) and `compute nodes` (for performing the queries and send the result to leader node).
Backup / Restore, Security VPC, IAM, KMS, CloudWatch Monitoring.
Redshift Enhanced VPC Routing: When enabled, all Copy/Unloaded data goes through VPC, this gives you enhanced security and performance as it supports the use of standard VPC features such as VPC Endpoints, security groups, network ACLs, managed NAT and internet gateways, enabling you to tightly manage the flow of data between your Amazon Redshift cluster and all of your data sources.

Snapshots: Point in time backups of a cluster, stored in S3. The snapshots are incremental. Snapshots can be automated every 8 hours or 5 GB, or on schedule and we can set the retention period. Also allows for manual snapshots. We can configure snapshots to be copied to another region for better DRS.

Redshift Spectrum: perform queries straight on S3 (no need to load the data). Not serverless like Athena because we need to provide the Redshift cluster to compute the results with the compute node + leader node. Once we fire a query Redshift Spectrum will fire thousands of Spectrum nodes to perform the query, giving it a massive parallel capacity.

`Operations`: similar to RDS, small downtime when failover, maintenance happens. Restore EBS implies manual intervention.
`Security`: IAM, VPC, KMS, SSL.
`Reliability`: Highly available with auto healing features.
`Performance`: 10x performance compared to other data warehouse solutions. Also data compression is available.
`Cost`: Per per node provisioned, 1/10th of costs of other data warehouse solutions.

## Neptune

Fully managed graph database. A graph database is a database that uses graph structures for semantic queries with nodes, edges, and properties to represent and store data. A key concept of the system is the graph.
It best used when relationship between data is very important, for example social network graphs, wikipedia etc.
Highly available across 3 AZ with up to 15 Read Replicas.
Point-in-time recovery and continuous backup to S3.
Support for KMS encryption at rest + HTTPS.

`Operations`: small downtime when failover, maintenance happens. Restore EBS implies manual intervention.
`Security`: AWS is responsible for OS security, we are responsible for setting up KMS, security groups, IAM policies, authorizing users in DB, using SSL. Also IAM authentication.
`Reliability`: Multi AZ feature and clustering.
`Performance`: best suited fro graphs, clustering to improve performance.
`Cost`: Pay per node provisioned (similar to RDS).

## ElasticSearch

Solves a problem of text search without need for indexes like DynamoDB.
It is common to use ElasticSearch as a complement to a database.
It has also some usage for Big Data applications.
You can provision a cluster of instances.
Built-in integration with Kinesis Firehouse, AWs IoT and CloudWatch logs for data ingestion.
Security through Cognito & IAM, KMS encryption, SSL & VPC.
Comes with Kibana (visualization) & LogStash (log ingestion) - ELK stack.

`Operations`: small downtime when failover, maintenance happens. Restore EBS implies manual intervention.
`Security`: Security through Cognito & IAM, KMS encryption, SSL & VPC.
`Reliability`: Multi AZ feature and clustering.
`Performance`: good performance and petabyte scale.
`Cost`: Pay per node provisioned (similar to RDS).
