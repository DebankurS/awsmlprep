# Domain 3: Deployment and Orchestration of ML Workflows

This study guide covers Domain 3 of the AWS Certified Machine Learning Engineer – Associate (MLA-C01) exam: SageMaker inference options, MLOps pipelines, and model management. Domain 3 carries **22% of the exam weight**.

## 1. SageMaker Inference Options

Choose the right inference mode based on latency, payload size, and cost requirements.

| Option | Latency | Payload | Cost Model | Best For |
|---|---|---|---|---|
| **Real-Time Inference** | Milliseconds | < 6 MB | Pay per hour (instance running) | Low-latency, synchronous APIs |
| **Serverless Inference** | Cold start + ms | < 4 MB | Pay per invocation + duration | Sporadic/unpredictable traffic |
| **Asynchronous Inference** | Minutes | Up to 1 GB | Pay per hour while processing | Large payloads, long processing |
| **Batch Transform** | Minutes–hours | Unlimited (S3) | Pay per job duration | Offline bulk scoring |

### Real-Time Inference
- Persistent endpoint running 24/7.
- Supports **Auto Scaling** via Application Auto Scaling (target tracking on `SageMakerVariantInvocationsPerInstance`).
- Supports **multiple Production Variants** for A/B testing and canary deployments.
- Traffic weights can be shifted without downtime using `UpdateEndpointWeightsAndCapacities`.

### Serverless Inference
- Scales to zero when idle — no cost between requests.
- Automatically provisions compute per request (memory: 1–6 GB configurable).
- Has cold start latency on first invocation after idle period.
- Best for development/testing or intermittent production traffic.

### Asynchronous Inference
- Client submits request → SageMaker queues it → processes in background → writes result to S3.
- Client polls S3 (or uses SNS notification) for the result.
- Supports payloads up to 1 GB and processing up to 1 hour.
- Can scale down to 0 instances when queue is empty.

### Batch Transform
- Input from S3, output to S3.
- Fully managed — instances spin up, process all data, then terminate.
- Cost-effective for offline scoring of large datasets.
- Supports `SplitType` and `AssembleWith` for controlling record splitting/joining.

## 2. Production Variants and A/B Testing

A SageMaker Endpoint Config can have multiple **Production Variants**. Each variant has:
- `VariantName`: logical name (e.g., "Champion", "Challenger")
- `ModelName`: which SageMaker Model to serve
- `InitialVariantWeight`: relative traffic weight
- `InstanceType` + `InitialInstanceCount`: compute configuration

**Traffic shifting workflow:**
1. Create endpoint with Champion at weight 100.
2. Add Challenger at weight 5 (5% of traffic).
3. Monitor metrics for both variants via CloudWatch.
4. Gradually shift: 90/10 → 50/50 → 0/100.
5. Remove old variant.

## 3. Multi-Model Endpoints (MME)

Host hundreds of models on a single endpoint to reduce hosting cost.

- Models stored in S3; loaded into memory on first invocation (LRU cache).
- Unloaded when memory pressure requires it.
- Client specifies which model to invoke via `TargetModel` header.
- Best for many small models (< 500 MB each) with diverse call patterns.

**Multi-Container Endpoints (MCE)**: run different frameworks on the same endpoint (e.g., one container for preprocessing, another for inference). Up to 15 containers per endpoint.

## 4. Large Model Inference (LMI)

For LLMs that exceed single GPU memory:
- SageMaker provides **LMI containers** (Deep Java Library serving with DeepSpeed, vLLM, Transformers NeuronX backends).
- Supports tensor parallelism (split model layers across multiple GPUs).
- Supports pipeline parallelism (different transformer blocks on different GPUs).
- Deploy on `ml.p4d`, `ml.p4de`, `ml.inf2` (AWS Inferentia2) instance types.

## 5. SageMaker Pipelines (MLOps)

SageMaker Pipelines is the native ML CI/CD orchestration service.

**Step types:**
| Step | Purpose |
|---|---|
| `ProcessingStep` | Data preprocessing, evaluation (uses Processing Jobs) |
| `TrainingStep` | Model training (uses Training Jobs) |
| `TuningStep` | Hyperparameter optimization (uses HPO) |
| `TransformStep` | Batch Transform for evaluation |
| `ModelStep` | Create/register models in Model Registry |
| `ConditionStep` | Conditional branching based on metric thresholds |
| `LambdaStep` | Run arbitrary AWS Lambda functions |
| `ClarifyCheckStep` | Bias/explainability checks |
| `QualityCheckStep` | Data/model quality baseline checks |

**Key features:**
- **Pipeline Parameters**: runtime-overridable inputs (e.g., `ParameterString`, `ParameterFloat`).
- **Step Caching**: re-use outputs of unchanged steps to skip redundant computation.
- **Lineage Tracking**: automatic artifact lineage graph in SageMaker Studio.
- **Triggers**: start pipelines via EventBridge rules (schedule or event-based).

## 6. SageMaker Model Registry

Centralized catalog for trained model versions.

**Model Package Group**: logical container grouping all versions of a model (e.g., "ChurnPredictionGroup").

**Approval states**: `PendingManualApproval` → `Approved` (triggers deployment) / `Rejected`.

**EventBridge integration**: approval state change events automatically trigger deployment pipelines.

**Use cases:**
- Gate deployment behind human review.
- Track which model version is deployed in which environment.
- Roll back to a previous approved version.

## 7. AWS Step Functions for ML Orchestration

Alternative to SageMaker Pipelines for complex cross-service orchestration.

- Integrates with SageMaker (training, endpoints), Lambda, Glue, EMR, SNS, SQS.
- Visual workflow designer in the console.
- Use Step Functions when your ML workflow spans multiple AWS services beyond SageMaker.
- Use SageMaker Pipelines when the workflow is primarily SageMaker steps.

## 8. Continuous Training Triggers

| Trigger Type | Architecture |
|---|---|
| Schedule-based | EventBridge Scheduler → SageMaker Pipeline |
| Event-based (new data) | S3 PutObject → EventBridge → Lambda → Pipeline |
| Drift-based | Model Monitor violation → CloudWatch Alarm → EventBridge → Pipeline |
| Performance-based | CloudWatch metric threshold → EventBridge → Lambda → Pipeline |

## 9. Deployment Best Practices

- **Blue/Green deployments**: deploy new version alongside old; switch traffic atomically.
- **Canary releases**: start with 1–5% traffic to new version; gradually increase.
- **Shadow mode**: send all requests to both models; compare outputs without serving new model's predictions to users.
- **Model compression**: quantization (INT8), pruning, distillation to reduce model size for faster inference.
- ~~**Elastic Inference**~~: deprecated by AWS in April 2023 — no longer available. Use Inferentia2 (`ml.inf2`) instances or GPU instances instead.
