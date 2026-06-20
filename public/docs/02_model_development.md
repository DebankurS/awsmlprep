# Domain 2: ML Model Development

This study guide covers Domain 2 of the AWS Certified Machine Learning Engineer – Associate (MLA-C01) exam: selecting and training models using Amazon SageMaker. Domain 2 carries **26% of the exam weight**.

## 1. SageMaker Training Modes

| Mode | When to Use |
|---|---|
| **Built-in Algorithms** | Standard problem types; no training code needed |
| **Script Mode** | Custom training code in PyTorch/TF/sklearn with SageMaker managed containers |
| **Custom Container** | Non-standard frameworks or private dependencies; bring your own Docker image |
| **SageMaker JumpStart** | Pre-trained foundation models; one-click deploy or fine-tune |
| **SageMaker Autopilot** | AutoML; automatic algorithm selection, feature engineering, and tuning |

## 2. SageMaker Built-in Algorithms

| Algorithm | Problem Type | Key Notes |
|---|---|---|
| **XGBoost** | Tabular classification/regression | Most popular; supports GPU; built-in eval metrics |
| **Linear Learner** | Binary/multiclass classification, regression | Fast, scalable; built-in normalization |
| **K-Nearest Neighbors (KNN)** | Classification, regression, anomaly detection | Non-parametric; good for recommendation similarity |
| **Random Cut Forest (RCF)** | Unsupervised anomaly detection | No labels needed; outputs anomaly score per record |
| **Factorization Machines** | Sparse data: recommendation, click-through rate | User-item collaborative filtering |
| **DeepAR** | Time-series probabilistic forecasting | Trains on multiple related time series simultaneously |
| **BlazingText** | Text classification, word embeddings | Implements Word2Vec and text classification at scale |
| **Object Detection** | Computer vision — bounding boxes | Supports ResNet/VGG backbones |
| **Semantic Segmentation** | Computer vision — pixel-level labels | FCN, PSPNet, DeepLab backbones |
| **IP Insights** | Anomaly detection on IP/entity pairs | Fraud, account takeover detection |

## 3. SageMaker Autopilot (AutoML)

SageMaker Autopilot automates the full ML pipeline: data analysis, feature engineering, algorithm selection, and hyperparameter tuning.

**Workflow:**
1. Point to CSV data in S3 with a target column.
2. Autopilot generates up to 250 candidate pipelines.
3. Trains and tunes each candidate.
4. Produces a leaderboard ranked by objective metric.
5. Best model can be deployed directly or inspected as an editable notebook.

**Supports**: Binary classification, multiclass classification, regression, time-series forecasting.
**Explainability**: automatically generates SageMaker Clarify explainability report for the best model.

## 4. Hyperparameter Tuning (Automatic Model Tuning)

SageMaker Automatic Model Tuning uses **Bayesian optimization** by default.

- **Bayesian optimization**: builds a surrogate model (Gaussian process) of the objective function based on completed trials, then selects the next hyperparameter set that maximizes expected improvement. Far more sample-efficient than grid or random search.
- **Random search**: useful baseline; good when parallel jobs >> sequential budget.
- **Hyperband**: early-stops poorly performing trials to reallocate compute to promising ones.

**Best practices:**
- Limit concurrent jobs to enable Bayesian transfer across trials.
- Use logarithmic scale for learning rate, regularization parameters.
- Set `max_jobs` to at least 3× the number of hyperparameters being tuned.
- Enable **Warm Start** to transfer knowledge from a previous tuning job.

## 5. Distributed Training

### Data Parallelism
Each worker has a complete copy of the model. The training data is split across workers. Gradients are aggregated (AllReduce) after each batch.

- **SageMaker Distributed Data Parallel (SDP)**: AWS-optimized AllReduce. Integrates with PyTorch DDP and TensorFlow MirroredStrategy. Outperforms NCCL on SageMaker's network fabric for multi-node jobs.
- **Use when**: model fits on a single GPU; data is too large to process on one machine.

### Model Parallelism
The model itself is split across GPUs/instances because it doesn't fit on a single GPU.

- **SageMaker Distributed Model Parallel (SMP)**: automatically partitions model layers across GPUs, supports pipeline parallelism (micro-batching) to keep all GPUs busy.
- **Use when**: LLMs or very deep models exceed single-GPU memory (e.g., GPT, BERT-large).

### SageMaker Training Compiler
- Converts model computations to optimized XLA operations. Reduces training time for TF/PyTorch by 10–40%.
- Drop-in: add `compiler_config=TrainingCompilerConfig()` to your Estimator.

## 6. SageMaker Experiments

Tracks training runs for reproducibility and comparison.

- **Experiment**: a collection of related trials (e.g., "ChurnModelExperiment").
- **Trial**: a single training run with its hyperparameters and output metrics.
- **Trial Component**: a step within a trial (e.g., preprocessing, training, evaluation).

Log custom metrics, artifacts, and parameters via the SageMaker SDK or `smexperiments` library. Compare trials side-by-side in SageMaker Studio.

## 7. SageMaker Debugger

Detects training anomalies in real-time by capturing tensor snapshots.

**Built-in rules** (no code needed):
- `VanishingGradient` — gradients approaching zero, blocking learning.
- `ExplodingTensor` — NaN or infinite values in weights.
- `Overfit` — validation metric diverging significantly from training metric.
- `LossNotDecreasing` — training loss not improving after N steps.
- `WeightUpdateRatio` — weight updates too small/large relative to weight magnitudes.

Rules emit **CloudWatch Events** when violated — can trigger automated pipeline actions.

**Profiler**: captures system metrics (GPU/CPU utilization, I/O bottlenecks) to identify training efficiency issues.

## 8. SageMaker Clarify (Bias and Explainability)

### Bias Detection
- **Pre-training bias** (in data): measures imbalance before training.
  - Class Imbalance (CI): ratio of minority to majority class size.
  - Difference in Positive Proportions (DPP): difference in label rates between demographic groups.
- **Post-training bias** (in model predictions):
  - Disparate Impact (DI): ratio of positive prediction rates across groups.
  - Equal Opportunity Difference (EOD): difference in recall across groups.

### Explainability (SHAP)
SageMaker Clarify computes **SHAP (SHapley Additive exPlanations)** feature attributions:
- **Global explanations**: which features matter most across all predictions.
- **Local explanations**: why the model made a specific prediction for a single record.
- Integrates with SageMaker Model Monitor for **Feature Attribution Drift** monitoring in production.

## 9. Model Selection Decision Guide

| Scenario | Recommended Approach |
|---|---|
| Standard tabular classification, no code preferred | SageMaker built-in XGBoost or Linear Learner |
| AutoML, algorithm unknown | SageMaker Autopilot |
| Custom PyTorch/TF model | Script Mode with managed container |
| Pre-trained LLM fine-tuning | SageMaker JumpStart |
| Unsupervised anomaly detection | Random Cut Forest (RCF) |
| Time-series forecasting | DeepAR |
| Recommendation system | Factorization Machines |
| Text classification at scale | BlazingText |
