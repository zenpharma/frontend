## zen-pharma-frontend

React 18 frontend for the Zen Pharma platform. Served via Nginx inside a Docker container and deployed to AWS EKS via GitOps (ArgoCD).

> **Companion repos:**
> - [`zen-infra`](https://github.com/your-github-username/zen-infra) — Terraform for AWS infrastructure (EKS, RDS, ECR, IAM)
> - [`zen-pharma-backend`](https://github.com/your-github-username/zen-pharma-backend) — Spring Boot microservices
> - [`zen-gitops`](https://github.com/your-github-username/zen-gitops) — ArgoCD apps + Helm values

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Create React App / npm |
| Web server | Nginx (serves static build) |
| Container | Docker (multi-stage: node:20-alpine build → nginx:alpine) |
| Code quality | ESLint + Prettier |
| Testing | Jest + React Testing Library |
| Static analysis | CodeQL + Semgrep |
| SCA | `npm audit` |
| Image scan | Trivy |
| Image signing | Cosign (keyless) |

---

## Repository Structure

```
zen-pharma-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Route-level page components
│   ├── services/            # API client (axios)
│   └── App.jsx
├── nginx.conf               # Nginx configuration for the container
├── Dockerfile               # Multi-stage: npm build → nginx serve
├── sonar-project.properties # SonarCloud configuration
└── .github/
    └── workflows/
        ├── ci.yml                       # Full CI + DEV deploy + QA PR
        └── _reusable-update-gitops.yml  # Reusable: update zen-gitops image tag
```

---

## Local Development

### Prerequisites
- Node.js 20+
- npm 9+

### Install and run

```bash
npm install
npm start          # http://localhost:3000
```

### Run tests

```bash
npm test                          # interactive watch mode
npm test -- --watchAll=false      # single run (used in CI)
npm test -- --coverage            # with coverage report
```

### Lint

```bash
npm run lint
```

### Production build

```bash
npm run build      # outputs to build/
```

---

## Docker

### Build locally

```bash
docker build -t pharma-ui:local .
docker run -p 80:80 pharma-ui:local
# http://localhost:80
```

### Environment variables (runtime via ConfigMap)

| Variable | Description | Example |
|---|---|---|
| `API_BASE_URL` | Backend API base path | `/api` |
| `AUTH_BASE_URL` | Auth service base path | `/api/auth` |
| `ENV` | Environment name | `dev`, `qa`, `prod` |

These are injected via the `configmap:` section in `zen-gitops/envs/<env>/values-pharma-ui.yaml` and mounted as a ConfigMap in Kubernetes.

---

## CI Pipeline

The `ci.yml` workflow triggers on push to `develop` or `main`:

```
1. Lint (ESLint)
2. Test (Jest + coverage)
3. CodeQL SAST
4. Semgrep SAST (p/javascript, p/owasp-top-ten)
5. npm audit (fail on HIGH/CRITICAL)
6. Docker build (multi-stage, non-root UID 1000)
7. Trivy image scan (HIGH/CRITICAL)
8. ECR push → tag: sha-<7chars>
9. Cosign keyless sign (GitHub OIDC → Fulcio → Rekor)
10. Update envs/dev/values-pharma-ui.yaml in zen-gitops → ArgoCD auto-syncs dev
11. Open QA promotion PR in zen-gitops
```

**Authentication to AWS:** GitHub OIDC — no `AWS_ACCESS_KEY_ID` stored as a secret.

See [`zen-infra/docs/CICD-IMPLEMENTATION.md`](https://github.com/your-github-username/zen-infra/blob/main/docs/CICD-IMPLEMENTATION.md) for full architecture details.

---

## Required GitHub Secrets

Set in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `AWS_ACCOUNT_ID` | 12-digit AWS account ID |
| `GITOPS_TOKEN` | GitHub PAT with `contents: write` on `your-github-username/zen-gitops` |
| `SEMGREP_APP_TOKEN` | Semgrep Cloud token (optional) |

| Variable | Value |
|---|---|
| `GITOPS_REPO` | `your-github-username/zen-gitops` |

---

## Deployment

The frontend is deployed as `pharma-ui` via the shared Helm chart in `zen-gitops/helm-charts/`. Nginx configuration and writable volume mounts (required by `readOnlyRootFilesystem: true`) are managed via the Helm values file.

Ingress routes `/` to the `pharma-ui` service. All `/api/*` requests are routed by Nginx to the backend api-gateway.

See [`zen-infra/docs/FULL-DEPLOYMENT-GUIDE.md`](https://github.com/your-github-username/zen-infra/blob/main/docs/FULL-DEPLOYMENT-GUIDE.md) for the complete 4-stage deployment guide.
