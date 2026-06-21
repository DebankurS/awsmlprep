// AWS ML Engineer Associate Study Dashboard - Application Logic

// =========================================================================
// 0. QUESTIONS LOADER
// =========================================================================

async function loadQuestions() {
  const files = [
    'questions/domain1.json',
    'questions/domain2.json',
    'questions/domain3.json',
    'questions/domain4.json'
  ];
  const results = await Promise.all(
    files.map(f => fetch(f).then(r => {
      if (!r.ok) throw new Error(`Failed to load ${f}: ${r.status}`);
      return r.json();
    }))
  );
  window.PRACTICE_QUESTIONS = results.flat();
}

// =========================================================================
// 1. DATA AND CONSTANTS
// =========================================================================

const DOMAINS_CHECKLIST = [
  {
    id: 1,
    code: "D1",
    title: "Domain 1: Data Preparation for ML (28%)",
    subtitle: "Data ingestion, transformation, labeling, feature engineering, and quality.",
    items: [
      { id: "d1_1", text: "Choose correct AWS storage for ML: S3, Redshift, DynamoDB, EFS and when to use each." },
      { id: "d1_2", text: "Design batch ETL pipelines with AWS Glue (Spark) and SageMaker Processing Jobs." },
      { id: "d1_3", text: "Design streaming pipelines: Kinesis Data Streams vs. Kinesis Data Firehose vs. MSK." },
      { id: "d1_4", text: "Use SageMaker Data Wrangler for visual, no-code feature engineering in SageMaker Studio." },
      { id: "d1_5", text: "Configure SageMaker Feature Store: online (DynamoDB) vs. offline (S3) stores; point-in-time joins." },
      { id: "d1_6", text: "Set up SageMaker Ground Truth labeling workflows: workforce types, active learning, annotation consolidation." },
      { id: "d1_7", text: "Handle class imbalance (SMOTE, downsampling, class weights) and choose appropriate metrics (F1, PR-AUC)." },
      { id: "d1_8", text: "Apply correct data split strategies: random, stratified, chronological (time-series), group splits." }
    ]
  },
  {
    id: 2,
    code: "D2",
    title: "Domain 2: ML Model Development (26%)",
    subtitle: "Built-in algorithms, training, tuning, explainability, and debugging.",
    items: [
      { id: "d2_1", text: "Select correct SageMaker built-in algorithm for each problem type (XGBoost, RCF, DeepAR, Factorization Machines, BlazingText)." },
      { id: "d2_2", text: "Use SageMaker Autopilot (AutoML) for automatic algorithm selection and hyperparameter optimization." },
      { id: "d2_3", text: "Configure SageMaker Hyperparameter Tuning (HPO) with Bayesian optimization; set objective metrics and ranges." },
      { id: "d2_4", text: "Track experiments with SageMaker Experiments: trials, trial components, metric logging." },
      { id: "d2_5", text: "Use SageMaker Debugger to detect training anomalies (vanishing gradients, overfitting, loss plateau)." },
      { id: "d2_6", text: "Apply distributed training: SageMaker DDP (data parallel) vs. SMP (model parallel) — when to use each." },
      { id: "d2_7", text: "Detect bias with SageMaker Clarify: pre-training vs. post-training bias metrics; SHAP feature attributions." }
    ]
  },
  {
    id: 3,
    code: "D3",
    title: "Domain 3: Deployment and Orchestration of ML Workflows (22%)",
    subtitle: "Inference modes, MLOps pipelines, model registry, and continuous training.",
    items: [
      { id: "d3_1", text: "Choose correct SageMaker inference mode: Real-Time, Serverless, Async, Batch Transform based on latency/cost." },
      { id: "d3_2", text: "Configure A/B testing with SageMaker Production Variants; shift traffic with UpdateEndpointWeightsAndCapacities." },
      { id: "d3_3", text: "Use SageMaker Multi-Model Endpoints (MME) to host many models on a single endpoint cost-effectively." },
      { id: "d3_4", text: "Build MLOps pipelines with SageMaker Pipelines: ProcessingStep, TrainingStep, ConditionStep, ModelStep." },
      { id: "d3_5", text: "Manage model lifecycle in SageMaker Model Registry: versioning, approval workflows, EventBridge triggers." },
      { id: "d3_6", text: "Configure Application Auto Scaling for SageMaker Real-Time Endpoints (target tracking on InvocationsPerInstance)." },
      { id: "d3_7", text: "Set up continuous training triggers: EventBridge schedule, S3 event → Lambda, drift alarm → pipeline execution." }
    ]
  },
  {
    id: 4,
    code: "D4",
    title: "Domain 4: ML Solution Monitoring, Maintenance, and Security (24%)",
    subtitle: "Model monitoring, drift detection, retraining, security, and compliance.",
    items: [
      { id: "d4_1", text: "Configure SageMaker Model Monitor: Data Quality, Model Quality, Bias Drift, Feature Attribution Drift." },
      { id: "d4_2", text: "Establish a Data Quality baseline and interpret violations (null rates, type mismatches, distribution drift)." },
      { id: "d4_3", text: "Build event-driven retraining pipeline: Model Monitor alarm → CloudWatch → EventBridge → SageMaker Pipeline." },
      { id: "d4_4", text: "Apply least privilege IAM: scope execution roles to specific S3 buckets, ECR repos, KMS keys." },
      { id: "d4_5", text: "Secure SageMaker workloads: VPC isolation, S3 VPC Gateway Endpoint, network isolation, KMS encryption." },
      { id: "d4_6", text: "Use AWS CloudTrail for SageMaker API audit, Amazon Macie for PII detection in S3 training data." }
    ]
  }
];

