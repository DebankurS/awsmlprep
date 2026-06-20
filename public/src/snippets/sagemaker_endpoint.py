# SageMaker Endpoint Deployment Reference Template
# Covers: Real-Time Endpoint, Multi-Variant A/B testing, Auto-Scaling,
# Serverless Inference, and Batch Transform.

import boto3
import sagemaker
from sagemaker.model import Model
from sagemaker import image_uris
from sagemaker.serverless import ServerlessInferenceConfig

session = sagemaker.Session()
region = session.boto_region_name
role = sagemaker.get_execution_role()
sm_client = boto3.client("sagemaker", region_name=region)

MODEL_ARTIFACT = "s3://your-bucket/output/model.tar.gz"
xgboost_image = image_uris.retrieve("xgboost", region, version="1.7-1", image_scope="inference")

# =========================================================
# OPTION A: REAL-TIME ENDPOINT (single variant)
# =========================================================
model = Model(
    image_uri=xgboost_image,
    model_data=MODEL_ARTIFACT,
    role=role,
    sagemaker_session=session
)
predictor = model.deploy(
    initial_instance_count=1,
    instance_type="ml.m5.large",
    endpoint_name="churn-realtime-v1"
)
print("Real-time endpoint deployed:", predictor.endpoint_name)

# Invoke
import io, numpy as np
payload = "35,500.0,12,United States"
response = predictor.predict(payload, initial_args={"ContentType": "text/csv"})
print("Prediction:", response)

# =========================================================
# OPTION B: A/B TESTING WITH PRODUCTION VARIANTS
# =========================================================
from sagemaker.session import Session

sm_client.create_endpoint_config(
    EndpointConfigName="churn-ab-config",
    ProductionVariants=[
        {
            "VariantName": "VariantA-Champion",
            "ModelName": "churn-model-v1",
            "InstanceType": "ml.m5.large",
            "InitialInstanceCount": 1,
            "InitialVariantWeight": 90,   # 90% traffic
        },
        {
            "VariantName": "VariantB-Challenger",
            "ModelName": "churn-model-v2",
            "InstanceType": "ml.m5.large",
            "InitialInstanceCount": 1,
            "InitialVariantWeight": 10,   # 10% traffic (canary)
        },
    ]
)
# Shift traffic without endpoint downtime:
# sm_client.update_endpoint_weights_and_capacities(
#     EndpointName="churn-ab-endpoint",
#     DesiredWeightsAndCapacities=[
#         {"VariantName": "VariantA-Champion", "DesiredWeight": 50},
#         {"VariantName": "VariantB-Challenger", "DesiredWeight": 50}
#     ]
# )

# =========================================================
# OPTION C: SERVERLESS INFERENCE (scales to zero)
# =========================================================
serverless_config = ServerlessInferenceConfig(
    memory_size_in_mb=2048,     # 1024 | 2048 | 3072 | 4096 | 6144
    max_concurrency=10          # Max concurrent invocations
)
serverless_predictor = model.deploy(
    serverless_inference_config=serverless_config,
    endpoint_name="churn-serverless"
)

# =========================================================
# OPTION D: BATCH TRANSFORM (offline bulk inference)
# =========================================================
from sagemaker.transformer import Transformer

transformer = Transformer(
    model_name="churn-model-v1",
    instance_count=2,
    instance_type="ml.m5.xlarge",
    output_path="s3://your-bucket/batch-output/",
    assemble_with="Line",
    accept="text/csv",
    sagemaker_session=session
)
transformer.transform(
    data="s3://your-bucket/batch-input/",
    data_type="S3Prefix",
    content_type="text/csv",
    split_type="Line",
    job_name="churn-batch-2024-q1",
    wait=True
)
print("Batch transform complete. Results at:", transformer.output_path)

# =========================================================
# OPTION E: APPLICATION AUTO SCALING for Real-Time Endpoints
# =========================================================
autoscaling_client = boto3.client("application-autoscaling", region_name=region)

# Register the endpoint variant as a scalable target
autoscaling_client.register_scalable_target(
    ServiceNamespace="sagemaker",
    ResourceId="endpoint/churn-realtime-v1/variant/AllTraffic",
    ScalableDimension="sagemaker:variant:DesiredInstanceCount",
    MinCapacity=1,
    MaxCapacity=5
)

# Target Tracking: scale when avg invocations per instance > 500
autoscaling_client.put_scaling_policy(
    PolicyName="churn-endpoint-scaling",
    ServiceNamespace="sagemaker",
    ResourceId="endpoint/churn-realtime-v1/variant/AllTraffic",
    ScalableDimension="sagemaker:variant:DesiredInstanceCount",
    PolicyType="TargetTrackingScaling",
    TargetTrackingScalingPolicyConfiguration={
        "TargetValue": 500.0,
        "PredefinedMetricSpecification": {
            "PredefinedMetricType": "SageMakerVariantInvocationsPerInstance"
        },
        "ScaleInCooldown": 300,
        "ScaleOutCooldown": 60
    }
)
print("Auto scaling policy configured.")
