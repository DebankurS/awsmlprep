# SageMaker Training Job Reference Template (boto3 + SageMaker Python SDK)
# Demonstrates launching a built-in XGBoost training job with
# hyperparameter configuration, data channels, and output paths.

import boto3
import sagemaker
from sagemaker import image_uris
from sagemaker.estimator import Estimator

# --- 1. SESSION SETUP ---
session = sagemaker.Session()
region = session.boto_region_name
role = sagemaker.get_execution_role()  # IAM role for SageMaker
bucket = session.default_bucket()
prefix = "xgboost-churn"

# --- 2. RESOLVE BUILT-IN XGBoost CONTAINER ---
xgboost_image = image_uris.retrieve(
    framework="xgboost",
    region=region,
    version="1.7-1",           # SageMaker-optimized XGBoost version
    image_scope="training"
)

# --- 3. CREATE ESTIMATOR ---
estimator = Estimator(
    image_uri=xgboost_image,
    role=role,
    instance_count=1,
    instance_type="ml.m5.xlarge",
    volume_size=30,             # EBS volume in GB
    max_run=3600,               # Max training time in seconds
    output_path=f"s3://{bucket}/{prefix}/output",
    sagemaker_session=session,
    # Optional: encrypt output artifacts with a KMS key
    # output_kms_key="arn:aws:kms:us-east-1:123456789012:key/your-key-id",
)

# --- 4. SET HYPERPARAMETERS ---
estimator.set_hyperparameters(
    objective="binary:logistic",
    num_round=200,
    max_depth=6,
    eta=0.2,
    gamma=4,
    min_child_weight=6,
    subsample=0.8,
    eval_metric="auc",
    scale_pos_weight=5,        # Handles class imbalance (ratio of negatives to positives)
)

# --- 5. DEFINE DATA CHANNELS ---
train_input = sagemaker.inputs.TrainingInput(
    s3_data=f"s3://{bucket}/{prefix}/train",
    content_type="text/csv"
)
val_input = sagemaker.inputs.TrainingInput(
    s3_data=f"s3://{bucket}/{prefix}/validation",
    content_type="text/csv"
)

# --- 6. LAUNCH TRAINING ---
estimator.fit(
    inputs={"train": train_input, "validation": val_input},
    job_name="xgboost-churn-v1",
    wait=True,    # Block until job completes; set False for async
    logs=True
)

print(f"Training job complete. Model artifact: {estimator.model_data}")

# --- 7. (OPTIONAL) HYPERPARAMETER TUNING ---
from sagemaker.tuner import HyperparameterTuner, IntegerParameter, ContinuousParameter

tuner = HyperparameterTuner(
    estimator=estimator,
    objective_metric_name="validation:auc",
    objective_type="Maximize",
    max_jobs=20,
    max_parallel_jobs=3,
    hyperparameter_ranges={
        "max_depth":       IntegerParameter(3, 10),
        "eta":             ContinuousParameter(0.01, 0.5),
        "min_child_weight": IntegerParameter(1, 10),
        "subsample":       ContinuousParameter(0.5, 1.0),
    }
)

# tuner.fit(inputs={"train": train_input, "validation": val_input})
