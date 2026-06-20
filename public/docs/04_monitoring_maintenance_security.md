# Domain 4: ML Solution Monitoring, Maintenance, and Security

This study guide covers Domain 4 of the AWS Certified Machine Learning Engineer – Associate (MLA-C01) exam: monitoring production ML systems, maintaining model quality, and securing ML workloads on AWS. Domain 4 carries **24% of the exam weight**.

## 1. SageMaker Model Monitor

SageMaker Model Monitor continuously monitors the quality of deployed models by comparing production data against a training baseline.

### Four Monitoring Types

| Monitor Type | What It Detects | Ground Truth Required |
|---|---|---|
| **Data Quality** | Input feature distribution drift (null rates, type violations, range violations) | No |
| **Model Quality** | Prediction accuracy/error rate degradation | Yes (ground truth labels) |
| **Bias Drift** | Fairness metric changes across demographic groups | Yes (for model quality) |
| **Feature Attribution Drift** | SHAP-based explanation drift | No |

### Workflow
1. **Establish Baseline**: run a `DefaultModelMonitor.suggest_baseline()` processing job against your training data → generates `statistics.json` + `constraints.json`.
2. **Create Monitoring Schedule**: define a cron schedule (e.g., hourly, daily).
3. **Monitor Job**: each run captures a sample of production traffic, computes statistics, and compares against constraints.
4. **Violations**: written to S3 and emitted as **CloudWatch metrics** → trigger CloudWatch Alarms.

### Key Metrics
- **Data drift**: Jensen-Shannon distance, Kolmogorov-Smirnov test for numerical features.
- **Categorical drift**: L-infinity norm on category frequency distributions.
- **Completeness**: percentage of non-null values.

## 2. Monitoring with Amazon CloudWatch

All SageMaker components emit metrics to CloudWatch automatically.

### Endpoint Metrics
| Metric | Description |
|---|---|
| `Invocations` | Total inference requests |
| `InvocationErrors` | Failed requests |
| `ModelLatency` | Time spent in the model container |
| `OverheadLatency` | SageMaker routing overhead |
| `InvocationsPerInstance` | Used for auto-scaling target tracking |

### Training Metrics
- Training jobs emit custom metrics (loss, accuracy) if you use `metric_definitions` in the Estimator.
- CloudWatch Logs capture all stdout from the training container.

## 3. Drift Detection and Retraining Pipelines

### Training-Serving Skew
- **Definition**: mismatch between feature distributions at training time vs. inference time.
- **Cause**: different preprocessing logic applied at training vs. serving; data pipeline bugs.
- **Fix**: use identical preprocessing containers in training and inference; use SageMaker Feature Store to serve the same features.

### Model Drift
- **Definition**: model performance degrades because the real-world data distribution changes over time.
- **Cause**: seasonal shifts, user behavior changes, upstream data source changes.
- **Fix**: schedule periodic retraining; use drift detection to trigger retraining automatically.

### Event-Driven Retraining Pattern
```
Model Monitor → CloudWatch Alarm → EventBridge Rule → Lambda → SageMaker Pipeline (retrain + evaluate + register)
```

### Schedule-Based Retraining
```
EventBridge Scheduler (cron) → SageMaker Pipelines StartPipelineExecution API
```

## 4. Security Best Practices

### IAM and Least Privilege
- Each SageMaker job (training, processing, endpoint) has an **IAM execution role**.
- Apply **least privilege**: grant only the specific S3 buckets, ECR registries, KMS keys, and CloudWatch log groups the job actually needs.
- Never use `AdministratorAccess` or root credentials for ML jobs.
- Use **IAM Conditions** to restrict access to specific S3 key prefixes.

### Network Isolation
- Run training and processing jobs inside a **VPC** with private subnets.
- Use **S3 VPC Gateway Endpoint** to route S3 traffic through AWS backbone (no public internet).
- Use **ECR VPC Interface Endpoint** to pull container images privately.
- Enable `enable_network_isolation=True` on training jobs to prevent all outbound internet access from the container.

