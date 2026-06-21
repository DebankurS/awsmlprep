# TODO — AWS ML Certification Project-Specific Fixes

- [x] **Silent Domain Validation Gaps in test.js (High Priority)**
  - Add domain validation assertions in `test.js` to ensure questions only use valid canonical domain strings:
    - `"Domain 1: Data Preparation for ML"`
    - `"Domain 2: ML Model Development"`
    - `"Domain 3: Deployment and Orchestration"`
    - `"Domain 4: Monitoring, Maintenance, and Security"`

- [x] **Loose Test Thresholds (Medium Priority)**
  - Update `test.js` to assert the exact question count of **45** (currently asserts `>= 30`).

- [ ] **Question Storage Standardization (Architectural)**
  - Standardize question storage format to match the other projects (e.g., GCP uses JSONs while AWS/Databricks use script modules).