const NOTES_OFFLINE_FALLBACK = {
  "01_data_preparation.md": `
    <h1>Domain 1: Data Preparation for ML</h1>
    <p>This domain covers data ingestion, transformation, labeling, feature engineering, and quality on AWS. It carries 28% of the MLA-C01 exam weight.</p>
    <h2>1. Data Storage Options</h2>
    <ul>
      <li><strong>Amazon S3:</strong> Raw data lake, model artifacts, training data staging. The universal storage layer for ML on AWS.</li>
      <li><strong>Amazon Redshift:</strong> Columnar SQL tables for structured analytics and Redshift ML in-place training.</li>
      <li><strong>Amazon DynamoDB:</strong> NoSQL key-value for online feature serving (low-latency lookups at inference).</li>
    </ul>
    <h2>2. Batch vs. Streaming Ingestion</h2>
    <ul>
      <li><strong>AWS Glue:</strong> Serverless Apache Spark ETL. Best for large-scale batch transforms.</li>
      <li><strong>Kinesis Data Streams:</strong> Real-time with sub-second latency. Requires consumer code. Supports replay.</li>
      <li><strong>Kinesis Firehose:</strong> Fully managed delivery to S3/Redshift. No consumer code. Choose for simple streaming → S3 pipelines.</li>
    </ul>
    <h2>3. SageMaker Feature Store</h2>
    <p>Online store (DynamoDB, sub-ms lookups) for inference + Offline store (S3) for training with point-in-time joins to prevent data leakage.</p>
    <h2>4. Handling Class Imbalance</h2>
    <p>Never use accuracy for imbalanced datasets. Use SMOTE, class weights, or downsampling. Evaluate with F1, Precision-Recall AUC.</p>
  `,
  "02_model_development.md": `
    <h1>Domain 2: ML Model Development</h1>
    <p>Covers selecting and training models using Amazon SageMaker. Carries 26% of the exam weight.</p>
    <h2>1. SageMaker Built-in Algorithms</h2>
    <ul>
      <li><strong>XGBoost:</strong> Tabular classification/regression. Most popular.</li>
      <li><strong>Random Cut Forest (RCF):</strong> Unsupervised anomaly detection. No labels needed.</li>
      <li><strong>DeepAR:</strong> Time-series probabilistic forecasting across multiple series.</li>
      <li><strong>Factorization Machines:</strong> Recommendation systems on sparse user-item matrices.</li>
      <li><strong>BlazingText:</strong> Text classification and Word2Vec embeddings.</li>
    </ul>
    <h2>2. SageMaker Autopilot (AutoML)</h2>
    <p>Automatically selects algorithm, engineers features, trains, and tunes models. Produces a leaderboard and explainability report.</p>
    <h2>3. Hyperparameter Tuning</h2>
    <p>Uses Bayesian optimization by default — builds a surrogate model of objective function using prior trial results. Far more efficient than grid or random search.</p>
    <h2>4. Distributed Training</h2>
    <ul>
      <li><strong>SageMaker DDP (Data Parallel):</strong> Model fits on one GPU; data split across workers. AllReduce gradient aggregation.</li>
      <li><strong>SageMaker SMP (Model Parallel):</strong> Model exceeds single GPU; layers split across GPUs. Use for LLMs.</li>
    </ul>
  `,
  "03_deployment_and_orchestration.md": `
    <h1>Domain 3: Deployment and Orchestration</h1>
    <p>SageMaker inference options, MLOps pipelines, and model management. Carries 22% of the exam weight.</p>
    <h2>1. Inference Mode Selection</h2>
    <ul>
      <li><strong>Real-Time:</strong> Persistent, low-latency. Pay per hour. For SLA &lt; 1s.</li>
      <li><strong>Serverless:</strong> Scales to zero. Pay per invocation. For sporadic traffic.</li>
      <li><strong>Async:</strong> Background processing, result in S3. For large payloads or long jobs.</li>
      <li><strong>Batch Transform:</strong> Offline bulk scoring from S3. For millions of records overnight.</li>
    </ul>
    <h2>2. SageMaker Pipelines</h2>
    <p>Purpose-built MLOps orchestration. Supports ProcessingStep, TrainingStep, ConditionStep (conditional branching on metrics), ModelStep (register to Model Registry). Step caching prevents redundant computation.</p>
    <h2>3. Model Registry</h2>
    <p>Central catalog for model versions. Approval states: PendingManualApproval → Approved → Rejected. EventBridge fires on approval to trigger automated deployment.</p>
  `,
  "04_monitoring_maintenance_security.md": `
    <h1>Domain 4: Monitoring, Maintenance, and Security</h1>
    <p>Production model quality, drift detection, retraining, and AWS security best practices. Carries 24% of the exam weight.</p>
    <h2>1. SageMaker Model Monitor</h2>
    <ul>
      <li><strong>Data Quality:</strong> Input feature drift (null rates, type violations, distribution shifts). No ground truth needed.</li>
      <li><strong>Model Quality:</strong> Accuracy/error rate vs. ground truth labels.</li>
      <li><strong>Bias Drift:</strong> Fairness metrics across demographic groups.</li>
      <li><strong>Feature Attribution Drift:</strong> SHAP value changes — different features driving predictions.</li>
    </ul>
    <h2>2. Event-Driven Retraining</h2>
    <p>Model Monitor → CloudWatch Alarm → EventBridge → Lambda → SageMaker Pipeline (retrain + evaluate + register).</p>
    <h2>3. Security Essentials</h2>
    <ul>
      <li><strong>Least Privilege IAM:</strong> Scope execution roles to specific buckets and keys only.</li>
      <li><strong>VPC Isolation:</strong> Run jobs in private subnets with S3 VPC Gateway Endpoint.</li>
      <li><strong>KMS Encryption:</strong> CMK for S3, EBS, EFS, inter-node traffic.</li>
      <li><strong>Amazon Macie:</strong> Detect PII in S3 training data.</li>
    </ul>
  `
};

