# LearningOS — Practice Everything Locally (no subscriptions)

> **Your laptop is the platform.** Almost every technology can be learned and practiced **locally,
> offline, for free** using open-source tools — usually just `docker compose up`. No cloud account, no
> credit card, no API key, no paid tier. This catalog maps each domain to the free tools LearningOS
> teaches, plus the matching hands-on `*-lab` skills.

**Honesty note:** local emulators/editions **approximate** the real thing. They're ideal for learning
and dev/testing, but fidelity varies — always verify behavior against the official product docs before
relying on it in production. Where a tool has a paid tier (e.g., LocalStack Pro, SonarQube), the
**free/community edition** is what we use, and the skills say so.

Only need **Docker Desktop** (or Podman) + an editor to run most of this.

## Run code without installing a language

Practicing a language shouldn't require installing its whole toolchain. Run snippets in **90+ languages**
remotely or locally — the [`remote-code-runner`](../.github/skills/remote-code-runner/SKILL.md) skill (and
the VS Code extension's `@drona` **run-code tool**) use:

| Option | Endpoint | Key? | Best for |
|---|---|---|---|
| **Piston (public)** | `https://emkc.org/api/v2/piston/execute` | No key · ~5 req/s | Instant, zero-setup practice |
| **Piston (self-hosted, offline)** | `http://localhost:2000/api/v2` via Docker | No key · no limit | Heavy or air-gapped practice — fully local |
| **onlinecompiler.io** | `https://api.onlinecompiler.io/` | `X-API-Key` | Optional keyed alternative |

Install a language locally only when a real project truly needs it (native deps, step-debugging, perf).
**Full setup — self-host Piston (Docker) or get an onlinecompiler.io key:** see [CodeExecution.md](./CodeExecution.md).

## Cloud, locally

| Cloud | Free local tool(s) | Endpoint / how | LearningOS skills |
|---|---|---|---|
| **AWS** | [Floci](https://github.com/floci-io/floci) · [LocalStack](https://github.com/localstack/localstack) (community) · [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) · [MinIO](https://github.com/minio/minio) (S3) | `docker compose up`; point AWS SDK/CLI/Terraform at localhost | `floci-aws-local-lab` · `localstack-lab` · `dynamodb-local-lab` · `minio-s3-lab` |
| **Azure** | [Floci AZ](https://github.com/floci-io/floci-az) · [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite) (official Storage emulator) | localhost `:4577` / `:10000-2` | `floci-azure-local-lab` · `azurite-lab` |
| **GCP** | [floci-gcp](https://github.com/floci-io/floci-gcp) · [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite) · official [Pub/Sub emulator](https://cloud.google.com/pubsub/docs/emulator) | localhost `:4588`; `gcloud … emulators` | `floci-gcp-local-lab` · `firebase-emulator-lab` · `gcp-pubsub-emulator-lab` |

## Databases & storage, locally
PostgreSQL · MySQL · MongoDB · Redis · Cassandra (all official Docker images) · SQLite (embedded,
zero-setup) · DuckDB (embedded OLAP) · MinIO (S3-compatible object storage) · pgvector (vectors in
Postgres). → `postgres-local-lab` · `mysql-local-lab` · `mongodb-local-lab` · `redis-local-lab` ·
`cassandra-local-lab` · `sqlite-lab` · `pgvector-local-lab`.

## Messaging & streaming, locally
[Redpanda](https://github.com/redpanda-data/redpanda) (Kafka-API, single binary) · Apache Kafka
(KRaft) · [RabbitMQ](https://www.rabbitmq.com/) · [NATS](https://nats.io/) ·
[Eclipse Mosquitto](https://mosquitto.org/) (MQTT) · [Apache Pulsar](https://pulsar.apache.org/). →
`redpanda-local-lab` · `kafka-kraft-local-lab` · `rabbitmq-local-lab` · `nats-local-lab` ·
`mosquitto-mqtt-lab` · `pulsar-local-lab` (+ the `kafka-*-lab` track).

## Containers & Kubernetes, locally
[minikube](https://minikube.sigs.k8s.io/) · [kind](https://kind.sigs.k8s.io/) · [k3d](https://k3d.io/)
· [Helm](https://helm.sh/) · [Testcontainers](https://testcontainers.com/). →
`minikube-lab` · `kind-lab` · `k3d-lab` · `helm-chart-lab` · `testcontainers-lab` · `docker-compose-lab`
· the `k8s-*-lab` track.

## AI / LLMs / RAG, locally (no API key, no cost)
[Ollama](https://ollama.com/) (run open models on your laptop) · [Chroma](https://www.trychroma.com/) ·
[Qdrant](https://qdrant.tech/) · [pgvector](https://github.com/pgvector/pgvector) · Hugging Face models.
→ `ollama-local-llm-lab` · `ollama-rag-lab` · `chroma-vector-local-lab` · `qdrant-local-lab` ·
`pgvector-local-lab` · `local-llm-agent-lab`. *(Local models are smaller/weaker than frontier APIs —
great for learning the mechanics of prompting, RAG, and agents without spend.)*

## Observability, auth & dev tooling, locally
[Prometheus](https://prometheus.io/) + [Grafana](https://grafana.com/) · [Jaeger](https://www.jaegertracing.io/)
· [Loki](https://grafana.com/oss/loki/) · [Keycloak](https://www.keycloak.org/) (OIDC/OAuth2) ·
[Mailpit](https://github.com/axllent/mailpit) (email) · [WireMock](https://wiremock.org/) (API mocking)
· [act](https://github.com/nektos/act) (run GitHub Actions locally) · SonarQube Community. →
`prometheus-grafana-local-lab` · `jaeger-tracing-local-lab` · `loki-logging-local-lab` ·
`keycloak-auth-local-lab` · `mailpit-email-local-lab` · `wiremock-api-mock-lab`.

## Data & analytics, locally
Apache Spark (local mode) · [DuckDB](https://duckdb.org/) · dbt (with DuckDB/Postgres) · Jupyter ·
[Trino](https://trino.io/) · [Metabase](https://www.metabase.com/) · scikit-learn / PyTorch / pandas
(all run on your machine). → the `spark-*-lab`, `sklearn-*-lab`, `pandas`/`numpy` and `dbt-model-coach`
skills.

## Web3, locally
Hardhat / Foundry local chains and public testnets (no real funds). → `smart-contract-coach` ·
`solidity-security-coach` · `web3-integration-coach`.

## How to use this
1. Pick your goal (e.g., "learn S3 + Lambda", "learn Kafka", "build a RAG app").
2. Ask Drona / run the matching `*-lab` skill — it gives you the `docker compose` + steps.
3. Practice against the local endpoint exactly as you would the real service.
4. When a concept needs the real cloud, use a free tier deliberately — but you'll rarely need to.

See also [Sources.md](./Sources.md) §8 and the Hands-on labs in [Skills.md](./Skills.md).
