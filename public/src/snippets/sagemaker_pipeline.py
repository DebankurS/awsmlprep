# SageMaker Pipelines Reference Template (MLOps)
# Demonstrates a complete ML pipeline: preprocessing → training → evaluation → conditional registration.

import boto3
import sagemaker
from sagemaker import image_uris
from sagemaker.workflow.pipeline import Pipeline
from sagemaker.workflow.steps import ProcessingStep, TrainingStep, TransformStep
from sagemaker.workflow.conditions import ConditionGreaterThanOrEqualTo
from sagemaker.workflow.condition_step import ConditionStep
from sagemaker.workflow.functions import JsonGet
from sagemaker.workflow.model_step import ModelStep
from sagemaker.workflow.parameters import ParameterFloat, ParameterString
from sagemaker.processing import ScriptProcessor, ProcessingInput, ProcessingOutput
from sagemaker.estimator import Estimator
from sagemaker.model import Model
from sagemaker.model_metrics import ModelMetrics, MetricsSource
from sagemaker.workflow.pipeline_context import PipelineSession

session = PipelineSession()
region = boto3.Session().region_name
role = sagemaker.get_execution_role()
bucket = sagemaker.Session().default_bucket()

# --- PIPELINE PARAMETERS (can be overridden at execution time) ---
model_approval_status = ParameterString(name="ModelApprovalStatus", default_value="PendingManualApproval")
accuracy_threshold = ParameterFloat(name="AccuracyThreshold", default_value=0.80)

# --- STEP 1: PREPROCESSING (SageMaker Processing Job) ---
sklearn_image = image_uris.retrieve("sklearn", region, version="1.2-1")
preprocessor = ScriptProcessor(
    image_uri=sklearn_image,
    command=["python3"],
    instance_type="ml.m5.large",
    instance_count=1,
    role=role,
    sagemaker_session=session
)
preprocessing_step = ProcessingStep(
    name="PreprocessData",
    processor=preprocessor,
    inputs=[ProcessingInput(source=f"s3://{bucket}/raw-data", destination="/opt/ml/processing/input")],
    outputs=[
        ProcessingOutput(output_name="train", source="/opt/ml/processing/train"),
        ProcessingOutput(output_name="validation", source="/opt/ml/processing/validation"),
    ],
    code="preprocess.py"    # Your local preprocessing script
)

# --- STEP 2: TRAINING (SageMaker Training Job) ---
xgboost_image = image_uris.retrieve("xgboost", region, version="1.7-1")
estimator = Estimator(
    image_uri=xgboost_image,
    role=role,
    instance_count=1,
    instance_type="ml.m5.xlarge",
    output_path=f"s3://{bucket}/pipeline-output",
    sagemaker_session=session
)
estimator.set_hyperparameters(objective="binary:logistic", num_round=100, eval_metric="auc")

from sagemaker.inputs import TrainingInput
training_step = TrainingStep(
    name="TrainModel",
    estimator=estimator,
    inputs={
        "train": TrainingInput(s3_data=preprocessing_step.properties.ProcessingOutputConfig.Outputs["train"].S3Output.S3Uri, content_type="text/csv"),
        "validation": TrainingInput(s3_data=preprocessing_step.properties.ProcessingOutputConfig.Outputs["validation"].S3Output.S3Uri, content_type="text/csv"),
    }
)

# --- STEP 3: EVALUATION (SageMaker Processing Job) ---
evaluation_step = ProcessingStep(
    name="EvaluateModel",
    processor=preprocessor,
    inputs=[
        ProcessingInput(source=training_step.properties.ModelArtifacts.S3ModelArtifacts, destination="/opt/ml/processing/model"),
        ProcessingInput(source=preprocessing_step.properties.ProcessingOutputConfig.Outputs["validation"].S3Output.S3Uri, destination="/opt/ml/processing/test")
    ],
    outputs=[ProcessingOutput(output_name="evaluation", source="/opt/ml/processing/evaluation")],
    code="evaluate.py",     # Writes evaluation.json with {"metrics": {"auc": {"value": 0.87}}}
    property_files=[sagemaker.workflow.properties.PropertyFile(name="EvaluationReport", output_name="evaluation", path="evaluation.json")]
)

# --- STEP 4: CONDITIONAL MODEL REGISTRATION ---
model = Model(image_uri=xgboost_image, model_data=training_step.properties.ModelArtifacts.S3ModelArtifacts, role=role, sagemaker_session=session)

register_step = ModelStep(
    name="RegisterModel",
    step_args=model.register(
        content_types=["text/csv"],
        response_types=["application/json"],
        approval_status=model_approval_status,
        model_package_group_name="ChurnModelGroup"
    )
)

condition = ConditionGreaterThanOrEqualTo(
    left=JsonGet(step_name="EvaluateModel", property_file="EvaluationReport", json_path="metrics.auc.value"),
    right=accuracy_threshold
)
condition_step = ConditionStep(
    name="CheckAccuracy",
    conditions=[condition],
    if_steps=[register_step],
    else_steps=[]
)

# --- ASSEMBLE AND UPSERT PIPELINE ---
pipeline = Pipeline(
    name="ChurnPredictionPipeline",
    parameters=[model_approval_status, accuracy_threshold],
    steps=[preprocessing_step, training_step, evaluation_step, condition_step],
    sagemaker_session=session
)
pipeline.upsert(role_arn=role)
print("Pipeline upserted. Start with: pipeline.start()")