const SNIPPET_OFFLINE_FALLBACK = {
  "sagemaker_training_job.py": `# SageMaker Training Job Reference Template
import boto3, sagemaker
from sagemaker import image_uris
from sagemaker.estimator import Estimator

session = sagemaker.Session()
role = sagemaker.get_execution_role()
region = session.boto_region_name
bucket = session.default_bucket()

xgboost_image = image_uris.retrieve("xgboost", region, version="1.7-1", image_scope="training")

estimator = Estimator(
    image_uri=xgboost_image,
    role=role,
    instance_count=1,
    instance_type="ml.m5.xlarge",
    output_path=f"s3://{bucket}/output",
    sagemaker_session=session
)
estimator.set_hyperparameters(
    objective="binary:logistic",
    num_round=200,
    max_depth=6,
    eta=0.2,
    eval_metric="auc",
    scale_pos_weight=5
)
train_input = sagemaker.inputs.TrainingInput(s3_data=f"s3://{bucket}/train", content_type="text/csv")
val_input = sagemaker.inputs.TrainingInput(s3_data=f"s3://{bucket}/validation", content_type="text/csv")
estimator.fit(inputs={"train": train_input, "validation": val_input})
print("Model artifact:", estimator.model_data)`,

  "sagemaker_pipeline.py": `# SageMaker Pipelines MLOps Reference Template
import boto3, sagemaker
from sagemaker.workflow.pipeline import Pipeline
from sagemaker.workflow.steps import ProcessingStep, TrainingStep
from sagemaker.workflow.conditions import ConditionGreaterThanOrEqualTo
from sagemaker.workflow.condition_step import ConditionStep
from sagemaker.workflow.functions import JsonGet
from sagemaker.workflow.model_step import ModelStep
from sagemaker.workflow.parameters import ParameterFloat, ParameterString
from sagemaker.processing import ScriptProcessor, ProcessingInput, ProcessingOutput
from sagemaker.estimator import Estimator
from sagemaker import image_uris
from sagemaker.workflow.pipeline_context import PipelineSession

session = PipelineSession()
role = sagemaker.get_execution_role()
region = boto3.Session().region_name
bucket = sagemaker.Session().default_bucket()

approval_status = ParameterString(name="ModelApprovalStatus", default_value="PendingManualApproval")
accuracy_threshold = ParameterFloat(name="AccuracyThreshold", default_value=0.80)

sklearn_image = image_uris.retrieve("sklearn", region, version="1.2-1")
preprocessor = ScriptProcessor(image_uri=sklearn_image, command=["python3"], instance_type="ml.m5.large", instance_count=1, role=role, sagemaker_session=session)

preprocess_step = ProcessingStep(name="Preprocess", processor=preprocessor,
    inputs=[ProcessingInput(source=f"s3://{bucket}/raw", destination="/opt/ml/processing/input")],
    outputs=[ProcessingOutput(output_name="train", source="/opt/ml/processing/train"),
             ProcessingOutput(output_name="validation", source="/opt/ml/processing/validation")],
    code="preprocess.py")

xgb_image = image_uris.retrieve("xgboost", region, version="1.7-1")
estimator = Estimator(image_uri=xgb_image, role=role, instance_count=1, instance_type="ml.m5.xlarge",
    output_path=f"s3://{bucket}/output", sagemaker_session=session)
estimator.set_hyperparameters(objective="binary:logistic", num_round=100, eval_metric="auc")

from sagemaker.inputs import TrainingInput
train_step = TrainingStep(name="Train", estimator=estimator,
    inputs={"train": TrainingInput(s3_data=preprocess_step.properties.ProcessingOutputConfig.Outputs["train"].S3Output.S3Uri, content_type="text/csv"),
            "validation": TrainingInput(s3_data=preprocess_step.properties.ProcessingOutputConfig.Outputs["validation"].S3Output.S3Uri, content_type="text/csv")})

pipeline = Pipeline(name="ChurnPipeline", parameters=[approval_status, accuracy_threshold],
    steps=[preprocess_step, train_step], sagemaker_session=session)
pipeline.upsert(role_arn=role)
print("Pipeline ready. Start with pipeline.start()")`,

  "sagemaker_endpoint.py": `# SageMaker Endpoint Deployment Reference
import boto3, sagemaker
from sagemaker.model import Model
from sagemaker import image_uris
from sagemaker.serverless import ServerlessInferenceConfig

session = sagemaker.Session()
role = sagemaker.get_execution_role()
region = session.boto_region_name
sm_client = boto3.client("sagemaker", region_name=region)
xgb_image = image_uris.retrieve("xgboost", region, version="1.7-1", image_scope="inference")
MODEL_ARTIFACT = "s3://your-bucket/output/model.tar.gz"

# Real-Time Endpoint
model = Model(image_uri=xgb_image, model_data=MODEL_ARTIFACT, role=role, sagemaker_session=session)
predictor = model.deploy(initial_instance_count=1, instance_type="ml.m5.large", endpoint_name="churn-v1")

# A/B Testing with Production Variants
sm_client.create_endpoint_config(EndpointConfigName="churn-ab-config", ProductionVariants=[
    {"VariantName": "Champion", "ModelName": "churn-v1", "InstanceType": "ml.m5.large", "InitialInstanceCount": 1, "InitialVariantWeight": 90},
    {"VariantName": "Challenger", "ModelName": "churn-v2", "InstanceType": "ml.m5.large", "InitialInstanceCount": 1, "InitialVariantWeight": 10}
])

# Serverless Inference (scales to zero)
serverless_cfg = ServerlessInferenceConfig(memory_size_in_mb=2048, max_concurrency=10)
serverless_pred = model.deploy(serverless_inference_config=serverless_cfg, endpoint_name="churn-serverless")

# Batch Transform (offline bulk scoring)
from sagemaker.transformer import Transformer
transformer = Transformer(model_name="churn-v1", instance_count=2, instance_type="ml.m5.xlarge",
    output_path="s3://your-bucket/batch-output/", assemble_with="Line", accept="text/csv", sagemaker_session=session)
transformer.transform(data="s3://your-bucket/batch-input/", data_type="S3Prefix", content_type="text/csv", split_type="Line", wait=True)

# Auto Scaling
autoscaling = boto3.client("application-autoscaling", region_name=region)
autoscaling.register_scalable_target(ServiceNamespace="sagemaker",
    ResourceId="endpoint/churn-v1/variant/AllTraffic",
    ScalableDimension="sagemaker:variant:DesiredInstanceCount", MinCapacity=1, MaxCapacity=5)
autoscaling.put_scaling_policy(PolicyName="churn-scaling", ServiceNamespace="sagemaker",
    ResourceId="endpoint/churn-v1/variant/AllTraffic",
    ScalableDimension="sagemaker:variant:DesiredInstanceCount", PolicyType="TargetTrackingScaling",
    TargetTrackingScalingPolicyConfiguration={"TargetValue": 500.0,
        "PredefinedMetricSpecification": {"PredefinedMetricType": "SageMakerVariantInvocationsPerInstance"},
        "ScaleInCooldown": 300, "ScaleOutCooldown": 60})`
};

// =========================================================================
// 2. STATE MANAGEMENT
// =========================================================================
let trackerState = {};
let quizState = { activeQuestions: [], currentIndex: 0, score: 0, hasAnswered: false, selectedOption: null };
let _progressData = { tracker: {}, scheduler: null };

async function loadProgress() {
  try {
    const res = await fetch('/api/progress');
    if (res.ok) { const d = await res.json(); if (d && typeof d === 'object') _progressData = d; }
  } catch (e) { /* server unavailable */ }
}

async function saveProgress() {
  try {
    await fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_progressData) });
  } catch (e) { /* silent */ }
}

// =========================================================================
// 3. INITIALIZATION & ROUTING
// =========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await loadQuestions();
  await loadProgress();
  initTrackerState();
  renderChecklist();
  updateProgressUI();
  setupRouting();
  setupNotesMenu();
  setupQuizEvents();
  setupPlaygroundEvents();
  initStudyPlan();
  loadNotesDoc("01_data_preparation.md");
});

function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("aws-mle-theme") || "dark";
  if (storedTheme === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem("aws-mle-theme", "light");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("aws-mle-theme", "dark");
    }
  });
}

function setupRouting() {
  const navItems = document.querySelectorAll(".nav-item");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const tabTitle = document.getElementById("current-tab-title");
  const tabDesc = document.getElementById("current-tab-desc");
  const tabMeta = {
    tracker: { title: "Study Tracker", desc: "Track your progress across the four official MLA-C01 exam domains." },
    notes: { title: "Study Guides", desc: "Read structured, high-fidelity summaries of key exam topics." },
    quiz: { title: "Mock Exam Quiz", desc: "Test your readiness with certification-style SageMaker questions." },
    cheatsheet: { title: "Cheat Sheets", desc: "Quick reference tables, decision matrices, and service comparisons." },
    playground: { title: "Code Playground", desc: "Explore SageMaker training, pipeline, and endpoint code templates." }
  };
  navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      navItems.forEach(n => n.classList.remove("active"));
      btn.classList.add("active");
      tabPanels.forEach(panel => {
        panel.classList.remove("active");
        if (panel.id === `tab-${tabId}`) panel.classList.add("active");
      });
      if (tabMeta[tabId]) { tabTitle.textContent = tabMeta[tabId].title; tabDesc.textContent = tabMeta[tabId].desc; }
    });
  });
}