### Data Encryption
| Scope | Service | Key Type |
|---|---|---|
| S3 at rest | SSE-S3, SSE-KMS | CMK (Customer Managed Key) |
| EBS volumes (training) | KMS | CMK |
| Inter-node traffic | TLS | Auto-managed |
| SageMaker Studio EFS | KMS | CMK |

### Secrets Management
- Never hard-code credentials in training scripts or containers.
- Use **AWS Secrets Manager** or **SSM Parameter Store** to retrieve secrets at runtime.
- Pass secrets as environment variables resolved at job start, not baked into container images.

## 5. SageMaker Clarify (Production Bias Monitoring)

SageMaker Clarify can run as a **Model Monitor** to detect bias drift in production:

- Captures a sample of production predictions.
- Computes bias metrics (Disparate Impact, Equal Opportunity Difference) for each monitoring period.
- Compares against a pre-training baseline.
- Emits violations to CloudWatch when bias metrics exceed thresholds.

**Pre-training bias metrics**: Class Imbalance (CI), Difference in Positive Proportions in Labels (DPPL).
**Post-training bias metrics**: Disparate Impact (DI), Equal Opportunity Difference (EOD), Recall Difference (RD).

## 6. Model Explainability in Production

- **SHAP global**: average absolute SHAP values across all predictions — shows overall feature importance.
- **SHAP local**: SHAP values for a single prediction — explains why the model made that specific decision.
- **Feature Attribution Drift**: if SHAP values shift significantly from the training baseline, the model may be relying on different features in production (sign of drift or data quality issues).

## 7. Amazon Macie for Data Privacy

Amazon Macie uses ML to discover and protect sensitive data in S3:
- Detects PII (names, SSNs, credit card numbers, email addresses, etc.).
- Generates detailed findings with the S3 object path and matched data patterns.
- Use Macie before training to ensure training data doesn't contain regulated PII that shouldn't be used.
- Set up automated alerts via EventBridge when Macie finds sensitive data in ML training buckets.

## 8. AWS Audit and Compliance

| Service | Role |
|---|---|
| **AWS CloudTrail** | API-level audit log for all SageMaker API calls (who did what, when) |
| **AWS Config** | Tracks configuration changes to SageMaker resources |
| **Amazon Macie** | Sensitive data discovery in S3 |
| **Amazon Inspector** | Vulnerability scanning for ECR container images |
| **AWS Security Hub** | Centralized security findings aggregation |
| **SageMaker Lineage** | Tracks data → training → model → endpoint provenance |

## 9. Amazon Bedrock Security Controls

| Control | What It Does |
|---|---|
| **Guardrails** | Inference-time filters: block harmful topics, detect/redact PII, apply grounding checks |
| **VPC Endpoint** | Route Bedrock API calls through PrivateLink — no public internet |
| **CloudTrail logging** | Every `InvokeModel` call logged; use for audit and compliance |
| **Encryption** | All data encrypted in transit (TLS) and at rest (AWS-managed or CMK) |
| **IAM resource policies** | Restrict which principals can invoke specific foundation models |

> **Exam tip:** Guardrails ≠ fine-tuning safety. Guardrails are applied at request/response time on every invocation. They complement, not replace, RLHF or safety fine-tuning baked into the base model.

## 10. Cost Optimization for Production ML

- **Right-size instances**: use SageMaker Profiler to identify idle GPU/CPU time; downsize if utilization < 50%.
- **Spot Instances**: use managed Spot Training for training jobs (up to 90% savings); requires checkpointing for resumability.
- **Serverless Inference**: for low/sporadic traffic endpoints — zero cost when idle.
- **Savings Plans**: commit to a consistent usage level for EC2/SageMaker at discounted rates.
- **S3 Intelligent-Tiering**: automatically moves infrequently accessed training data to cheaper storage tiers.
- **SageMaker Savings Plans**: 1 or 3-year commitments for predictable SageMaker usage.
