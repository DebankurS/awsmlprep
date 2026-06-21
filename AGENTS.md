# AGENTS.md

## Setup commands
- Start server: `docker compose up -d`
- Stop server: `docker compose down`
- Run automated test suite: `docker compose up -d && npm test && docker compose down`
- App runs at **http://localhost:3001** (port 3001 to avoid conflict with gcpmleprep on 3000)

## Project structure
- `server.js` — zero-dependency Node.js HTTP server (serves `public/` + `/api/progress` GET/POST)
- `docker-compose.yml` — runs server.js via node:22-alpine, maps host 3001 → container 3000
- `package.json` — project configuration & scripts
- `test.js` — automated test suite
- `TODO.md` — tracks remaining fixes and inconsistencies
- `data/progress.json` — file-backed progress store (git-ignored, created at runtime)
- `public/` — all web assets (mounted read-only into container)
  - `index.html` / `style.css` / `app.js` — single-page dashboard UI
  - `questions.js` — quiz question bank (AWS MLA-C01 topics)
  - `docs/` — study guides (01–04 topics, markdown)
  - `src/snippets/` — AWS ML code templates

## Code style and conventions
- **Technologies**: Vanilla HTML, Vanilla CSS, pure JavaScript — no frameworks.
- **Server**: `server.js` (zero-dependency Node stdlib) via Docker Compose only. Do not add npm dependencies.
- **Persistence**: Progress stored in `progress.json` via `GET/POST /api/progress`. Do not use localStorage for tracker or scheduler state — theme preference only.
- **Formatting**: GitHub-style markdown for all docs and responses.
- **Documentation**: Preserve all existing comments/docstrings unrelated to the change.
- **AWS SDK**: All code snippets use `boto3` for Python AWS SDK calls. Use `sagemaker` Python SDK for SageMaker-specific operations.

## Keeping TODO.md current

When completing any task listed in `TODO.md`, mark it done immediately:
- Change `- [ ]` to `- [x]` for the completed item.
- Do this in the same step as the fix — do not leave it for later.

## Keeping AGENTS.md current
After any change to the repo, check if AGENTS.md is still accurate. Update it if you:
- Add or remove files referenced in the project structure
- Change setup commands, scripts, or server behaviour
- Introduce new code conventions (SDK versions, naming rules, formatting)
- Add new quiz domains or rename existing ones
- Change how tests validate the project (e.g., question count thresholds)

## Fetching latest content
- Before editing anything that references AWS APIs, SageMaker, or AWS ML services: fetch the current official AWS docs to verify API accuracy (AWS service names and SDK signatures change frequently).
- SageMaker Python SDK (`sagemaker`) and `boto3` are distinct — verify which is appropriate for each snippet.

## Project context and guidelines
AWS Certified Machine Learning Engineer – Associate (MLA-C01) study companion. Interactive dashboard with progress tracking, quiz engine, and AWS ML code templates.

When adding or updating quiz questions in `questions.js`, verify answers against current AWS documentation — the MLA-C01 exam tracks AWS service changes.

## Quiz domain labels
`questions.js` covers 4 domains. Use exact strings to avoid mislabeling:
- `"Domain 1: Data Preparation for ML"`
- `"Domain 2: ML Model Development"`
- `"Domain 3: Deployment and Orchestration"`
- `"Domain 4: Monitoring, Maintenance, and Security"`

## Testing guidelines
- The project includes an automated test suite in `test.js` run via `npm test`.
- **Always use Docker Compose** to spin up the server before running tests and tear it down after: `docker compose up -d && npm test && docker compose down`. Never run `node server.js` directly for testing.
- **Integrity**: `PRACTICE_QUESTIONS` in `questions.js` must be an array of exactly **45** questions. Adding or removing questions will fail the test suite.
- **Structure**: Each question must have a numeric `id`, a string `domain` matching one of the 4 exact labels, a string `question`, an array of exactly 4 `options`, a numeric `answer` index (0-3), and a string `explanation`.
- **Static Assets & Hyperlinks**: Tests verify the existence of all core files (HTML, CSS, JS, markdown, and templates) and ensure all local hyperlinks inside markdown files are valid.
- **Server Endpoints**: Tests verify endpoint status codes (200 for index, CSS, docs), 404 for missing files, traversal security, and POST `/api/progress` round-trip.