// =========================================================================
// 4. TAB 1: TRACKER / CHECKLIST ENGINE
// =========================================================================
function initTrackerState() {
  if (_progressData.tracker && Object.keys(_progressData.tracker).length > 0) {
    trackerState = _progressData.tracker;
  } else {
    trackerState = {};
  }
  DOMAINS_CHECKLIST.forEach(domain => {
    domain.items.forEach(item => {
      if (trackerState[item.id] === undefined) trackerState[item.id] = false;
    });
  });
  saveTrackerState();
}

function saveTrackerState() { _progressData.tracker = trackerState; saveProgress(); }

function renderChecklist() {
  const container = document.getElementById("domains-checklist");
  container.innerHTML = "";
  DOMAINS_CHECKLIST.forEach(domain => {
    const totalItems = domain.items.length;
    const completedItems = domain.items.filter(item => trackerState[item.id]).length;
    const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const accordion = document.createElement("div");
    accordion.className = "domain-accordion";
    accordion.id = `accordion-${domain.id}`;
    accordion.innerHTML = `
      <div class="domain-header" onclick="toggleAccordion(${domain.id})">
        <div class="domain-header-left">
          <div class="domain-badge">${domain.code}</div>
          <div class="domain-title-group">
            <h4>${domain.title}</h4>
            <span>${domain.subtitle}</span>
          </div>
        </div>
        <div class="domain-header-right">
          <div class="domain-progress">
            <div class="dp-bar-outer">
              <div class="dp-bar-inner" id="dp-inner-${domain.id}" style="width: ${pct}%;"></div>
            </div>
            <span id="dp-text-${domain.id}">${pct}%</span>
          </div>
          <i class="fa-solid fa-chevron-down arrow-icon"></i>
        </div>
      </div>
      <div class="domain-content">
        <div class="task-list" id="task-list-${domain.id}"></div>
      </div>
    `;
    container.appendChild(accordion);
    const taskList = document.getElementById(`task-list-${domain.id}`);
    domain.items.forEach(item => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-item";
      const isChecked = trackerState[item.id] ? "checked" : "";
      taskDiv.innerHTML = `
        <div class="task-checkbox-container">
          <input type="checkbox" id="${item.id}" ${isChecked} onchange="toggleTask('${item.id}', ${domain.id})">
          <div class="checkmark"><i class="fa-solid fa-check"></i></div>
        </div>
        <span class="task-text">${item.text}</span>
      `;
      taskList.appendChild(taskDiv);
    });
  });
}

window.toggleAccordion = function(domainId) {
  document.getElementById(`accordion-${domainId}`).classList.toggle("expanded");
};

window.toggleTask = function(taskId, domainId) {
  const checkbox = document.getElementById(taskId);
  trackerState[taskId] = checkbox.checked;
  saveTrackerState();
  const domain = DOMAINS_CHECKLIST.find(d => d.id === domainId);
  const totalItems = domain.items.length;
  const completedItems = domain.items.filter(item => trackerState[item.id]).length;
  const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  document.getElementById(`dp-inner-${domainId}`).style.width = `${pct}%`;
  document.getElementById(`dp-text-${domainId}`).textContent = `${pct}%`;
  updateProgressUI();
};

function updateProgressUI() {
  const total = Object.keys(trackerState).length;
  const completed = Object.values(trackerState).filter(v => v).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  document.getElementById("widget-pct").textContent = `${pct}%`;
  document.getElementById("widget-bar").style.width = `${pct}%`;
  const statCompleted = document.getElementById("stat-completed-tasks");
  const statRate = document.getElementById("stat-completion-rate");
  if (statCompleted) statCompleted.textContent = `${completed} / ${total}`;
  if (statRate) statRate.textContent = `${pct}%`;
}

// =========================================================================
// 5. TAB 2: STUDY NOTES ENGINE
// =========================================================================
function setupNotesMenu() {
  const notesMenuList = document.getElementById("notes-menu-list");
  if (!notesMenuList) return;
  const listItems = notesMenuList.querySelectorAll("li");
  listItems.forEach(item => {
    item.addEventListener("click", () => {
      listItems.forEach(li => li.classList.remove("active"));
      item.classList.add("active");
      loadNotesDoc(item.getAttribute("data-doc"));
    });
  });
}

function loadNotesDoc(filename) {
  const bodyEl = document.getElementById("notes-view-body");
  const loaderEl = document.getElementById("notes-loading");
  loaderEl.classList.remove("hidden");
  bodyEl.classList.add("hidden");
  fetch(`./docs/${filename}`)
    .then(response => { if (!response.ok) throw new Error("CORS or File Not Found"); return response.text(); })
    .then(markdown => {
      bodyEl.innerHTML = parseSimpleMarkdown(markdown);
      loaderEl.classList.add("hidden");
      bodyEl.classList.remove("hidden");
      if (window.Prism) Prism.highlightAllUnder(bodyEl);
    })
    .catch(err => {
      console.warn("Falling back to offline content.", err);
      bodyEl.innerHTML = NOTES_OFFLINE_FALLBACK[filename] || "<h3>Content not found offline.</h3>";
      loaderEl.classList.add("hidden");
      bodyEl.classList.remove("hidden");
      if (window.Prism) Prism.highlightAllUnder(bodyEl);
    });
}

function parseSimpleMarkdown(md) {
  let html = md;
  html = html.replace(/```mermaid[\s\S]*?```/g, '');
  const codeBlocks = [];
  html = html.replace(/```([a-zA-Z0-9_\-]+)?\n([\s\S]*?)```/g, (match, lang, codeContent) => {
    const placeholder = `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}__`;
    codeBlocks.push({ lang: lang || 'text', content: codeContent });
    return placeholder;
  });
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, codeContent) => {
    const placeholder = `__INLINE_CODE_PLACEHOLDER_${inlineCodes.length}__`;
    inlineCodes.push(codeContent);
    return placeholder;
  });
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^[*\-] (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\.\s+(.*?)$/gm, '<oli>$1</oli>');
  html = html.replace(/((?:<li>[^\n]*<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/((?:<oli>[^\n]*<\/oli>\n?)+)/g, (m) => '<ol>' + m.replace(/<\/?oli>/g, s => s.replace('oli', 'li')) + '</ol>');
  const lines = html.split('\n');
  let inTable = false, isFirstRow = true, tableHtml = '<table>', inBlockquote = false, blockquoteContent = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('>')) {
      if (inTable) { inTable = false; tableHtml += '</table>'; lines[i] = tableHtml + '\n' + lines[i]; }
      if (!inBlockquote) { inBlockquote = true; blockquoteContent = ''; }
      let text = line.substring(1).trim();
      if (text.startsWith('[!')) { const ci = text.indexOf(']'); if (ci !== -1) { const at = text.substring(2, ci); text = `<strong>${at}:</strong> ${text.substring(ci+1).trim()}`; } }
      blockquoteContent += (blockquoteContent ? '<br>' : '') + text;
      lines[i] = ''; continue;
    } else { if (inBlockquote) { inBlockquote = false; lines[i] = `<blockquote>${blockquoteContent}</blockquote>\n` + lines[i]; } }
    if (line.startsWith('|')) {
      if (!inTable) { inTable = true; isFirstRow = true; tableHtml = '<table>'; }
      const cols = line.split('|').slice(1, -1).map(c => c.trim());
      if (cols.every(c => c.startsWith(':') || c.startsWith('-'))) { lines[i] = ''; continue; }
      const tag = isFirstRow ? 'th' : 'td';
      tableHtml += '<tr>' + cols.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
      isFirstRow = false;
      lines[i] = '';
    } else { if (inTable) { inTable = false; tableHtml += '</table>'; lines[i] = tableHtml + '\n' + lines[i]; } }
  }
  if (inBlockquote) lines.push(`<blockquote>${blockquoteContent}</blockquote>`);
  if (inTable) { tableHtml += '</table>'; lines.push(tableHtml); }
  html = lines.join('\n');
  const escHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  inlineCodes.forEach((c, i) => { html = html.replace(`__INLINE_CODE_PLACEHOLDER_${i}__`, () => `<code>${escHtml(c)}</code>`); });
  codeBlocks.forEach((block, i) => { html = html.replace(`__CODE_BLOCK_PLACEHOLDER_${i}__`, () => `<pre><code class="language-${block.lang}">${escHtml(block.content)}</code></pre>`); });
  return html;
}

