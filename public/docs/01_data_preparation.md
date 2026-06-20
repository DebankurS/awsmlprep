# Domain 1: Data Preparation for ML

This study guide covers Domain 1 of the AWS Certified Machine Learning Engineer – Associate (MLA-C01) exam: data ingestion, transformation, labeling, and feature engineering on AWS. Domain 1 carries **28% of the exam weight**.

## 1. Data Storage Options for ML

Choosing the right storage service prevents unnecessary data movement and cost.

| Service | Format | Best Use in ML |
|---|---|---|
| **Amazon S3** | Any (CSV, Parquet, TFRecord, images) | Raw data lake, model artifacts, training data staging |
| **Amazon Redshift** | Columnar SQL tables | Structured analytics; use Redshift ML for in-place training |
| **Amazon DynamoDB** | NoSQL key-value | Online feature serving (low-latency lookups at inference) |
| **Amazon EFS/FSx** | POSIX filesystem | Shared dataset access across multiple training instances |

> **Exam tip:** When data is already in S3, avoid moving it. Use SageMaker's S3 data channels directly. When data is in Redshift, use Redshift ML or Redshift UNLOAD to S3 first.

## 2. Data Ingestion Patterns

### Batch Ingestion
- **AWS Glue** — serverless Apache Spark ETL. Best for large-scale structured/semi-structured transformations. Crawlers auto-discover schema from S3 and populate the Glue Data Catalog.
- **AWS Glue DataBrew** — visual, low-code transformation tool (no Spark knowledge needed).
- **SageMaker Processing Jobs** — ad-hoc or pipeline-embedded batch preprocessing using sklearn, Spark, or custom containers.

### Streaming Ingestion
- **Amazon Kinesis Data Streams** — real-time data capture with sub-second latency. Requires consumer code (KCL, Lambda, Flink). Supports replay of records (configurable retention up to 365 days).
- **Amazon Kinesis Data Firehose** — fully managed delivery to S3, Redshift, or OpenSearch. No consumer code needed. Use for simple, reliable streaming → storage pipelines.
- **Amazon MSK (Managed Kafka)** — Apache Kafka as a managed service. Best for existing Kafka ecosystems or complex fan-out topologies.

**Kinesis Streams vs. Firehose:**

| Feature | Data Streams | Data Firehose |
|---|---|---|
| Consumer code required | Yes (KCL/Lambda) | No (fully managed) |
| Replay capability | Yes | No |
| Fan-out to multiple consumers | Yes | No |
| Destination | Custom | S3 / Redshift / OpenSearch |
| Latency | Sub-second | 60–900s buffer |

## 3. SageMaker Data Wrangler

SageMaker Data Wrangler is the visual data preparation tool in SageMaker Studio.

- **300+ built-in transforms**: normalization, one-hot encoding, datetime parsing, custom Python/PySpark transforms.
- **Statistical analysis**: histograms, scatter plots, correlation matrices.
- **Bias detection**: integration with SageMaker Clarify to detect pre-training bias.
- **Export options**: export as SageMaker Processing Job, Feature Store ingestion, or Pipeline step.

## 4. SageMaker Feature Store

A centralized managed repository for ML features that prevents training-serving skew.

- **Offline Store** (S3-backed): historical features for training, supports time-travel queries to prevent label leakage.
- **Online Store** (DynamoDB-backed): sub-millisecond feature lookups at inference time.
- **Feature Groups**: logical grouping of related features; each record has a record identifier and event timestamp.

**Key concept — Point-in-Time Joins:** When creating training datasets from the offline store, use point-in-time correctness (as-of joins) to retrieve only feature values that would have been available at prediction time. This prevents future data leakage.

## 5. SageMaker Ground Truth (Data Labeling)

SageMaker Ground Truth provides managed annotation workflows at scale.

- **Workforce options**: Amazon Mechanical Turk, private team (your employees), AWS Marketplace vendors.
- **Built-in task types**: image classification, bounding box, semantic segmentation, text classification, NER, video labeling.
- **Annotation consolidation**: uses statistical models (Dawid-Skene) to merge multiple annotator labels and output a confidence score.
- **Active learning**: automatically labels high-confidence examples using a partially trained model, reducing human annotation cost by up to 70%.
- **SageMaker Ground Truth Plus**: fully managed, turn-key labeling (AWS manages the entire workflow).

## 6. Handling Data Quality Issues

### Missing Data
- **Drop rows**: safe only when < 5% missing and missing at random.
- **Mean/median/mode imputation**: fast baseline. Use median for skewed distributions.
- **Model-based imputation**: KNN Imputer, Iterative Imputer (sklearn) — uses other features to predict missing values.
- **Indicator variable**: add a boolean flag column `feature_is_missing` alongside imputed values.

### Outliers
- **Z-score clipping**: remove or cap values beyond ±3 standard deviations.
- **IQR clipping**: cap at Q1 - 1.5×IQR and Q3 + 1.5×IQR.
- **Log transform**: reduces impact of extreme right-skewed values.

### Class Imbalance
- **Oversampling minority class**: SMOTE (Synthetic Minority Oversampling Technique) — generates synthetic examples by interpolating between existing minority examples.
- **Undersampling majority class**: random downsampling or Tomek links.
- **Class weights**: most ML frameworks support `class_weight` or `scale_pos_weight` (XGBoost) to penalize misclassification of the minority class more heavily.
- **Evaluation**: never use accuracy for imbalanced datasets. Use **Precision-Recall AUC**, **F1-Score**, or **Matthews Correlation Coefficient**.

## 7. Feature Engineering Best Practices

- **Normalization / Standardization**: scale numerical features to [0,1] (MinMax) or zero mean/unit variance (StandardScaler) to speed up convergence.
- **Categorical encoding**: one-hot encoding for low-cardinality, target encoding or embeddings for high-cardinality.
- **Temporal features**: extract hour, day-of-week, month, is-weekend from timestamps.
- **Interaction features**: multiply or concatenate features to capture non-linear relationships.
- **Preventing training-serving skew**: apply identical preprocessing in both training and inference. Options: tf.Transform graph, SageMaker Feature Store, or a shared preprocessing container in SageMaker Pipelines.

## 8. Data Splitting Strategies

- **Random split**: valid for i.i.d. tabular data. Typical 70/15/15 or 80/10/10 train/val/test.
- **Stratified split**: preserve class proportions across splits for imbalanced classification.
- **Time-series split**: always chronological — train on past, validate/test on future. Never shuffle time-series data.
- **Group split**: when multiple rows belong to the same entity (user, patient), keep all rows of an entity in the same split to prevent leakage.
