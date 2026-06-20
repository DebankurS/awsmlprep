# AWS ML Engineer Associate Study Companion

Interactive study dashboard for the **AWS Certified Machine Learning Engineer – Associate (MLA-C01)** exam.

## Quick Start

```bash
docker compose up        # start dashboard at http://localhost:3001
docker compose up -d     # start detached
docker compose down      # stop
npm test                 # spin up Docker, run tests, tear down
```

App runs at **http://localhost:3001**.

## Features

- **Study Tracker** — progress checklist across 4 official exam domains
- **Study Guides** — structured markdown notes per domain
- **Mock Exam Quiz** — 30+ SageMaker and AWS ML practice questions
- **Cheat Sheets** — decision tables and service comparisons
- **Code Playground** — SageMaker training, pipeline, and endpoint templates
- **Study Plan Scheduler** — 14-day sprint or 28-day paced roadmap

## Exam Overview

| Domain | Weight |
|---|---|
| Domain 1: Data Preparation for ML | 28% |
| Domain 2: ML Model Development | 26% |
| Domain 3: Deployment and Orchestration of ML Workflows | 22% |
| Domain 4: ML Solution Monitoring, Maintenance, and Security | 24% |