// =========================================================================
// 6. TAB 3: MOCK EXAM QUIZ ENGINE
// =========================================================================
function setupQuizEvents() {
  document.getElementById("start-quiz-btn").addEventListener("click", startQuiz);
  document.getElementById("quiz-next-btn").addEventListener("click", nextQuestion);
  document.getElementById("restart-quiz-btn").addEventListener("click", resetQuizIntro);
  document.getElementById("quiz-review-tracker-btn").addEventListener("click", () => {
    document.querySelector('[data-tab="tracker"]').click();
  });
}

function startQuiz() {
  const mode = document.getElementById("quiz-mode").value;
  let pool = [...window.PRACTICE_QUESTIONS];
  if (mode === "quick") {
    pool = shuffleArray(pool).slice(0, 10);
  } else if (mode.startsWith("d")) {
    const domainNum = mode.substring(1);
    pool = pool.filter(q => q.domain.includes(`Domain ${domainNum}`));
    if (pool.length === 0) { alert("No questions found for this domain yet."); return; }
  }
  quizState.activeQuestions = pool;
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.hasAnswered = false;
  quizState.selectedOption = null;
  document.getElementById("quiz-intro-card").classList.add("hidden");
  document.getElementById("quiz-results-card").classList.add("hidden");
  document.getElementById("quiz-running-card").classList.remove("hidden");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const question = quizState.activeQuestions[quizState.currentIndex];
  quizState.hasAnswered = false;
  quizState.selectedOption = null;
  document.getElementById("quiz-question-number").textContent = `Question ${quizState.currentIndex + 1} of ${quizState.activeQuestions.length}`;
  document.getElementById("quiz-question-domain").textContent = question.domain;
  document.getElementById("quiz-question-text").textContent = question.question;
  const pct = Math.round((quizState.currentIndex / quizState.activeQuestions.length) * 100);
  document.getElementById("quiz-progress-fill").style.width = `${pct}%`;
  const optionsContainer = document.getElementById("quiz-options-list");
  optionsContainer.innerHTML = "";
  question.options.forEach((optText, index) => {
    const letter = String.fromCharCode(65 + index);
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="option-letter">${letter}</span><span class="option-text">${optText}</span>`;
    btn.addEventListener("click", () => selectOption(index));
    optionsContainer.appendChild(btn);
  });
  document.getElementById("quiz-next-btn").disabled = true;
  document.getElementById("quiz-next-btn").querySelector("span").textContent =
    quizState.currentIndex === quizState.activeQuestions.length - 1 ? "Finish Quiz" : "Submit Answer";
  const feedbackBox = document.getElementById("quiz-feedback-box");
  feedbackBox.classList.add("hidden");
  feedbackBox.classList.remove("correct-fb", "wrong-fb");
  document.getElementById("quiz-score-indicator").textContent = `Score: ${quizState.score} / ${quizState.currentIndex}`;
}

function selectOption(index) {
  if (quizState.hasAnswered) return;
  document.querySelectorAll(".option-btn").forEach((btn, idx) => {
    btn.classList.toggle("selected", idx === index);
  });
  quizState.selectedOption = index;
  document.getElementById("quiz-next-btn").disabled = false;
}

function nextQuestion() {
  const nextBtn = document.getElementById("quiz-next-btn");
  if (!quizState.hasAnswered) {
    evaluateChoice();
    quizState.hasAnswered = true;
    nextBtn.querySelector("span").textContent =
      quizState.currentIndex === quizState.activeQuestions.length - 1 ? "Show Results" : "Next Question";
  } else {
    if (quizState.currentIndex < quizState.activeQuestions.length - 1) {
      quizState.currentIndex++;
      renderQuizQuestion();
    } else {
      showQuizResults();
    }
  }
}

function evaluateChoice() {
  const question = quizState.activeQuestions[quizState.currentIndex];
  const selectedIndex = quizState.selectedOption;
  const correctIndex = question.answer;
  const isCorrect = (selectedIndex === correctIndex);
  if (isCorrect) quizState.score++;
  document.querySelectorAll(".option-btn").forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIndex) { btn.classList.remove("selected"); btn.classList.add("correct"); }
    else if (idx === selectedIndex) { btn.classList.remove("selected"); btn.classList.add("wrong"); }
  });
  const feedbackBox = document.getElementById("quiz-feedback-box");
  const heading = document.getElementById("feedback-heading");
  const explanation = document.getElementById("feedback-explanation");
  const icon = document.getElementById("feedback-icon");
  if (isCorrect) {
    feedbackBox.classList.add("correct-fb");
    heading.textContent = "Correct!";
    icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
  } else {
    feedbackBox.classList.add("wrong-fb");
    heading.textContent = `Incorrect (Correct Option: ${String.fromCharCode(65 + correctIndex)})`;
    icon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
  }
  explanation.textContent = question.explanation;
  feedbackBox.classList.remove("hidden");
  document.getElementById("quiz-score-indicator").textContent = `Score: ${quizState.score} / ${quizState.currentIndex + 1}`;
}

function showQuizResults() {
  document.getElementById("quiz-running-card").classList.add("hidden");
  document.getElementById("quiz-results-card").classList.remove("hidden");
  const total = quizState.activeQuestions.length;
  const finalScore = quizState.score;
  const pct = Math.round((finalScore / total) * 100);
  document.getElementById("results-score").textContent = `${finalScore} / ${total}`;
  document.getElementById("results-percentage").textContent = `${pct}%`;
  const feedbackTextEl = document.getElementById("results-feedback-text");
  if (pct >= 85) {
    feedbackTextEl.innerHTML = "<strong>Incredible!</strong> You scored in the master range. Deep grasp of SageMaker, MLOps, and AWS security. Keep reviewing and you're ready for the official exam!";
  } else if (pct >= 70) {
    feedbackTextEl.innerHTML = "<strong>Solid Effort!</strong> You passed. Focus on domains where you missed questions — review the study guides and try again to secure a higher margin.";
  } else {
    feedbackTextEl.innerHTML = "<strong>Keep Studying!</strong> Review the domain checklists, read the study guides, and try the quiz again. Focus especially on SageMaker inference modes and Model Monitor.";
  }
}

function resetQuizIntro() {
  document.getElementById("quiz-results-card").classList.add("hidden");
  document.getElementById("quiz-intro-card").classList.remove("hidden");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =========================================================================
// 7. TAB 5: CODE PLAYGROUND ENGINE
// =========================================================================
function setupPlaygroundEvents() {
  const buttons = document.querySelectorAll(".snippet-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadCodeSnippet(btn.getAttribute("data-file"));
    });
  });
  document.getElementById("copy-snippet-btn").addEventListener("click", () => {
    const codeText = document.getElementById("snippet-code-block").textContent;
    navigator.clipboard.writeText(codeText).then(() => {
      const copyBtn = document.getElementById("copy-snippet-btn");
      copyBtn.querySelector("span").textContent = "Copied!";
      copyBtn.querySelector("i").className = "fa-solid fa-check";
      setTimeout(() => {
        copyBtn.querySelector("span").textContent = "Copy";
        copyBtn.querySelector("i").className = "fa-regular fa-copy";
      }, 2000);
    });
  });
  loadCodeSnippet("sagemaker_training_job.py");
}

function loadCodeSnippet(filename) {
  const codeEl = document.getElementById("snippet-code-block");
  const nameEl = document.getElementById("current-snippet-name");
  nameEl.textContent = filename;
  codeEl.className = 'language-python';
  fetch(`./src/snippets/${filename}`)
    .then(response => { if (!response.ok) throw new Error("CORS or Snippet Not Found"); return response.text(); })
    .then(code => { 
      codeEl.textContent = code; 
      if (window.Prism) Prism.highlightElement(codeEl);
    })
    .catch(err => {
      console.warn("Falling back to offline snippet.", err);
      codeEl.textContent = SNIPPET_OFFLINE_FALLBACK[filename] || "# Snippet not found offline.";
      if (window.Prism) Prism.highlightElement(codeEl);
    });
}

// =========================================================================
// 8. TAILORED STUDY PLAN SCHEDULER ENGINE
// =========================================================================
const STUDY_PLANS = {
  14: [
    { day: 1, title: "AWS ML Services Overview", desc: "Survey SageMaker modes and AWS ML service landscape.", tasks: [ { id: "sp_14_1_1", text: "Read Data Preparation notes", action: "notes", target: "01_data_preparation.md" } ] },
    { day: 2, title: "Data Storage & Ingestion", desc: "S3, Glue, Kinesis Streams vs. Firehose patterns.", tasks: [ { id: "sp_14_2_1", text: "Read Data Preparation notes (ingestion section)", action: "notes", target: "01_data_preparation.md" }, { id: "sp_14_2_2", text: "Take Domain 1 quiz questions", action: "quiz", target: "d1" } ] },
    { day: 3, title: "Feature Engineering & Feature Store", desc: "SageMaker Data Wrangler, Feature Store online/offline.", tasks: [ { id: "sp_14_3_1", text: "Read Feature Store section in Domain 1 notes", action: "notes", target: "01_data_preparation.md" } ] },
    { day: 4, title: "Data Quality & Labeling", desc: "Ground Truth workflows, class imbalance, data splits.", tasks: [ { id: "sp_14_4_1", text: "Read data quality & labeling in Domain 1 notes", action: "notes", target: "01_data_preparation.md" }, { id: "sp_14_4_2", text: "Take Domain 1 quiz", action: "quiz", target: "d1" } ] },
    { day: 5, title: "Built-in Algorithms", desc: "XGBoost, RCF, DeepAR, Factorization Machines, BlazingText.", tasks: [ { id: "sp_14_5_1", text: "Read Model Development notes", action: "notes", target: "02_model_development.md" }, { id: "sp_14_5_2", text: "Study SageMaker training job snippet", action: "playground", target: "sagemaker_training_job.py" } ] },
    { day: 6, title: "Autopilot, HPO & Distributed Training", desc: "AutoML, Bayesian HPO, SDP vs. SMP distributed training.", tasks: [ { id: "sp_14_6_1", text: "Read Model Development notes (HPO + distributed)", action: "notes", target: "02_model_development.md" }, { id: "sp_14_6_2", text: "Take Domain 2 quiz", action: "quiz", target: "d2" } ] },
    { day: 7, title: "Mid-Sprint Review", desc: "Quiz yourself across Domains 1 and 2.", tasks: [ { id: "sp_14_7_1", text: "Take 10-Question Quick Practice test", action: "quiz", target: "quick" } ] },
    { day: 8, title: "SageMaker Inference Modes", desc: "Real-Time, Serverless, Async, Batch Transform — when to use each.", tasks: [ { id: "sp_14_8_1", text: "Read Deployment & Orchestration notes", action: "notes", target: "03_deployment_and_orchestration.md" }, { id: "sp_14_8_2", text: "Study SageMaker endpoint snippet", action: "playground", target: "sagemaker_endpoint.py" } ] },
    { day: 9, title: "MLOps Pipelines & Model Registry", desc: "SageMaker Pipelines steps, conditional branching, approval workflows.", tasks: [ { id: "sp_14_9_1", text: "Read Deployment & Orchestration notes (pipelines)", action: "notes", target: "03_deployment_and_orchestration.md" }, { id: "sp_14_9_2", text: "Study SageMaker pipeline snippet", action: "playground", target: "sagemaker_pipeline.py" } ] },
    { day: 10, title: "A/B Testing & Auto Scaling", desc: "Production Variants, traffic shifting, Application Auto Scaling.", tasks: [ { id: "sp_14_10_1", text: "Read A/B testing section in Domain 3 notes", action: "notes", target: "03_deployment_and_orchestration.md" }, { id: "sp_14_10_2", text: "Take Domain 3 quiz", action: "quiz", target: "d3" } ] },
    { day: 11, title: "Model Monitor Setup", desc: "Data Quality, Model Quality baselines and monitoring schedules.", tasks: [ { id: "sp_14_11_1", text: "Read Monitoring & Security notes", action: "notes", target: "04_monitoring_maintenance_security.md" } ] },
    { day: 12, title: "Security & Compliance", desc: "IAM least privilege, VPC isolation, KMS, CloudTrail, Macie.", tasks: [ { id: "sp_14_12_1", text: "Read security section in Domain 4 notes", action: "notes", target: "04_monitoring_maintenance_security.md" }, { id: "sp_14_12_2", text: "Take Domain 4 quiz", action: "quiz", target: "d4" } ] },
    { day: 13, title: "Drift & Retraining Patterns", desc: "Event-driven retraining architecture: Monitor → Alarm → EventBridge → Pipeline.", tasks: [ { id: "sp_14_13_1", text: "Review cheat sheets: monitoring and security", action: "cheatsheet", target: "" }, { id: "sp_14_13_2", text: "Take Domain 4 quiz", action: "quiz", target: "d4" } ] },
    { day: 14, title: "Final Mock Exam", desc: "Simulate full exam and review all domains.", tasks: [ { id: "sp_14_14_1", text: "Take Full Mock Exam (all questions)", action: "quiz", target: "all" }, { id: "sp_14_14_2", text: "Review all Cheat Sheets", action: "cheatsheet", target: "" } ] }
  ],
  28: [
    { day: 1, title: "AWS ML Ecosystem Overview", desc: "Survey SageMaker and AWS AI/ML services.", tasks: [ { id: "sp_28_1_1", text: "Read Domain 1 notes intro", action: "notes", target: "01_data_preparation.md" } ] },
    { day: 2, title: "S3 for ML Data Storage", desc: "S3 as data lake; bucket policies, versioning, S3 Select.", tasks: [ { id: "sp_28_2_1", text: "Read storage options in Domain 1 notes", action: "notes", target: "01_data_preparation.md" } ] },
    { day: 3, title: "AWS Glue Batch ETL", desc: "Glue crawlers, Spark jobs, Data Catalog, Glue DataBrew.", tasks: [ { id: "sp_28_3_1", text: "Read batch ingestion section in Domain 1 notes", action: "notes", target: "01_data_preparation.md" } ] },
    { day: 4, title: "Kinesis Streaming Patterns", desc: "Streams vs. Firehose vs. MSK — latency, consumers, delivery.", tasks: [ { id: "sp_28_4_1", text: "Study streaming ingestion comparison in Domain 1 notes", action: "notes", target: "01_data_preparation.md" } ] },
    { day: 5, title: "Domain 1 Quiz Practice", desc: "Test data preparation knowledge.", tasks: [ { id: "sp_28_5_1", text: "Take Domain 1 quiz", action: "quiz", target: "d1" } ] },
    { day: 6, title: "SageMaker Feature Store", desc: "Online vs. offline store; point-in-time joins.", tasks: [ { id: "sp_28_6_1", text: "Read Feature Store section", action: "notes", target: "01_data_preparation.md" } ] },
    { day: 7, title: "Week 1 Review", desc: "Review data preparation concepts.", tasks: [ { id: "sp_28_7_1", text: "Review Domain 1 cheat sheet tables", action: "cheatsheet", target: "" } ] },
    { day: 8, title: "Data Quality & Labeling", desc: "Ground Truth, class imbalance, imputation strategies.", tasks: [ { id: "sp_28_8_1", text: "Read data quality and labeling sections", action: "notes", target: "01_data_preparation.md" } ] },
    { day: 9, title: "SageMaker Built-in Algorithms", desc: "XGBoost, Linear Learner, RCF, DeepAR, FM, BlazingText.", tasks: [ { id: "sp_28_9_1", text: "Read Model Development notes (algorithms)", action: "notes", target: "02_model_development.md" } ] },
    { day: 10, title: "SageMaker Autopilot", desc: "AutoML workflow, candidate pipelines, leaderboard.", tasks: [ { id: "sp_28_10_1", text: "Read Autopilot section in Domain 2 notes", action: "notes", target: "02_model_development.md" } ] },
    { day: 11, title: "Hyperparameter Tuning", desc: "Bayesian optimization, warm start, parallel jobs.", tasks: [ { id: "sp_28_11_1", text: "Read HPO section in Domain 2 notes", action: "notes", target: "02_model_development.md" }, { id: "sp_28_11_2", text: "Study training job snippet with HPO section", action: "playground", target: "sagemaker_training_job.py" } ] },
    { day: 12, title: "Distributed Training", desc: "SageMaker DDP (data parallel) vs. SMP (model parallel).", tasks: [ { id: "sp_28_12_1", text: "Read distributed training section in Domain 2 notes", action: "notes", target: "02_model_development.md" } ] },
    { day: 13, title: "Domain 2 Quiz Practice", desc: "Test model development knowledge.", tasks: [ { id: "sp_28_13_1", text: "Take Domain 2 quiz", action: "quiz", target: "d2" } ] },
    { day: 14, title: "Week 2 Review", desc: "Review model development concepts.", tasks: [ { id: "sp_28_14_1", text: "Take 10-Question Quick Practice test", action: "quiz", target: "quick" } ] },
    { day: 15, title: "Debugger & Clarify", desc: "Detect training anomalies; bias detection with SHAP.", tasks: [ { id: "sp_28_15_1", text: "Read Debugger and Clarify sections in Domain 2 notes", action: "notes", target: "02_model_development.md" } ] },
    { day: 16, title: "SageMaker Inference Modes", desc: "Real-Time vs. Serverless vs. Async vs. Batch.", tasks: [ { id: "sp_28_16_1", text: "Read Deployment notes (inference modes)", action: "notes", target: "03_deployment_and_orchestration.md" }, { id: "sp_28_16_2", text: "Study SageMaker endpoint snippet", action: "playground", target: "sagemaker_endpoint.py" } ] },
    { day: 17, title: "A/B Testing & MME", desc: "Production Variants, traffic weights, Multi-Model Endpoints.", tasks: [ { id: "sp_28_17_1", text: "Read A/B testing and MME sections", action: "notes", target: "03_deployment_and_orchestration.md" } ] },
    { day: 18, title: "SageMaker Pipelines", desc: "Pipeline steps, parameters, caching, lineage.", tasks: [ { id: "sp_28_18_1", text: "Read SageMaker Pipelines section in Domain 3 notes", action: "notes", target: "03_deployment_and_orchestration.md" }, { id: "sp_28_18_2", text: "Study SageMaker pipeline snippet", action: "playground", target: "sagemaker_pipeline.py" } ] },
    { day: 19, title: "Model Registry & CT", desc: "Versioning, approval workflows, continuous training triggers.", tasks: [ { id: "sp_28_19_1", text: "Read Model Registry and CT trigger sections", action: "notes", target: "03_deployment_and_orchestration.md" } ] },
    { day: 20, title: "Domain 3 Quiz Practice", desc: "Test deployment and orchestration knowledge.", tasks: [ { id: "sp_28_20_1", text: "Take Domain 3 quiz", action: "quiz", target: "d3" } ] },
    { day: 21, title: "Week 3 Review", desc: "Review deployment and orchestration concepts.", tasks: [ { id: "sp_28_21_1", text: "Review cheat sheet: inference modes and MLOps", action: "cheatsheet", target: "" } ] },
    { day: 22, title: "SageMaker Model Monitor", desc: "Four monitor types: Data Quality, Model Quality, Bias, Attribution.", tasks: [ { id: "sp_28_22_1", text: "Read Monitoring notes", action: "notes", target: "04_monitoring_maintenance_security.md" } ] },
    { day: 23, title: "Baseline & Monitoring Schedule", desc: "Generate baselines, schedule monitoring jobs, interpret violations.", tasks: [ { id: "sp_28_23_1", text: "Read baseline and monitoring workflow in Domain 4 notes", action: "notes", target: "04_monitoring_maintenance_security.md" } ] },
    { day: 24, title: "Retraining Architecture", desc: "Event-driven retraining: Monitor → Alarm → EventBridge → Pipeline.", tasks: [ { id: "sp_28_24_1", text: "Read drift and retraining section in Domain 4 notes", action: "notes", target: "04_monitoring_maintenance_security.md" } ] },
    { day: 25, title: "IAM & Network Security", desc: "Least privilege, VPC, S3 endpoints, network isolation.", tasks: [ { id: "sp_28_25_1", text: "Read security section in Domain 4 notes", action: "notes", target: "04_monitoring_maintenance_security.md" } ] },
    { day: 26, title: "Encryption & Compliance", desc: "KMS CMK, CloudTrail, Macie, Inspector, Security Hub.", tasks: [ { id: "sp_28_26_1", text: "Review security cheat sheet", action: "cheatsheet", target: "" } ] },
    { day: 27, title: "Domain 4 Quiz Practice", desc: "Test monitoring and security knowledge.", tasks: [ { id: "sp_28_27_1", text: "Take Domain 4 quiz", action: "quiz", target: "d4" } ] },
    { day: 28, title: "Final Exam Simulation", desc: "Full exam simulation across all four domains.", tasks: [ { id: "sp_28_28_1", text: "Take Full Mock Exam (all questions)", action: "quiz", target: "all" } ] }
  ]
};

let schedulerState = { activeDuration: 14, 14: {}, 28: {}, selectedDay: 1 };

function initStudyPlan() {
  if (_progressData.scheduler) schedulerState = _progressData.scheduler;
  if (!schedulerState[14]) schedulerState[14] = {};
  if (!schedulerState[28]) schedulerState[28] = {};
  [14, 28].forEach(duration => {
    STUDY_PLANS[duration].forEach(dayData => {
      dayData.tasks.forEach(task => {
        if (schedulerState[duration][task.id] === undefined) schedulerState[duration][task.id] = false;
      });
    });
  });
  saveSchedulerState();
  setStudyPlanDuration(schedulerState.activeDuration || 14);
}

function saveSchedulerState() { _progressData.scheduler = schedulerState; saveProgress(); }

window.setStudyPlanDuration = function(duration) {
  schedulerState.activeDuration = duration;
  if (schedulerState.selectedDay > duration) schedulerState.selectedDay = 1;
  saveSchedulerState();
  document.getElementById("plan-btn-14").className = duration === 14 ? "btn-timeline-toggle active" : "btn-timeline-toggle";
  document.getElementById("plan-btn-28").className = duration === 28 ? "btn-timeline-toggle active" : "btn-timeline-toggle";
  renderSchedulerTimeline();
  renderSelectedDayDetails();
};

function renderSchedulerTimeline() {
  const track = document.getElementById("timeline-days-track");
  track.innerHTML = "";
  const duration = schedulerState.activeDuration;
  STUDY_PLANS[duration].forEach(dayData => {
    const btn = document.createElement("button");
    btn.className = "timeline-day-btn";
    if (dayData.day === schedulerState.selectedDay) btn.classList.add("active");
    if (dayData.tasks.every(t => schedulerState[duration][t.id])) btn.classList.add("completed");
    btn.innerHTML = `<span class="day-num">${dayData.day}</span><span class="day-lbl">Day</span>`;
    btn.addEventListener("click", () => {
      schedulerState.selectedDay = dayData.day;
      saveSchedulerState();
      document.querySelectorAll(".timeline-day-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderSelectedDayDetails();
    });
    track.appendChild(btn);
  });
}

function renderSelectedDayDetails() {
  const detailBox = document.getElementById("timeline-day-detail-box");
  const duration = schedulerState.activeDuration;
  const dayNum = schedulerState.selectedDay;
  const dayData = STUDY_PLANS[duration].find(d => d.day === dayNum);
  if (!dayData) return;
  const allCompleted = dayData.tasks.every(t => schedulerState[duration][t.id]);
  const statusLabel = allCompleted ? "Completed" : "In Progress";
  const badgeClass = allCompleted ? "tdd-status-badge completed" : "tdd-status-badge";
  let tasksHtml = "";
  dayData.tasks.forEach(task => {
    const isTaskDone = schedulerState[duration][task.id];
    tasksHtml += `
      <li class="${isTaskDone ? 'tdd-task-item completed' : 'tdd-task-item'}" onclick="toggleSchedulerTask('${task.id}')">
        <i class="${isTaskDone ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
        <span>${task.text}</span>
        ${task.action ? `<span style="font-size: 0.75rem; color: var(--primary); margin-left: auto;">[Launch <i class="fa-solid fa-arrow-right" style="font-size: 0.65rem; color: var(--primary); margin-left: 2px;"></i>]</span>` : ""}
      </li>
    `;
  });
  detailBox.innerHTML = `
    <div class="tdd-header">
      <h4>Day ${dayData.day}: ${dayData.title}</h4>
      <span class="${badgeClass}" id="tdd-badge">${statusLabel}</span>
    </div>
    <p class="tdd-description">${dayData.desc}</p>
    <ul class="tdd-tasks-list">${tasksHtml}</ul>
    <div class="tdd-actions">
      <button class="btn-secondary" onclick="markAllDayTasks(${allCompleted ? 'false' : 'true'})">
        <i class="fa-solid ${allCompleted ? 'fa-xmark' : 'fa-check'}"></i>
        <span>${allCompleted ? 'Mark Day Incomplete' : 'Mark Day Complete'}</span>
      </button>
    </div>
  `;
  const taskElements = detailBox.querySelectorAll(".tdd-tasks-list li");
  taskElements.forEach((el, index) => {
    const task = dayData.tasks[index];
    const launchSpan = el.querySelector("span[style]");
    if (launchSpan) {
      launchSpan.addEventListener("click", (e) => {
        e.stopPropagation();
        executeSchedulerAction(task.action, task.target);
      });
    }
  });
}

window.toggleSchedulerTask = function(taskId) {
  const duration = schedulerState.activeDuration;
  schedulerState[duration][taskId] = !schedulerState[duration][taskId];
  saveSchedulerState();
  renderSchedulerTimeline();
  renderSelectedDayDetails();
};

window.markAllDayTasks = function(shouldComplete) {
  const duration = schedulerState.activeDuration;
  const dayData = STUDY_PLANS[duration].find(d => d.day === schedulerState.selectedDay);
  dayData.tasks.forEach(task => { schedulerState[duration][task.id] = shouldComplete; });
  saveSchedulerState();
  renderSchedulerTimeline();
  renderSelectedDayDetails();
};

function executeSchedulerAction(action, target) {
  if (action === "notes") {
    document.querySelector('[data-tab="notes"]').click();
    document.querySelectorAll("#notes-menu-list li").forEach(li => { if (li.getAttribute("data-doc") === target) li.click(); });
  } else if (action === "playground") {
    document.querySelector('[data-tab="playground"]').click();
    document.querySelectorAll("#snippet-btn-container button").forEach(btn => { if (btn.getAttribute("data-file") === target) btn.click(); });
  } else if (action === "quiz") {
    document.querySelector('[data-tab="quiz"]').click();
    const modeSelect = document.getElementById("quiz-mode");
    if (modeSelect) { modeSelect.value = target; startQuiz(); }
  } else if (action === "cheatsheet") {
    document.querySelector('[data-tab="cheatsheet"]').click();
  }
}
