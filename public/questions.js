// AWS Certified Machine Learning Engineer – Associate (MLA-C01) Practice Questions
const PRACTICE_QUESTIONS = [
  // ============================================================
  // DOMAIN 1: DATA PREPARATION FOR ML
  // ============================================================
  {
    id: 1,
    domain: "Domain 1: Data Preparation for ML",
    question: "Your team stores 500 TB of raw training data in Amazon S3. You need to run feature engineering at scale before training. Which AWS service is best suited for distributed, serverless ETL on this data?",
    options: [
      "AWS Glue with Spark ETL jobs",
      "Amazon Kinesis Data Streams",
      "Amazon RDS with read replicas",
      "AWS Lambda with S3 triggers"
    ],
    answer: 0,
    explanation: "AWS Glue provides serverless, fully managed Apache Spark ETL at petabyte scale. Kinesis is for real-time streaming ingest, RDS is for relational workloads, and Lambda has a 15-minute timeout/memory ceiling not suited for large-scale batch transforms."
  },
  {
    id: 2,
    domain: "Domain 1: Data Preparation for ML",
    question: "You need to serve low-latency feature lookups (< 5ms) at inference time while also reading historical feature snapshots for training. Which SageMaker Feature Store configuration achieves this?",
    options: [
      "Use only the offline store backed by Amazon S3",
      "Use only the online store backed by Amazon DynamoDB",
      "Enable both online and offline stores; use online store for inference, offline for training",
      "Use Amazon ElastiCache instead of SageMaker Feature Store"
    ],
    answer: 2,
    explanation: "SageMaker Feature Store supports dual stores: the online store (DynamoDB-backed) for sub-millisecond inference lookups, and the offline store (S3-backed) for training data retrieval with point-in-time consistency to prevent data leakage."
  },
  {
    id: 3,
    domain: "Domain 1: Data Preparation for ML",
    question: "A dataset for a fraud detection model is 98% legitimate and 2% fraud. Which strategy best addresses this class imbalance when training with SageMaker?",
    options: [
      "Use accuracy as the primary metric and increase epochs",
      "Downsample the majority class or apply SMOTE; use Precision-Recall AUC or F1 as the evaluation metric",
      "Increase the learning rate to force the model to learn rare patterns",
      "Use the full imbalanced dataset with no modifications"
    ],
    answer: 1,
    explanation: "For severe class imbalance, accuracy is misleading (a model predicting all legitimate would score 98%). Best practices: downsample the majority class, oversample the minority (SMOTE), or apply class weights. Use Precision-Recall AUC or F1-Score which are robust to imbalance."
  },
  {
    id: 4,
    domain: "Domain 1: Data Preparation for ML",
    question: "You want to collect human-labeled annotations for a custom image classification model at scale, with built-in quality control using multiple annotators. Which AWS service should you use?",
    options: [
      "Amazon Rekognition Custom Labels",
      "SageMaker Ground Truth",
      "Amazon Mechanical Turk directly via API",
      "AWS Batch with custom labeling scripts"
    ],
    answer: 1,
    explanation: "SageMaker Ground Truth provides managed data labeling workflows with built-in quality control (annotation consolidation, worker agreement scoring). It can route tasks to Amazon Mechanical Turk, private teams, or AWS pre-trained workers, and supports active learning to reduce labeling costs."
  },
  {
    id: 5,
    domain: "Domain 1: Data Preparation for ML",
    question: "Which AWS service provides a visual, low-code interface for exploring, transforming, and visualizing ML training data directly in SageMaker Studio?",
    options: [
      "Amazon QuickSight",
      "SageMaker Data Wrangler",
      "AWS Glue DataBrew",
      "Amazon Athena"
    ],
    answer: 1,
    explanation: "SageMaker Data Wrangler is the visual data preparation tool integrated into SageMaker Studio. It provides 300+ built-in transformations, statistical visualizations, and bias detection, and can export flows directly to SageMaker Pipelines or feature store ingestion jobs."
  },
  {
    id: 6,
    domain: "Domain 1: Data Preparation for ML",
    question: "You need to ingest real-time clickstream data into your ML training pipeline for near-real-time model retraining. Which combination of AWS services best handles streaming ingest and durable storage?",
    options: [
      "Amazon Kinesis Data Streams → Amazon Kinesis Data Firehose → Amazon S3",
      "AWS Lambda → Amazon RDS → Amazon S3",
      "Amazon SQS → AWS Batch → Amazon EFS",
      "Amazon MSK → AWS Glue → Amazon Redshift only"
    ],
    answer: 0,
    explanation: "Amazon Kinesis Data Streams handles real-time ingest with sub-second latency. Kinesis Data Firehose then delivers the stream to Amazon S3 (or Redshift/OpenSearch) durably. This is the canonical AWS pattern for streaming data pipelines that feed ML training."
  },
  {
    id: 7,
    domain: "Domain 1: Data Preparation for ML",
    question: "Your training dataset contains 15% missing values in a key numerical feature. Which imputation strategy is most appropriate for a tabular regression problem?",
    options: [
      "Drop all rows with missing values",
      "Replace with the column mean or median; or use model-based imputation (KNN, iterative)",
      "Replace with the string 'NULL' and let the model handle it",
      "Duplicate existing rows to fill missing values"
    ],
    answer: 1,
    explanation: "Mean/median imputation is the standard baseline. For better accuracy, model-based imputation (KNN imputer, iterative imputer) uses surrounding features to predict the missing value. Dropping 15% of rows loses significant signal. Replacing with 'NULL' string in a numerical feature will break numeric models."
  },
  {
    id: 8,
    domain: "Domain 1: Data Preparation for ML",
    question: "When should you use Amazon Kinesis Data Firehose instead of Amazon Kinesis Data Streams for an ML data pipeline?",
    options: [
      "When you need sub-second latency and custom consumer processing",
      "When you need fully managed delivery to S3/Redshift/OpenSearch with no consumer code to write",
      "When you need replay of records from the last 7 days",
      "When you need to fan out to multiple downstream consumers simultaneously"
    ],
    answer: 1,
    explanation: "Kinesis Data Firehose is a fully managed delivery service — no consumer code needed. It buffers and batches records then delivers to S3, Redshift, or OpenSearch. Data Streams requires you to write custom consumer code (KCL/Lambda), supports replay, and fans out to multiple consumers. Choose Firehose for simple S3 delivery."
  },
  // ============================================================
  // DOMAIN 2: ML MODEL DEVELOPMENT
  // ============================================================
  {
    id: 9,
    domain: "Domain 2: ML Model Development",
    question: "You need to train an XGBoost classifier on a 10 GB tabular dataset stored in S3, without writing a custom training script. Which SageMaker capability should you use?",
    options: [
      "SageMaker Autopilot with XGBoost mode",
      "SageMaker built-in XGBoost algorithm with a SageMaker Estimator",
      "Amazon Comprehend custom classifier",
      "SageMaker JumpStart foundation model fine-tuning"
    ],
    answer: 1,
    explanation: "SageMaker provides XGBoost as a built-in algorithm. You simply create a SageMaker Estimator pointing to the XGBoost container, specify hyperparameters, and point to your S3 data — no custom training script required. SageMaker Autopilot would also work but adds full AutoML overhead."
  },
  {
    id: 10,
    domain: "Domain 2: ML Model Development",
    question: "Your team wants to automatically discover the best ML algorithm and hyperparameters for a tabular classification problem with minimal code. Which SageMaker feature should you use?",
    options: [
      "SageMaker Debugger",
      "SageMaker Autopilot",
      "SageMaker Experiments",
      "SageMaker Clarify"
    ],
    answer: 1,
    explanation: "SageMaker Autopilot is the SageMaker AutoML feature. It automatically explores multiple ML algorithms, generates candidate pipelines with preprocessing, trains and tunes models, and produces a leaderboard. It supports explainability reports and can be fully automated or semi-automated."
  },
  {
    id: 11,
    domain: "Domain 2: ML Model Development",
    question: "Which SageMaker feature allows you to track metrics, parameters, and artifacts across multiple training runs for comparison and reproducibility?",
    options: [
      "SageMaker Model Registry",
      "SageMaker Feature Store",
      "SageMaker Experiments",
      "SageMaker Pipelines"
    ],
    answer: 2,
    explanation: "SageMaker Experiments tracks training runs as trials within an experiment. You can log custom metrics (loss, accuracy), parameters (learning rate, batch size), and output artifacts, then compare them in SageMaker Studio. Model Registry manages model versions post-training; Pipelines orchestrates workflows."
  },
  {
    id: 12,
    domain: "Domain 2: ML Model Development",
    question: "You are training a deep learning model that has high training accuracy but poor validation accuracy. Which techniques should you apply to address this overfitting?",
    options: [
      "Reduce the number of epochs and decrease the learning rate",
      "Apply L1/L2 regularization, add dropout layers, use early stopping, and collect more training data",
      "Switch from GPU to CPU training to slow down the learning process",
      "Increase model complexity by adding more hidden layers"
    ],
    answer: 1,
    explanation: "Overfitting (high variance) is addressed by: regularization (L1/L2 adds penalty to weights), dropout (randomly zeroes neurons during training), early stopping (halt before validation loss increases), and data augmentation/collecting more data. Increasing complexity makes overfitting worse."
  },
  {
    id: 13,
    domain: "Domain 2: ML Model Development",
    question: "SageMaker Hyperparameter Tuning (HPO) uses which optimization strategy by default to efficiently search the hyperparameter space?",
    options: [
      "Grid search across all hyperparameter combinations",
      "Random search with uniform distribution",
      "Bayesian optimization using a surrogate model of previous results",
      "Genetic algorithm with tournament selection"
    ],
    answer: 2,
    explanation: "SageMaker Automatic Model Tuning (Hyperparameter Tuning) uses Bayesian optimization by default. It builds a probabilistic model (Gaussian process) of how hyperparameters affect the objective metric, then uses it to select the most promising parameters for the next trial — far more sample-efficient than grid or random search."
  },
  {
    id: 14,
    domain: "Domain 2: ML Model Development",
    question: "Which SageMaker built-in algorithm is most appropriate for detecting anomalies in a high-dimensional dataset where you don't have labeled anomaly examples?",
    options: [
      "Linear Learner with binary classification",
      "Random Cut Forest (RCF)",
      "XGBoost with anomaly_score objective",
      "K-Nearest Neighbors (KNN)"
    ],
    answer: 1,
    explanation: "SageMaker's Random Cut Forest (RCF) is designed for unsupervised anomaly detection. It assigns anomaly scores to data points based on how much including a point changes the complexity of a tree structure — high score = likely anomaly. No labels required."
  },
  {
    id: 15,
    domain: "Domain 2: ML Model Development",
    question: "Your model training job requires 8 GPU instances. Which SageMaker distributed training strategy should you use for a data-parallel workload with PyTorch?",
    options: [
      "SageMaker Pipe Mode with HDFS",
      "SageMaker Distributed Data Parallel (SageMaker DDP) library",
      "SageMaker Batch Transform with multi-instance scoring",
      "SageMaker Serverless inference with concurrency"
    ],
    answer: 1,
    explanation: "SageMaker's Distributed Data Parallel (DDP) library optimizes AllReduce gradient communication across instances on AWS infrastructure. It integrates with PyTorch's DDP and TensorFlow's MirroredStrategy, and is specifically optimized for SageMaker's networking fabric for better GPU utilization than vanilla Torch DDP."
  },
  {
    id: 16,
    domain: "Domain 2: ML Model Development",
    question: "SageMaker Debugger's primary purpose is to:",
    options: [
      "Monitor model endpoints for data drift in production",
      "Automatically detect training anomalies (vanishing gradients, overfitting) and emit actionable alerts",
      "Explain model predictions using SHAP values",
      "Version and register trained models in a central catalog"
    ],
    answer: 1,
    explanation: "SageMaker Debugger captures tensors during training and applies built-in rules (vanishing/exploding gradients, overfit, loss not decreasing, etc.) to automatically detect training problems and emit CloudWatch alerts. SageMaker Clarify handles SHAP explanations; Model Monitor handles production drift."
  },
  // ============================================================
  // DOMAIN 3: DEPLOYMENT AND ORCHESTRATION
  // ============================================================
  {
    id: 17,
    domain: "Domain 3: Deployment and Orchestration",
    question: "You need to run inference on 1 billion records in S3 overnight. Low latency is not a requirement. Which SageMaker inference option is most cost-effective?",
    options: [
      "SageMaker Real-Time Endpoint with auto-scaling",
      "SageMaker Batch Transform",
      "SageMaker Serverless Inference",
      "SageMaker Asynchronous Inference"
    ],
    answer: 1,
    explanation: "SageMaker Batch Transform is designed for offline, large-scale batch inference. It spins up instances, processes all records from S3, writes results to S3, then terminates — you only pay for the duration of the job. Real-Time Endpoints stay running (cost continues). Async Inference is for requests that take minutes, not bulk batch jobs."
  },
  {
    id: 18,
    domain: "Domain 3: Deployment and Orchestration",
    question: "You want to deploy two versions of a model to production simultaneously and route 10% of traffic to the new version for A/B testing. How do you achieve this with SageMaker?",
    options: [
      "Deploy two separate endpoints and use Route 53 weighted routing",
      "Create one SageMaker endpoint with two production variants and configure traffic weights",
      "Use SageMaker Multi-Model Endpoints with a custom routing header",
      "Use Amazon API Gateway canary deployments pointing to two Lambda functions"
    ],
    answer: 1,
    explanation: "SageMaker endpoints support multiple production variants with configurable traffic weights. Set variant 1 to weight 90 and variant 2 to weight 10 on a single endpoint. You can shift traffic gradually via UpdateEndpointWeightsAndCapacities without taking the endpoint offline."
  },
  {
    id: 19,
    domain: "Domain 3: Deployment and Orchestration",
    question: "You have 50 different customer-specific models, each small in size. Hosting 50 separate endpoints would be prohibitively expensive. Which SageMaker feature solves this?",
    options: [
      "SageMaker Serverless Inference with 50 concurrency slots",
      "SageMaker Multi-Model Endpoints (MME)",
      "SageMaker Asynchronous Inference with S3 queuing",
      "SageMaker Batch Transform with a routing file"
    ],
    answer: 1,
    explanation: "SageMaker Multi-Model Endpoints (MME) host multiple models on a single endpoint. Models are loaded/evicted from memory on demand using an LRU cache. You only pay for one endpoint instance regardless of model count — ideal for many small, customer-specific models that aren't all called simultaneously."
  },
  {
    id: 20,
    domain: "Domain 3: Deployment and Orchestration",
    question: "Which AWS service provides a native, purpose-built CI/CD pipeline orchestration for ML workflows, with built-in integration for SageMaker Training, Processing, and Model Registry?",
    options: [
      "AWS Step Functions with SageMaker integration",
      "Amazon MWAA (Managed Airflow)",
      "SageMaker Pipelines",
      "AWS CodePipeline with SageMaker actions"
    ],
    answer: 2,
    explanation: "SageMaker Pipelines is the purpose-built MLOps orchestration service. It natively integrates with all SageMaker job types (Training, Processing, Transform, Clarify, Tuning), Model Registry, and SageMaker Studio. It provides a DAG-based workflow with caching, lineage tracking, and CloudWatch integration."
  },
  {
    id: 21,
    domain: "Domain 3: Deployment and Orchestration",
    question: "Your ML endpoint receives inference requests that take 3-5 minutes to process (large video files). Users cannot wait synchronously. Which SageMaker inference option is best?",
    options: [
      "SageMaker Real-Time Inference with a 600-second timeout",
      "SageMaker Batch Transform scheduled hourly",
      "SageMaker Asynchronous Inference",
      "SageMaker Serverless Inference with maximum memory"
    ],
    answer: 2,
    explanation: "SageMaker Asynchronous Inference queues requests and processes them in the background, supporting payloads up to 1 GB and processing times up to 1 hour. The client gets a presigned S3 URL to poll for the result. Ideal for long-running inference tasks. Real-Time Inference has a 60-second synchronous timeout."
  },
  {
    id: 22,
    domain: "Domain 3: Deployment and Orchestration",
    question: "SageMaker Model Registry's primary purpose in an MLOps pipeline is to:",
    options: [
      "Store raw training datasets and feature definitions",
      "Version, approve, and manage the deployment lifecycle of trained models",
      "Monitor production model performance and detect drift",
      "Orchestrate the sequence of training, evaluation, and deployment steps"
    ],
    answer: 1,
    explanation: "SageMaker Model Registry is the centralized catalog for trained models. It supports versioning (model packages), approval workflows (PendingManualApproval → Approved → Rejected), and deployment tracking. Approved model packages can trigger automated deployment pipelines via EventBridge rules."
  },
  {
    id: 23,
    domain: "Domain 3: Deployment and Orchestration",
    question: "Which SageMaker endpoint configuration minimizes cost for an endpoint that receives intermittent traffic with no requests during off-peak hours?",
    options: [
      "Real-Time Inference with minimum instance count of 1",
      "Serverless Inference",
      "Asynchronous Inference with auto-scaling to zero",
      "Multi-Model Endpoint with on-demand loading"
    ],
    answer: 1,
    explanation: "SageMaker Serverless Inference scales to zero when idle and charges only per inference request (compute duration + number of requests). There is no cost when no requests come in. Real-Time Inference with min=1 keeps an instance running 24/7. Best for sporadic/unpredictable traffic."
  },
  // ============================================================
  // DOMAIN 4: MONITORING, MAINTENANCE, AND SECURITY
  // ============================================================
  {
    id: 24,
    domain: "Domain 4: Monitoring, Maintenance, and Security",
    question: "You deployed a SageMaker endpoint 3 months ago. Model predictions have gradually degraded in quality due to changes in real-world data patterns. What type of problem is this, and how do you detect it?",
    options: [
      "Training-serving skew; use SageMaker Debugger to compare training tensors",
      "Model drift / data drift; use SageMaker Model Monitor to compare production data statistics against a training baseline",
      "Endpoint latency degradation; use CloudWatch Invocation latency metrics",
      "Feature store staleness; refresh the online store with new batch snapshots"
    ],
    answer: 1,
    explanation: "This is model/data drift — the input data distribution has shifted over time from what the model was trained on. SageMaker Model Monitor captures production request data, computes statistics (mean, std, percentiles, nulls), and compares them against a baseline captured at training time. Violations trigger CloudWatch alarms."
  },
  {
    id: 25,
    domain: "Domain 4: Monitoring, Maintenance, and Security",
    question: "SageMaker Model Monitor supports four types of monitoring. Which type detects that the model's accuracy or error rate has degraded in production?",
    options: [
      "Data Quality Monitoring",
      "Model Quality Monitoring",
      "Bias Drift Monitoring",
      "Feature Attribution Drift Monitoring"
    ],
    answer: 1,
    explanation: "Model Quality Monitoring compares model predictions against ground truth labels (when available) to track metrics like accuracy, F1, RMSE over time. Data Quality monitors input feature distributions. Bias Drift monitors fairness metrics. Feature Attribution Drift monitors SHAP-based explanation changes."
  },
  {
    id: 26,
    domain: "Domain 4: Monitoring, Maintenance, and Security",
    question: "Which SageMaker feature helps you detect statistical bias in your training data and model predictions, and generate explainability reports using SHAP values?",
    options: [
      "SageMaker Debugger",
      "SageMaker Clarify",
      "SageMaker Experiments",
      "SageMaker Autopilot"
    ],
    answer: 1,
    explanation: "SageMaker Clarify provides bias detection and explainability. It measures pre-training bias (in your dataset) and post-training bias (in model predictions) using metrics like Class Imbalance and Difference in Positive Proportions. It also computes SHAP feature attributions at training time and for monitoring in production."
  },
  {
    id: 27,
    domain: "Domain 4: Monitoring, Maintenance, and Security",
    question: "Your SageMaker training job needs access to data in an S3 bucket and must not traverse the public internet. Which configuration ensures private connectivity?",
    options: [
      "Use a public SageMaker endpoint with HTTPS encryption",
      "Deploy the training job inside a VPC with an S3 VPC Gateway Endpoint and network isolation enabled",
      "Use AWS Direct Connect and a dedicated SageMaker region",
      "Enable SageMaker encryption at rest with AWS KMS"
    ],
    answer: 1,
    explanation: "To prevent traffic from traversing the public internet, configure the training job to run inside a VPC and create an S3 VPC Gateway Endpoint. This routes S3 traffic through the AWS backbone. Network isolation mode (`enable_network_isolation=True`) further prevents the container from making outbound internet calls."
  },
  {
    id: 28,
    domain: "Domain 4: Monitoring, Maintenance, and Security",
    question: "What is the minimum IAM principle you should apply when creating an IAM execution role for a SageMaker Training Job?",
    options: [
      "Attach the `AdministratorAccess` managed policy for simplicity",
      "Attach `AmazonSageMakerFullAccess` managed policy",
      "Grant only the specific S3 bucket read access, CloudWatch Logs write access, and ECR pull access needed by the job",
      "Use the root account credentials passed as environment variables"
    ],
    answer: 2,
    explanation: "The principle of least privilege: grant only the permissions the training job actually needs — read access to the specific S3 input bucket, write access to the output bucket, CloudWatch Logs for training output, and ECR pull for the training image. AdministratorAccess and root credentials massively over-permissioned and violate security best practices."
  },
  {
    id: 29,
    domain: "Domain 4: Monitoring, Maintenance, and Security",
    question: "Which AWS service should you use to automatically encrypt all data written to S3 by SageMaker jobs using customer-managed keys?",
    options: [
      "AWS Secrets Manager",
      "AWS Certificate Manager",
      "AWS Key Management Service (KMS) with a customer-managed key (CMK)",
      "Amazon Macie"
    ],
    answer: 2,
    explanation: "AWS KMS provides customer-managed keys (CMK) for encryption. SageMaker training jobs, processing jobs, and endpoints accept a KmsKeyId parameter to encrypt all output artifacts, inter-node traffic, and storage volumes with your CMK. You retain full control of the key lifecycle."
  },
  {
    id: 30,
    domain: "Domain 4: Monitoring, Maintenance, and Security",
    question: "You want to trigger automatic model retraining whenever SageMaker Model Monitor detects a data quality violation. Which AWS service combination achieves this event-driven retraining?",
    options: [
      "Model Monitor → CloudWatch Logs → AWS Glue job → SageMaker Training",
      "Model Monitor → CloudWatch Alarm → Amazon EventBridge → AWS Lambda → SageMaker Pipelines execution",
      "Model Monitor → SNS notification → SQS queue → EC2 instance → Training script",
      "Model Monitor → S3 PUT event → Step Functions → EMR cluster"
    ],
    answer: 1,
    explanation: "The canonical event-driven retraining pattern: Model Monitor emits a CloudWatch metric when a constraint is violated → CloudWatch Alarm triggers → EventBridge rule fires → Lambda (or directly EventBridge target) executes a SageMaker Pipeline → pipeline runs training, evaluation, and conditional model registration."
  },
  {
    id: 31,
    domain: "Domain 4: Monitoring, Maintenance, and Security",
    question: "Amazon Macie's role in an ML pipeline is to:",
    options: [
      "Monitor SageMaker endpoint latency and throughput",
      "Automatically detect and alert on sensitive data (PII, credentials) in Amazon S3 training datasets",
      "Provide encryption for SageMaker inter-node communication",
      "Scan ECR container images for known vulnerabilities"
    ],
    answer: 1,
    explanation: "Amazon Macie uses ML to automatically discover and protect sensitive data (PII such as names, SSNs, credit card numbers, passwords) in S3. In an ML pipeline, Macie helps ensure training data compliance by identifying sensitive data before it's used for training, reducing regulatory risk."
  },
  {
    id: 32,
    domain: "Domain 3: Deployment and Orchestration",
    question: "You need to deploy a large language model (LLM) that requires 4x A100 GPUs for inference. Which SageMaker inference option supports multi-GPU model parallelism at serving time?",
    options: [
      "SageMaker Serverless Inference",
      "SageMaker Batch Transform with p3.8xlarge",
      "SageMaker Real-Time Inference with Large Model Inference (LMI) container and model parallelism",
      "SageMaker Multi-Model Endpoint with GPU sharing"
    ],
    answer: 2,
    explanation: "SageMaker Large Model Inference (LMI) containers support tensor parallelism across multiple GPUs on a single instance (or across instances) using DeepSpeed, Transformers NeuronX, or vLLM backends. This is the correct approach for LLMs that don't fit on a single GPU."
  },
  {
    id: 33,
    domain: "Domain 1: Data Preparation for ML",
    question: "When building a time-series forecasting model, what data split strategy prevents data leakage?",
    options: [
      "Random shuffle and split 80/20 train/test",
      "Chronological split: train on past data, validate/test on future time windows",
      "K-fold cross-validation with stratification",
      "Randomly sample 20% of time points for testing"
    ],
    answer: 1,
    explanation: "For time-series data, always use chronological splits. Random splitting causes data leakage because future data points would appear in the training set. The correct approach: train on the first 70% of the time range, validate on the next 15%, test on the final 15% — maintaining temporal order."
  },
  {
    id: 34,
    domain: "Domain 2: ML Model Development",
    question: "SageMaker JumpStart is best used for:",
    options: [
      "Running custom distributed training scripts on multi-GPU clusters",
      "Deploying and fine-tuning pre-trained foundation models (LLMs, vision models) with one-click or minimal code",
      "Labeling large datasets with human annotators",
      "Monitoring production model drift with statistical tests"
    ],
    answer: 1,
    explanation: "SageMaker JumpStart provides a model hub with hundreds of pre-trained foundation models (Llama, Falcon, Stable Diffusion, etc.) that can be deployed or fine-tuned with one click or a few lines of code. It handles the infrastructure complexity of large model deployment automatically."
  },
  {
    id: 35,
    domain: "Domain 2: ML Model Development",
    question: "Which SageMaker built-in algorithm is best suited for recommendation systems using collaborative filtering on user-item interaction matrices?",
    options: [
      "DeepAR for time series",
      "Factorization Machines (FM)",
      "Object Detection",
      "BlazingText for word embeddings"
    ],
    answer: 1,
    explanation: "SageMaker Factorization Machines is designed for high-dimensional sparse data like user-item matrices in recommendation systems. It learns latent factors for each user and item and predicts ratings or click probabilities. DeepAR is for time-series, BlazingText for NLP embeddings, Object Detection for CV."
  },
  {
    id: 36,
    domain: "Domain 3: Deployment and Orchestration",
    question: "Which AWS service can trigger a SageMaker Pipeline execution on a schedule (e.g., weekly model retraining)?",
    options: [
      "AWS Step Functions with a Wait state",
      "Amazon EventBridge Scheduler targeting the SageMaker Pipelines StartPipelineExecution API",
      "Amazon SQS with delayed messages",
      "AWS Batch with a cron-based job queue"
    ],
    answer: 1,
    explanation: "Amazon EventBridge Scheduler (or EventBridge Rules with cron expressions) can invoke the SageMaker Pipelines StartPipelineExecution API directly as a target. This is the standard pattern for schedule-based continuous training: EventBridge cron → SageMaker Pipeline → train, evaluate, register."
  },
  {
    id: 37,
    domain: "Domain 4: Monitoring, Maintenance, and Security",
    question: "SageMaker Model Monitor's Data Quality baseline is established by:",
    options: [
      "Manually specifying acceptable ranges for each feature in a JSON config file",
      "Running a baseline processing job against your training/validation dataset to compute statistics and constraints",
      "Using CloudWatch Logs from the first week of production traffic",
      "Comparing predictions against ground truth labels in real-time"
    ],
    answer: 1,
    explanation: "SageMaker Model Monitor uses a SageMaker Processing job to analyze your training dataset and generate a baseline: `statistics.json` (feature distributions) and `constraints.json` (acceptable ranges, null thresholds, type checks). Scheduled monitoring jobs then compare production data against these constraints."
  },
  {
    id: 38,
    domain: "Domain 1: Data Preparation for ML",
    question: "Amazon SageMaker Processing Jobs are best used for:",
    options: [
      "Real-time inference on incoming requests",
      "Pre-processing data, post-processing predictions, and model evaluation as standalone batch jobs",
      "Managing training job hyperparameter tuning",
      "Hosting models as HTTP endpoints"
    ],
    answer: 1,
    explanation: "SageMaker Processing Jobs run arbitrary batch workloads (scikit-learn, Spark, custom containers) on managed compute. They are used for: data preprocessing before training, feature engineering, post-processing inference output, model evaluation (computing metrics), and bias/explainability analysis via SageMaker Clarify."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRACTICE_QUESTIONS };
}
