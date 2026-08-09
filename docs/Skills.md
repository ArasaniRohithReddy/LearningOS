# LearningOS — Skills

Skills are reusable, on-demand **workflows** in [`.github/skills/<name>/SKILL.md`](../.github/skills).
They appear as `/` slash commands and can be invoked by any agent. Each follows the constitution in
[`AGENTS.md`](../AGENTS.md).

## Catalog

**619 skills**, grouped by what they help the learner do. Folder name always equals the `name` field.
(Browse them as installable packs in [`marketplace/CATALOG.md`](../marketplace/CATALOG.md).)

### Learn & understand
| Skill | What it does |
|---|---|
| [`concept-explainer`](../.github/skills/concept-explainer/SKILL.md) | Explain a topic from first principles: analogy, worked example, diagram, check for understanding. |
| [`mind-map`](../.github/skills/mind-map/SKILL.md) | Generate a Mermaid mind map (central idea → branches → sub-concepts) to see structure before deep study. |
| [`note-generator`](../.github/skills/note-generator/SKILL.md) | Turn a topic/lesson/source into clean structured study notes (summary, key points, example, pitfalls, self-test). |
| [`teach-back`](../.github/skills/teach-back/SKILL.md) | Feynman technique: the learner explains it back; you find gaps and correct misconceptions. |
| [`knowledge-graph`](../.github/skills/knowledge-graph/SKILL.md) | Build/query a personal graph of concepts and how they connect (prereqs, related, part-of) as linked notes + Mermaid. |
| [`glossary-builder`](../.github/skills/glossary-builder/SKILL.md) | Build an alphabetized glossary of a domain's key terms with level-appropriate definitions and "see also" links. |
| [`worked-example`](../.github/skills/worked-example/SKILL.md) | Teach by fully working one representative problem end to end, showing the reasoning at each step, then generalize. |
| [`cheat-sheet`](../.github/skills/cheat-sheet/SKILL.md) | Produce a dense one-page reference (syntax, commands, key APIs, gotchas), grouped and cited where version-specific. |
| [`socratic-tutor`](../.github/skills/socratic-tutor/SKILL.md) | Teach purely through Socratic questioning — lead the learner to derive the idea themselves. |
| [`misconception-buster`](../.github/skills/misconception-buster/SKILL.md) | Surface and correct the common misconceptions on a topic with disconfirming examples. |
| [`analogy-generator`](../.github/skills/analogy-generator/SKILL.md) | Generate strong analogies mapped element-by-element, noting where each breaks down. |

### Plan & track
| Skill | What it does |
|---|---|
| [`learner-onboarding`](../.github/skills/learner-onboarding/SKILL.md) | **First-run front door** — welcome a new learner, interview to build their `learning-profile.md`, offer a placement diagnostic, draft the first plan, and persist it. |
| [`learner-memory`](../.github/skills/learner-memory/SKILL.md) | **Memory backbone** — persist a `learning-profile.md` across sessions (goals, level, gaps, in-flight topics, due reviews); recall "where you left off + what's next" at session start. |
| [`session-resume`](../.github/skills/session-resume/SKILL.md) | **Welcome back** — since-last-time recap, streak/momentum, what's due today, and the single best next action to restart in seconds. |
| [`learning-roadmap`](../.github/skills/learning-roadmap/SKILL.md) | Dated, sequenced 30/60/90-day study plan with phases, milestones, and checkpoints. |
| [`spaced-repetition-scheduler`](../.github/skills/spaced-repetition-scheduler/SKILL.md) | Compute review due-dates (expanding intervals / SM-2), record results, tell the learner what's due. |
| [`project-mentor`](../.github/skills/project-mentor/SKILL.md) | Scope and guide a portfolio-worthy project end to end with milestones and acceptance criteria. |
| [`progress-tracker`](../.github/skills/progress-tracker/SKILL.md) | Log completed topics, quiz scores, streaks, and due reviews into a Markdown log; summarize momentum. |
| [`progress-charts`](../.github/skills/progress-charts/SKILL.md) | Visualize progress as real charts via the bundled flint-chart MCP (streak, topics by domain, mastery, review burn-down); Mermaid fallback. |
| [`onboarding-plan`](../.github/skills/onboarding-plan/SKILL.md) | A 30/60/90-day plan to onboard onto a new team/codebase/technology, with checkpoints. |
| [`career-ladder`](../.github/skills/career-ladder/SKILL.md) | Map the competencies per career level and the concrete gaps to reach the next one. |

### Practice & assess
| Skill | What it does |
|---|---|
| [`practice-generator`](../.github/skills/practice-generator/SKILL.md) | Graded hands-on exercises, challenges, and mini-projects with hints and a reference solution. |
| [`quiz-generator`](../.github/skills/quiz-generator/SKILL.md) | Adaptive quiz with answer key and per-question rationale. |
| [`flashcards`](../.github/skills/flashcards/SKILL.md) | Spaced-repetition cards (Q/A + cloze), Anki-exportable, with a schedule. |
| [`mock-exam`](../.github/skills/mock-exam/SKILL.md) | Full timed exam simulation scored by objective domain, with a targeted study plan for the gaps. |
| [`skill-assessment`](../.github/skills/skill-assessment/SKILL.md) | Diagnostic that places the learner's level on a topic and surfaces strengths/gaps with a starting point. |
| [`gap-analysis`](../.github/skills/gap-analysis/SKILL.md) | Compare current vs target-role skills and produce a prioritized gap report with a plan to close them. |
| [`rubric-grader`](../.github/skills/rubric-grader/SKILL.md) | Grade an answer/essay/code/artifact against an explicit rubric with evidence and actionable feedback. |
| [`exam-blueprint`](../.github/skills/exam-blueprint/SKILL.md) | Turn a cert's official objective domains + weights (cited) into a study blueprint mapped to topics. |

### Code & engineering
| Skill | What it does |
|---|---|
| [`remote-code-runner`](../.github/skills/remote-code-runner/SKILL.md) | Run/test code in 90+ languages **without installing anything** — free keyless Piston (emkc.org), self-hosted local Piston (Docker), or onlinecompiler.io with a key; teach from the real output. |
| [`code-review-coach`](../.github/skills/code-review-coach/SKILL.md) | Review code as a lesson: Correctness → Security → Performance → Design → Style. |
| [`debugging-coach`](../.github/skills/debugging-coach/SKILL.md) | Coach the scientific method for bugs: reproduce → hypothesize → isolate → verify. |
| [`refactoring-coach`](../.github/skills/refactoring-coach/SKILL.md) | Refactor an existing snippet as a lesson: spot smells, apply small safe steps, explain the principle. |
| [`test-writer`](../.github/skills/test-writer/SKILL.md) | Write tests as a teaching exercise: cover happy/edge/error paths and explain what each test protects. |
| [`algorithm-visualizer`](../.github/skills/algorithm-visualizer/SKILL.md) | Explain an algorithm by tracing it step by step (step table / Mermaid), with complexity and when to use it. |
| [`complexity-analyzer`](../.github/skills/complexity-analyzer/SKILL.md) | Derive and teach Big-O time/space complexity with growth intuition (KaTeX) and comparisons. |
| [`code-walkthrough`](../.github/skills/code-walkthrough/SKILL.md) | Guided tour of an unfamiliar file/module/repo: structure, main flow, key abstractions, where to start. |
| [`system-design-drill`](../.github/skills/system-design-drill/SKILL.md) | Practice a system-design problem with a Mermaid architecture, trade-offs, and a rubric score. |
| [`pair-programmer`](../.github/skills/pair-programmer/SKILL.md) | Interactive driver/navigator pairing: work a task in small tested steps, thinking aloud. |
| [`regex-explainer`](../.github/skills/regex-explainer/SKILL.md) | Explain or build a regex step by step, with match examples and backtracking warnings. |
| [`sql-coach`](../.github/skills/sql-coach/SKILL.md) | Teach and optimize SQL: explain the query, fix correctness, then tune indexes/joins/plans. |
| [`git-coach`](../.github/skills/git-coach/SKILL.md) | Teach Git and resolve a Git situation safely, flagging destructive ops with safer alternatives. |
| [`dockerfile-coach`](../.github/skills/dockerfile-coach/SKILL.md) | Write/optimize a Dockerfile: base image, layer caching, multi-stage, size & attack surface. |
| [`code-optimizer`](../.github/skills/code-optimizer/SKILL.md) | Optimize code for performance: measure the hotspot first, apply the change, quantify the trade-off. |

### Research & news
| Skill | What it does |
|---|---|
| [`research-brief`](../.github/skills/research-brief/SKILL.md) | Cited, dated brief from official/primary sources. |
| [`daily-digest`](../.github/skills/daily-digest/SKILL.md) | Daily/weekly news digest for the learner's stack with a cited TL;DR and "what to do about it". |
| [`feed-curator`](../.github/skills/feed-curator/SKILL.md) | Recommend trustworthy sources/feeds (blogs, communities, newsletters, LinkedIn) and export an OPML. |
| [`official-docs-finder`](../.github/skills/official-docs-finder/SKILL.md) | Find the canonical official docs/API reference for a technology + version, with verified links. |
| [`engineering-blog-finder`](../.github/skills/engineering-blog-finder/SKILL.md) | Find reputable vendor/company engineering blogs and specific high-quality posts on a topic. |
| [`github-repo-finder`](../.github/skills/github-repo-finder/SKILL.md) | Find high-quality, well-maintained GitHub repos (official/reference/examples) and assess repo health. |
| [`paper-summarizer`](../.github/skills/paper-summarizer/SKILL.md) | Summarize one research paper at the learner's level (problem, idea, method, results, limits), cited. |
| [`literature-review`](../.github/skills/literature-review/SKILL.md) | Survey multiple primary sources into a structured mini literature review: themes, consensus, gaps. |

### Career & communication
| Skill | What it does |
|---|---|
| [`resume-tailor`](../.github/skills/resume-tailor/SKILL.md) | Coach JD-driven, honest resume tailoring — map real experience to requirements, rewrite as XYZ impact bullets. **No JD? tailors from the profile objective.** |
| [`resume-enhancer`](../.github/skills/resume-enhancer/SKILL.md) | Strengthen a résumé generally (ATS, quantified XYZ bullets, summary, structure) with or without a target role — or build one from the learner's profile. |
| [`star-story-builder`](../.github/skills/star-story-builder/SKILL.md) | Build behavioral-interview stories with STAR from a real experience; sharpen the measurable result. |
| [`portfolio-reviewer`](../.github/skills/portfolio-reviewer/SKILL.md) | Review a portfolio/GitHub profile as a lesson against a target role, with prioritized improvements. |
| [`slide-outline`](../.github/skills/slide-outline/SKILL.md) | Turn a topic into a technical talk outline: audience, narrative arc, per-slide points and visuals. |
| [`demo-script`](../.github/skills/demo-script/SKILL.md) | Script a live demo: the win, a step-by-step happy path, checkpoints, timing, and fallbacks. |
| [`case-study`](../.github/skills/case-study/SKILL.md) | Build/analyze a real-world case study: problem, approach and decisions with trade-offs, lessons. |
| [`cover-letter`](../.github/skills/cover-letter/SKILL.md) | Coach a tailored, honest three-paragraph cover letter from the learner's real experience. |
| [`linkedin-optimizer`](../.github/skills/linkedin-optimizer/SKILL.md) | Optimize a LinkedIn profile for a target role: headline, About, bullets, keywords. |
| [`salary-negotiation`](../.github/skills/salary-negotiation/SKILL.md) | Prep a compensation negotiation: leverage, scripts, and role-play (learner supplies real numbers). |
| [`whiteboard-explainer`](../.github/skills/whiteboard-explainer/SKILL.md) | Coach explaining a concept out loud (interview whiteboard/verbal round) and close the gaps. |
| [`coding-interview-drill`](../.github/skills/coding-interview-drill/SKILL.md) | Run one timed coding-interview problem with progressive hints, then review vs the optimal approach. |

### Architecture & design
| Skill | What it does |
|---|---|
| [`architecture-diagram`](../.github/skills/architecture-diagram/SKILL.md) | Produce a Mermaid/C4 architecture diagram of a system, then explain the choices and trade-offs. |
| [`api-design-review`](../.github/skills/api-design-review/SKILL.md) | Review a REST/GraphQL/gRPC API as a lesson: modeling, HTTP semantics, versioning, errors, auth. |
| [`data-modeling-drill`](../.github/skills/data-modeling-drill/SKILL.md) | Practice ER / dimensional modeling from requirements, with keys, indexes, and normalization trade-offs. |
| [`threat-model`](../.github/skills/threat-model/SKILL.md) | Defensive STRIDE threat model: trust boundaries, threats per element, and mitigations to harden. |
| [`tech-comparison`](../.github/skills/tech-comparison/SKILL.md) | Build a weighted decision matrix comparing technologies with cited evidence and a recommendation. |
| [`estimation-coach`](../.github/skills/estimation-coach/SKILL.md) | Teach back-of-the-envelope capacity estimation: QPS, storage, bandwidth, with sanity checks. |

### Writing & docs
| Skill | What it does |
|---|---|
| [`technical-writing-coach`](../.github/skills/technical-writing-coach/SKILL.md) | Improve a piece of technical writing as a lesson (audience, structure, plain language, Diátaxis). |
| [`readme-generator`](../.github/skills/readme-generator/SKILL.md) | Produce a high-quality project README from the learner's real project details. |
| [`adr-writer`](../.github/skills/adr-writer/SKILL.md) | Write an Architecture Decision Record (context, decision, consequences, alternatives). |
| [`runbook-writer`](../.github/skills/runbook-writer/SKILL.md) | Write an operational runbook: steps, verification, rollback, escalation, with safety notes. |
| [`documentation-planner`](../.github/skills/documentation-planner/SKILL.md) | Plan a docs set with the Diátaxis framework (tutorials/how-to/reference/explanation). |
| [`changelog-writer`](../.github/skills/changelog-writer/SKILL.md) | Turn changes/commits into Keep-a-Changelog release notes; flag breaking changes. |

### AI & data
| Skill | What it does |
|---|---|
| [`prompt-optimizer`](../.github/skills/prompt-optimizer/SKILL.md) | Improve a prompt iteratively with techniques + a quick eval; show before/after. |
| [`rag-designer`](../.github/skills/rag-designer/SKILL.md) | Design a RAG pipeline as a lesson: chunking, embeddings, retrieval, re-ranking, evaluation. |
| [`eval-designer`](../.github/skills/eval-designer/SKILL.md) | Design an ML/LLM evaluation: metrics, a representative test set, and leakage/overfit guards. |
| [`dataset-explorer`](../.github/skills/dataset-explorer/SKILL.md) | Guide EDA on a dataset: distributions, missingness, outliers, correlations, and leakage. |
| [`fine-tuning-planner`](../.github/skills/fine-tuning-planner/SKILL.md) | Decide prompting vs RAG vs fine-tuning for a task: cost/benefit, data needs, method, evaluation. |
| [`model-selection-advisor`](../.github/skills/model-selection-advisor/SKILL.md) | Choose the right ML model/approach: framing, baselines first, complexity vs data, with trade-offs. |
| [`feature-engineering-coach`](../.github/skills/feature-engineering-coach/SKILL.md) | Teach feature engineering: encodings, scaling, interactions, and leakage avoidance, tied to the metric. |
| [`ml-pipeline-designer`](../.github/skills/ml-pipeline-designer/SKILL.md) | Design an ML training→serving pipeline: splits, tracking, registry, deployment, monitoring. |
| [`agent-designer`](../.github/skills/agent-designer/SKILL.md) | Design an LLM agent: tool/function calling, memory, planning loops, MCP, guardrails, evaluation. |
| [`embeddings-explainer`](../.github/skills/embeddings-explainer/SKILL.md) | Explain and choose embeddings + vector search: similarity, dimensionality, index types (HNSW/IVF). |

### Testing & QA
| Skill | What it does |
|---|---|
| [`tdd-coach`](../.github/skills/tdd-coach/SKILL.md) | Coach test-driven development: red → green → refactor in small cycles, driving design from tests. |
| [`bdd-scenario-writer`](../.github/skills/bdd-scenario-writer/SKILL.md) | Write behavior-driven Gherkin (Given/When/Then) from examples, mapped to acceptance criteria. |
| [`test-plan-designer`](../.github/skills/test-plan-designer/SKILL.md) | Design a risk-based test plan/strategy: scope, the test pyramid, environments, data, exit criteria. |
| [`flaky-test-fixer`](../.github/skills/flaky-test-fixer/SKILL.md) | Diagnose and fix a flaky test: find the nondeterminism (timing/order/shared state), make it reliable. |
| [`mutation-testing-coach`](../.github/skills/mutation-testing-coach/SKILL.md) | Teach mutation testing to measure test-suite quality: mutants, score, killing survivors, limits. |
| [`accessibility-audit`](../.github/skills/accessibility-audit/SKILL.md) | Audit a UI against WCAG 2.2: semantics, keyboard, contrast, ARIA, focus — issues by severity + fixes. |

### Security (defensive)
| Skill | What it does |
|---|---|
| [`secure-code-review`](../.github/skills/secure-code-review/SKILL.md) | Security-focused code review walking the OWASP Top 10, with the risk, the fix, and the principle. |
| [`owasp-top10-explainer`](../.github/skills/owasp-top10-explainer/SKILL.md) | Explain the OWASP Top 10 (or one category) with a vulnerable-vs-fixed example and the mitigation. |
| [`security-hardening-checklist`](../.github/skills/security-hardening-checklist/SKILL.md) | Produce a prioritized hardening checklist mapped to CIS/NIST for a system or service. |
| [`incident-postmortem`](../.github/skills/incident-postmortem/SKILL.md) | Write a blameless incident postmortem: timeline, impact, root cause (5 whys), action items. |
| [`dependency-audit`](../.github/skills/dependency-audit/SKILL.md) | Audit dependencies for known vulns and supply-chain risk (SCA, lockfiles, SBOM, pinning) and remediate. |
| [`auth-designer`](../.github/skills/auth-designer/SKILL.md) | Design authentication & authorization: sessions/JWT/OAuth2/OIDC, RBAC/ABAC, and pitfalls. |
| [`incident-response-drill`](../.github/skills/incident-response-drill/SKILL.md) | Run a defensive blue-team IR tabletop: detection, triage, containment, comms, recovery (simulated). |

### DevOps & Cloud
| Skill | What it does |
|---|---|
| [`ci-pipeline-builder`](../.github/skills/ci-pipeline-builder/SKILL.md) | Design a CI/CD pipeline: stages (build/test/scan/deploy), caching, gates, rollback, with a config sketch. |
| [`kubernetes-manifest-coach`](../.github/skills/kubernetes-manifest-coach/SKILL.md) | Write/critique K8s manifests: Deployment/Service/ConfigMap, probes, resources, security context. |
| [`terraform-module-coach`](../.github/skills/terraform-module-coach/SKILL.md) | Structure reusable Terraform: modules, variables/outputs, state, and plan/apply discipline. |
| [`slo-designer`](../.github/skills/slo-designer/SKILL.md) | Define SLIs, SLOs, and error budgets from user expectations, and connect budgets to release policy. |
| [`observability-plan`](../.github/skills/observability-plan/SKILL.md) | Instrument a service: the three pillars (metrics/logs/traces), OpenTelemetry, signals, dashboards/alerts. |

### Data & analytics
| Skill | What it does |
|---|---|
| [`data-pipeline-designer`](../.github/skills/data-pipeline-designer/SKILL.md) | Design a batch ETL/ELT pipeline: ingestion, medallion layers, orchestration, idempotency, quality. |
| [`streaming-pipeline-designer`](../.github/skills/streaming-pipeline-designer/SKILL.md) | Design a streaming pipeline: Kafka sources, windowing, exactly-once, schema evolution, backpressure. |
| [`dbt-model-coach`](../.github/skills/dbt-model-coach/SKILL.md) | Build/structure dbt models: staging/marts layering, refs, tests, docs, materializations. |
| [`dashboard-designer`](../.github/skills/dashboard-designer/SKILL.md) | Design an effective BI dashboard: audience & decisions, the right charts, and avoiding misleading visuals. |
| [`data-quality-checker`](../.github/skills/data-quality-checker/SKILL.md) | Define data-quality checks: completeness, validity, uniqueness, freshness — tests, thresholds, alerting. |
| [`spark-job-coach`](../.github/skills/spark-job-coach/SKILL.md) | Write/optimize an Apache Spark job: partitioning/shuffles, caching, skew, and file formats. |

### Frontend & web
| Skill | What it does |
|---|---|
| [`component-designer`](../.github/skills/component-designer/SKILL.md) | Design a reusable UI component: props/API, state, composition, accessibility, testable boundaries. |
| [`css-layout-coach`](../.github/skills/css-layout-coach/SKILL.md) | Teach modern CSS layout for a design: Flexbox vs Grid, box model, responsive units, pitfalls. |
| [`web-perf-audit`](../.github/skills/web-perf-audit/SKILL.md) | Audit web performance vs Core Web Vitals (LCP/INP/CLS): find the bottleneck and prioritize fixes. |
| [`state-management-coach`](../.github/skills/state-management-coach/SKILL.md) | Choose/structure frontend state: local vs global vs server state, when to reach for a store. |
| [`responsive-design-coach`](../.github/skills/responsive-design-coach/SKILL.md) | Build responsive, mobile-first layouts: breakpoints, fluid type/spacing, images, viewport testing. |
| [`seo-optimizer`](../.github/skills/seo-optimizer/SKILL.md) | Improve technical SEO: semantic HTML, metadata, structured data, crawlability, and performance. |

### Backend & systems
| Skill | What it does |
|---|---|
| [`caching-strategy-coach`](../.github/skills/caching-strategy-coach/SKILL.md) | Design a caching strategy: what/where to cache, patterns, TTLs, invalidation — consistency trade-offs. |
| [`rate-limiter-designer`](../.github/skills/rate-limiter-designer/SKILL.md) | Design rate limiting: token bucket / sliding window, per-key limits, distributed enforcement, 429/backoff. |
| [`message-queue-coach`](../.github/skills/message-queue-coach/SKILL.md) | Design async messaging: queues vs pub/sub vs streams, delivery guarantees, idempotency, DLQs. |
| [`database-index-coach`](../.github/skills/database-index-coach/SKILL.md) | Design indexes for query patterns: B-tree/hash/composite, selectivity, covering, and write cost. |
| [`concurrency-coach`](../.github/skills/concurrency-coach/SKILL.md) | Teach concurrency & parallelism: threads vs async, shared state, races/deadlocks, safer patterns. |
| [`microservices-decomposer`](../.github/skills/microservices-decomposer/SKILL.md) | Decompose a monolith: boundaries (DDD), data ownership, sync vs async, and honest operational cost. |

### Product & process
| Skill | What it does |
|---|---|
| [`user-story-writer`](../.github/skills/user-story-writer/SKILL.md) | Write user stories + acceptance criteria: role-goal-benefit, INVEST checks, Given/When/Then, splitting. |
| [`prd-writer`](../.github/skills/prd-writer/SKILL.md) | Draft a PRD: problem, goals/non-goals, users, testable requirements, success metrics, open questions. |
| [`okr-coach`](../.github/skills/okr-coach/SKILL.md) | Set OKRs that drive outcomes: an inspiring objective + 3–5 measurable key results, honestly scoped. |
| [`retrospective-facilitator`](../.github/skills/retrospective-facilitator/SKILL.md) | Facilitate an agile retro: pick a format, gather data, find themes, produce a few owned action items. |
| [`standup-summarizer`](../.github/skills/standup-summarizer/SKILL.md) | Turn raw updates into a crisp standup/status report: yesterday/today/blockers, risks surfaced. |
| [`one-on-one-coach`](../.github/skills/one-on-one-coach/SKILL.md) | Prepare an effective 1:1 (manager or report): agenda, growth & feedback, good questions, follow-ups. |

### Cloud & platform
| Skill | What it does |
|---|---|
| [`aws-well-architected-review`](../.github/skills/aws-well-architected-review/SKILL.md) | Review an architecture against the AWS Well-Architected pillars, with prioritized findings. |
| [`azure-landing-zone-coach`](../.github/skills/azure-landing-zone-coach/SKILL.md) | Design an Azure landing zone (CAF): management groups, subscriptions, networking, identity, policy. |
| [`gcp-project-structure-coach`](../.github/skills/gcp-project-structure-coach/SKILL.md) | Structure a GCP resource hierarchy: org/folders/projects, IAM, VPC, billing. |
| [`cloud-cost-optimizer`](../.github/skills/cloud-cost-optimizer/SKILL.md) | Cut cloud spend: cost drivers, rightsizing, commitments, tiering, and waste — with a savings plan. |
| [`serverless-designer`](../.github/skills/serverless-designer/SKILL.md) | Design a serverless architecture: functions, events, cold starts, cost model, and when not to. |
| [`cloud-migration-planner`](../.github/skills/cloud-migration-planner/SKILL.md) | Plan a cloud migration with the 6 Rs: assess, prioritize, and sequence by risk. |

### Databases & storage
| Skill | What it does |
|---|---|
| [`database-selection-advisor`](../.github/skills/database-selection-advisor/SKILL.md) | Choose the right database (relational/document/KV/wide-column/graph/time-series) from access patterns. |
| [`sql-query-explainer`](../.github/skills/sql-query-explainer/SKILL.md) | Read and explain a complex SQL query step by step: CTEs, window functions, joins, subqueries. |
| [`database-migration-coach`](../.github/skills/database-migration-coach/SKILL.md) | Plan a low/zero-downtime schema/db migration: expand-contract, backfills, dual-writes, rollback. |
| [`nosql-data-modeling`](../.github/skills/nosql-data-modeling/SKILL.md) | Model data for NoSQL access-pattern-first: denormalization, single-table patterns, trade-offs. |
| [`transaction-isolation-explainer`](../.github/skills/transaction-isolation-explainer/SKILL.md) | Explain ACID and isolation levels with the anomalies each prevents (dirty/non-repeatable/phantom). |
| [`sharding-strategy-coach`](../.github/skills/sharding-strategy-coach/SKILL.md) | Design DB sharding/partitioning: shard key, hash vs range, rebalancing, hot spots, cross-shard cost. |

### Networking & OS
| Skill | What it does |
|---|---|
| [`networking-fundamentals-coach`](../.github/skills/networking-fundamentals-coach/SKILL.md) | Teach TCP/IP from first principles: layers, IP/subnets, TCP vs UDP, ports, NAT, request flow. |
| [`tls-ssl-explainer`](../.github/skills/tls-ssl-explainer/SKILL.md) | Explain TLS/HTTPS: the handshake, certificates & chains of trust, cipher suites, common errors. |
| [`load-balancing-coach`](../.github/skills/load-balancing-coach/SKILL.md) | Design load balancing: L4 vs L7, algorithms, health checks, session affinity, failover. |
| [`dns-coach`](../.github/skills/dns-coach/SKILL.md) | Teach and troubleshoot DNS: record types, resolution flow, TTL/caching, propagation issues. |
| [`linux-command-coach`](../.github/skills/linux-command-coach/SKILL.md) | Explain or build a Linux command/pipeline step by step, with safer alternatives and warnings. |
| [`shell-scripting-coach`](../.github/skills/shell-scripting-coach/SKILL.md) | Write a robust shell script: quoting, `set -euo pipefail`, error handling, idempotency, safety notes. |

### Programming paradigms
| Skill | What it does |
|---|---|
| [`functional-programming-coach`](../.github/skills/functional-programming-coach/SKILL.md) | Teach FP: pure functions, immutability, higher-order functions, composition, and (gently) monads. |
| [`oop-design-coach`](../.github/skills/oop-design-coach/SKILL.md) | Teach OO design with SOLID: responsibilities, encapsulation, composition over inheritance. |
| [`design-patterns-coach`](../.github/skills/design-patterns-coach/SKILL.md) | Apply the right GoF/enterprise pattern to a problem — and warn against overuse. |
| [`memory-management-coach`](../.github/skills/memory-management-coach/SKILL.md) | Teach memory: stack vs heap, GC vs manual vs ownership (Rust), and common leaks. |
| [`type-system-explainer`](../.github/skills/type-system-explainer/SKILL.md) | Explain a type system: static vs dynamic, generics, variance, inference, sum/product, nullability. |
| [`error-handling-coach`](../.github/skills/error-handling-coach/SKILL.md) | Teach robust error handling: exceptions vs Result, propagation, retries, fail-fast vs graceful. |

### ML in production
| Skill | What it does |
|---|---|
| [`model-monitoring-coach`](../.github/skills/model-monitoring-coach/SKILL.md) | Monitor a deployed model: data/concept drift, performance decay, alerting, and when to retrain. |
| [`ml-experiment-tracker`](../.github/skills/ml-experiment-tracker/SKILL.md) | Set up experiment tracking & reproducibility: params/metrics/artifacts, runs, model registry. |
| [`llm-guardrails-designer`](../.github/skills/llm-guardrails-designer/SKILL.md) | Design LLM safety guardrails: I/O validation, prompt-injection defense, PII, grounding, refusal. |
| [`vector-db-selector`](../.github/skills/vector-db-selector/SKILL.md) | Choose/config a vector DB/index: metrics, index types (HNSW/IVF), recall vs latency, filtering. |
| [`data-labeling-planner`](../.github/skills/data-labeling-planner/SKILL.md) | Plan a labeling/annotation process: guidelines, sampling, inter-annotator agreement, QC. |
| [`ab-test-designer`](../.github/skills/ab-test-designer/SKILL.md) | Design an A/B test: hypothesis, metric & MDE, sample size & power, and avoiding peeking/p-hacking. |

### Communication & soft skills
| Skill | What it does |
|---|---|
| [`conflict-resolution-coach`](../.github/skills/conflict-resolution-coach/SKILL.md) | Navigate a workplace conflict: understand interests, separate people from problem, agree next steps. |
| [`feedback-giver`](../.github/skills/feedback-giver/SKILL.md) | Give and receive constructive feedback using SBI (Situation-Behavior-Impact), specific and kind. |
| [`negotiation-coach`](../.github/skills/negotiation-coach/SKILL.md) | Prepare a principled negotiation: interests vs positions, BATNA, options, objective criteria. |
| [`email-writing-coach`](../.github/skills/email-writing-coach/SKILL.md) | Write a clear professional email: purpose-first, right structure, tone, concise asks. |
| [`public-speaking-coach`](../.github/skills/public-speaking-coach/SKILL.md) | Prepare and deliver a talk: structure, opening/closing, managing nerves, pacing, engagement. |
| [`time-management-coach`](../.github/skills/time-management-coach/SKILL.md) | Improve prioritization and focus: Eisenhower matrix, timeboxing/deep work, WIP limits. |

### Teaching & curriculum
| Skill | What it does |
|---|---|
| [`curriculum-designer`](../.github/skills/curriculum-designer/SKILL.md) | Design a multi-module curriculum: objectives (Bloom's), sequence, activities, assessment (backward design). |
| [`lesson-plan-writer`](../.github/skills/lesson-plan-writer/SKILL.md) | Write a single lesson plan: objective, hook, I-do/we-do/you-do, checks for understanding. |
| [`reading-list-curator`](../.github/skills/reading-list-curator/SKILL.md) | Curate a sequenced self-study reading/resource list: foundational → advanced, with quality notes. |
| [`peer-review-coach`](../.github/skills/peer-review-coach/SKILL.md) | Teach giving/receiving peer review constructively: what to look for, phrasing, nits vs blockers. |
| [`hackathon-planner`](../.github/skills/hackathon-planner/SKILL.md) | Plan a hackathon project: timebox scope, roles, an MVP cut-line, build order, and a demo plan. |
| [`exam-strategy-coach`](../.github/skills/exam-strategy-coach/SKILL.md) | Coach test-taking strategy: time management, question triage, elimination, and managing anxiety. |

### Enterprise & dev tools
| Skill | What it does |
|---|---|
| [`power-bi-dax-coach`](../.github/skills/power-bi-dax-coach/SKILL.md) | Teach and debug DAX: measures vs columns, filter/row context, CALCULATE, time intelligence. |
| [`excel-formula-coach`](../.github/skills/excel-formula-coach/SKILL.md) | Teach Excel: lookups (XLOOKUP/INDEX-MATCH), dynamic arrays, and pivot tables — with the why. |
| [`git-workflow-designer`](../.github/skills/git-workflow-designer/SKILL.md) | Design a team Git workflow (trunk-based/GitHub Flow/GitFlow) with PR/review/CI conventions. |
| [`api-testing-coach`](../.github/skills/api-testing-coach/SKILL.md) | Test an API: happy/edge/error cases, status/schema assertions, auth, contract testing, CI. |
| [`openapi-spec-writer`](../.github/skills/openapi-spec-writer/SKILL.md) | Write an OpenAPI (Swagger) spec: paths, schemas, parameters, responses, components, examples. |
| [`webhook-designer`](../.github/skills/webhook-designer/SKILL.md) | Design webhooks: event schema, delivery, retries & idempotency, and signing/verification security. |

### Advanced testing
| Skill | What it does |
|---|---|
| [`contract-testing-coach`](../.github/skills/contract-testing-coach/SKILL.md) | Teach consumer-driven contract testing (Pact) for service integration, with CI. |
| [`load-testing-coach`](../.github/skills/load-testing-coach/SKILL.md) | Design a load/performance test: realistic load, percentile metrics, ramp profiles, reading results. |
| [`test-data-builder`](../.github/skills/test-data-builder/SKILL.md) | Design maintainable test data: builders/factories, fixtures, and test isolation. |
| [`property-based-testing-coach`](../.github/skills/property-based-testing-coach/SKILL.md) | Teach property-based testing (Hypothesis/QuickCheck): properties, generators, shrinking. |
| [`e2e-testing-coach`](../.github/skills/e2e-testing-coach/SKILL.md) | Design reliable E2E UI tests (Playwright/Cypress): journeys, selectors, cutting flakiness. |
| [`code-coverage-coach`](../.github/skills/code-coverage-coach/SKILL.md) | Interpret & improve coverage meaningfully: line vs branch vs mutation, and its limits. |

### Applied security (defensive)
| Skill | What it does |
|---|---|
| [`jwt-security-coach`](../.github/skills/jwt-security-coach/SKILL.md) | Use JWTs securely: signing, validation, expiry/rotation, storage, and when sessions are better. |
| [`secrets-management-coach`](../.github/skills/secrets-management-coach/SKILL.md) | Manage secrets safely: vault vs env, rotation, least privilege, and leak detection. |
| [`csp-headers-coach`](../.github/skills/csp-headers-coach/SKILL.md) | Configure security headers (CSP/HSTS…) to reduce XSS/clickjacking, with a safe rollout. |
| [`sql-injection-defense`](../.github/skills/sql-injection-defense/SKILL.md) | Prevent injection: parameterized queries, ORMs, validation, least privilege (defensive). |
| [`api-security-coach`](../.github/skills/api-security-coach/SKILL.md) | Harden an API: authN/Z, validation, rate limiting, output encoding, OWASP API Top 10. |
| [`cryptography-basics-coach`](../.github/skills/cryptography-basics-coach/SKILL.md) | Apply crypto correctly: hashing vs encryption, password hashing, and "don't roll your own". |

### Frontend patterns
| Skill | What it does |
|---|---|
| [`accessibility-remediation-coach`](../.github/skills/accessibility-remediation-coach/SKILL.md) | Fix a11y issues by impact with the correct ARIA/semantics/focus fixes, and verify. |
| [`form-design-coach`](../.github/skills/form-design-coach/SKILL.md) | Design robust web forms: labels, accessible validation, error messaging, submission UX. |
| [`animation-coach`](../.github/skills/animation-coach/SKILL.md) | Add smooth, accessible web animations: CSS vs JS, `prefers-reduced-motion`, performance. |
| [`design-tokens-coach`](../.github/skills/design-tokens-coach/SKILL.md) | Define and use design tokens: naming, theming, scales, and wiring to CSS/components. |
| [`micro-frontend-coach`](../.github/skills/micro-frontend-coach/SKILL.md) | Decide on and design micro-frontends: composition, boundaries, shared deps, real cost. |
| [`pwa-coach`](../.github/skills/pwa-coach/SKILL.md) | Build a PWA: service workers, caching strategies, offline, installability, and pitfalls. |

### Distributed systems & APIs
| Skill | What it does |
|---|---|
| [`idempotency-coach`](../.github/skills/idempotency-coach/SKILL.md) | Design idempotent APIs/operations: idempotency keys, dedup, and safe retries. |
| [`saga-pattern-coach`](../.github/skills/saga-pattern-coach/SKILL.md) | Manage distributed transactions with sagas: choreography vs orchestration, compensations. |
| [`event-sourcing-coach`](../.github/skills/event-sourcing-coach/SKILL.md) | Teach event sourcing + CQRS: event store, projections, replay, and when it's overkill. |
| [`api-pagination-coach`](../.github/skills/api-pagination-coach/SKILL.md) | Design pagination/filtering/sorting: offset vs cursor/keyset and stable ordering. |
| [`graphql-schema-coach`](../.github/skills/graphql-schema-coach/SKILL.md) | Design a GraphQL schema: types, resolvers, the N+1 problem/dataloaders, versioning. |
| [`grpc-coach`](../.github/skills/grpc-coach/SKILL.md) | Design gRPC services with protobuf: messages, streaming, compatibility, gRPC vs REST. |

### Data engineering
| Skill | What it does |
|---|---|
| [`data-warehouse-modeling`](../.github/skills/data-warehouse-modeling/SKILL.md) | Dimensional modeling (Kimball): facts vs dimensions, grain, SCD types, star vs snowflake. |
| [`cdc-pipeline-coach`](../.github/skills/cdc-pipeline-coach/SKILL.md) | Design change-data-capture pipelines: log-based CDC (Debezium), snapshots, schema drift. |
| [`data-catalog-coach`](../.github/skills/data-catalog-coach/SKILL.md) | Set up cataloging & lineage: metadata, ownership, discovery, column-level lineage. |
| [`airflow-dag-coach`](../.github/skills/airflow-dag-coach/SKILL.md) | Design orchestration DAGs (Airflow): dependencies, idempotency, retries/backfills, sensors. |
| [`data-contract-designer`](../.github/skills/data-contract-designer/SKILL.md) | Define data contracts producer↔consumer: schema, semantics, SLAs, versioning, enforcement. |
| [`lakehouse-designer`](../.github/skills/lakehouse-designer/SKILL.md) | Design a lakehouse (Delta/Iceberg): table formats, ACID on object storage, time travel. |

### Observability & SRE
| Skill | What it does |
|---|---|
| [`alerting-strategy-coach`](../.github/skills/alerting-strategy-coach/SKILL.md) | Design good alerts: symptom-based, page vs ticket, burn-rate, and killing noise. |
| [`logging-strategy-coach`](../.github/skills/logging-strategy-coach/SKILL.md) | Design structured logging: levels, correlation IDs, what to log (and not), sampling, cost. |
| [`distributed-tracing-coach`](../.github/skills/distributed-tracing-coach/SKILL.md) | Instrument tracing (OpenTelemetry): spans, context propagation, sampling, reading a trace. |
| [`capacity-planning-coach`](../.github/skills/capacity-planning-coach/SKILL.md) | Plan capacity & scaling: model demand, headroom, load-test limits, autoscaling, cost. |
| [`postmortem-facilitator`](../.github/skills/postmortem-facilitator/SKILL.md) | Facilitate a blameless postmortem meeting: timeline, root cause (5 whys), owned actions. |
| [`oncall-runbook-coach`](../.github/skills/oncall-runbook-coach/SKILL.md) | Build on-call readiness: escalation policy, runbook index, dashboards, alert-to-action. |

### GenAI in production
| Skill | What it does |
|---|---|
| [`context-window-optimizer`](../.github/skills/context-window-optimizer/SKILL.md) | Manage the LLM context window: chunking, compression, memory, and "lost in the middle". |
| [`multi-agent-orchestration-coach`](../.github/skills/multi-agent-orchestration-coach/SKILL.md) | Orchestrate multiple agents: roles, handoffs, shared state, and loop control. |
| [`llm-cost-optimizer`](../.github/skills/llm-cost-optimizer/SKILL.md) | Cut LLM cost & latency: routing/tiering, caching, token reduction — with a quality guardrail. |
| [`structured-output-coach`](../.github/skills/structured-output-coach/SKILL.md) | Get reliable JSON/structured output: schemas, tool calling, validation & repair. |
| [`hallucination-mitigation-coach`](../.github/skills/hallucination-mitigation-coach/SKILL.md) | Reduce hallucinations: grounding/RAG, citations, self-consistency, abstention, faithfulness eval. |
| [`fine-tuning-data-curator`](../.github/skills/fine-tuning-data-curator/SKILL.md) | Curate & format fine-tuning datasets: selection, chat templates, quality/dedup, splits, leakage. |

### Product strategy
| Skill | What it does |
|---|---|
| [`competitive-analysis-coach`](../.github/skills/competitive-analysis-coach/SKILL.md) | Run a structured competitive/market analysis: criteria, gaps, positioning (real data). |
| [`pricing-strategy-coach`](../.github/skills/pricing-strategy-coach/SKILL.md) | Design pricing & packaging: value metric, tiers, models, psychology, and testing. |
| [`feature-prioritization-coach`](../.github/skills/feature-prioritization-coach/SKILL.md) | Prioritize a backlog: RICE/ICE/value-vs-effort, honest scoring, and sequencing. |
| [`metrics-definition-coach`](../.github/skills/metrics-definition-coach/SKILL.md) | Define product metrics: a North Star + supporting metrics, HEART, guardrails, no vanity. |
| [`stakeholder-management-coach`](../.github/skills/stakeholder-management-coach/SKILL.md) | Manage stakeholders: map influence/interest, tailor comms, align, and handle conflict. |
| [`business-case-writer`](../.github/skills/business-case-writer/SKILL.md) | Write a business case / ROI: problem, options, costs vs benefits, risks, recommendation. |

### Statistics & experimentation
| Skill | What it does |
|---|---|
| [`hypothesis-testing-coach`](../.github/skills/hypothesis-testing-coach/SKILL.md) | Teach hypothesis testing: null/alt, test choice, p-values done right, and Type I/II errors. |
| [`experiment-analysis-coach`](../.github/skills/experiment-analysis-coach/SKILL.md) | Analyze experiment results: effect size, significance, confidence intervals, and peeking. |
| [`confidence-interval-coach`](../.github/skills/confidence-interval-coach/SKILL.md) | Teach confidence intervals: correct interpretation, width, and CI vs p-value. |
| [`regression-diagnostics-coach`](../.github/skills/regression-diagnostics-coach/SKILL.md) | Diagnose a regression: residuals, multicollinearity, heteroscedasticity, influence. |
| [`bayesian-basics-coach`](../.github/skills/bayesian-basics-coach/SKILL.md) | Teach Bayesian thinking: priors, likelihood, posterior, and Bayesian vs frequentist. |
| [`sampling-methods-coach`](../.github/skills/sampling-methods-coach/SKILL.md) | Teach sampling: random/stratified/cluster, bias, sample size, representativeness. |

### Mobile
| Skill | What it does |
|---|---|
| [`ios-lifecycle-coach`](../.github/skills/ios-lifecycle-coach/SKILL.md) | Teach the iOS app/view lifecycle: states, SwiftUI updates, and scene phases. |
| [`android-lifecycle-coach`](../.github/skills/android-lifecycle-coach/SKILL.md) | Teach the Android activity/fragment & Compose lifecycle, config changes, ViewModel. |
| [`mobile-state-management-coach`](../.github/skills/mobile-state-management-coach/SKILL.md) | Manage mobile state: unidirectional flow, persistence, and process death. |
| [`mobile-offline-sync-coach`](../.github/skills/mobile-offline-sync-coach/SKILL.md) | Design offline-first mobile: local store, sync, conflict resolution, queueing. |
| [`mobile-push-notifications-coach`](../.github/skills/mobile-push-notifications-coach/SKILL.md) | Implement push (APNs/FCM): tokens, permissions, and payloads. |
| [`mobile-release-coach`](../.github/skills/mobile-release-coach/SKILL.md) | Ship a mobile app: signing, store review, phased rollout, and versioning. |

### Game development
| Skill | What it does |
|---|---|
| [`game-loop-coach`](../.github/skills/game-loop-coach/SKILL.md) | Teach the game loop: update vs render, fixed timestep, delta time, determinism. |
| [`game-physics-coach`](../.github/skills/game-physics-coach/SKILL.md) | Teach game physics: integration, collision detection & response, and stability. |
| [`game-ai-coach`](../.github/skills/game-ai-coach/SKILL.md) | Teach game AI: state machines, behavior trees, pathfinding (A*), and steering. |
| [`game-networking-coach`](../.github/skills/game-networking-coach/SKILL.md) | Teach multiplayer: client-server, prediction/reconciliation, lag compensation. |
| [`shader-coach`](../.github/skills/shader-coach/SKILL.md) | Teach shaders: the GPU pipeline, vertex/fragment shaders, and a simple effect. |
| [`game-optimization-coach`](../.github/skills/game-optimization-coach/SKILL.md) | Optimize a game: profiling, draw calls/batching, pooling, and frame budget. |

### Engineering management
| Skill | What it does |
|---|---|
| [`hiring-process-coach`](../.github/skills/hiring-process-coach/SKILL.md) | Design fair hiring: scorecards, structured interviews, rubrics, reducing bias. |
| [`performance-review-coach`](../.github/skills/performance-review-coach/SKILL.md) | Run a fair review: evidence, calibration, growth areas, avoiding recency bias. |
| [`delegation-coach`](../.github/skills/delegation-coach/SKILL.md) | Delegate effectively: outcomes vs tasks, situational leadership, and follow-up. |
| [`team-health-coach`](../.github/skills/team-health-coach/SKILL.md) | Assess & improve team health: psychological safety, retros, trouble signals. |
| [`tech-debt-coach`](../.github/skills/tech-debt-coach/SKILL.md) | Manage technical debt: make it visible, quantify impact, negotiate paydown. |
| [`engineering-culture-coach`](../.github/skills/engineering-culture-coach/SKILL.md) | Build culture: values, norms, incentives, and blameless practices. |

### Web3 & blockchain
| Skill | What it does |
|---|---|
| [`smart-contract-coach`](../.github/skills/smart-contract-coach/SKILL.md) | Teach smart contracts (Solidity/EVM): structure, state, events, and local testing. |
| [`solidity-security-coach`](../.github/skills/solidity-security-coach/SKILL.md) | Defensive: reentrancy, overflow, access control — and checks-effects-interactions. |
| [`gas-optimization-coach`](../.github/skills/gas-optimization-coach/SKILL.md) | Reduce gas: storage vs memory, packing, loops — without sacrificing safety. |
| [`defi-primitives-coach`](../.github/skills/defi-primitives-coach/SKILL.md) | Explain DeFi primitives: AMMs, lending, oracles, and their risks. |
| [`nft-standards-coach`](../.github/skills/nft-standards-coach/SKILL.md) | Teach NFT standards (ERC-721/1155): minting, metadata, marketplaces. |
| [`web3-integration-coach`](../.github/skills/web3-integration-coach/SKILL.md) | Integrate a dApp: wallets, providers (ethers/viem), transactions, chain reads. |

### Hands-on labs
Guided, hands-on practice labs (concept → step-by-step exercise → reference solution → pitfalls),
grouped by track (294 labs):

- **Python** — [`python-decorators-lab`](../.github/skills/python-decorators-lab/SKILL.md) · [`python-generators-lab`](../.github/skills/python-generators-lab/SKILL.md) · [`python-asyncio-lab`](../.github/skills/python-asyncio-lab/SKILL.md) · [`python-typing-lab`](../.github/skills/python-typing-lab/SKILL.md) · [`python-dataclasses-lab`](../.github/skills/python-dataclasses-lab/SKILL.md) · [`python-context-managers-lab`](../.github/skills/python-context-managers-lab/SKILL.md)
- **JavaScript** — [`js-closures-lab`](../.github/skills/js-closures-lab/SKILL.md) · [`js-promises-lab`](../.github/skills/js-promises-lab/SKILL.md) · [`js-event-loop-lab`](../.github/skills/js-event-loop-lab/SKILL.md) · [`js-prototypes-lab`](../.github/skills/js-prototypes-lab/SKILL.md) · [`js-modules-lab`](../.github/skills/js-modules-lab/SKILL.md) · [`js-generators-lab`](../.github/skills/js-generators-lab/SKILL.md)
- **TypeScript** — [`ts-generics-lab`](../.github/skills/ts-generics-lab/SKILL.md) · [`ts-utility-types-lab`](../.github/skills/ts-utility-types-lab/SKILL.md) · [`ts-narrowing-lab`](../.github/skills/ts-narrowing-lab/SKILL.md) · [`ts-decorators-lab`](../.github/skills/ts-decorators-lab/SKILL.md) · [`ts-mapped-types-lab`](../.github/skills/ts-mapped-types-lab/SKILL.md) · [`ts-declaration-files-lab`](../.github/skills/ts-declaration-files-lab/SKILL.md)
- **React** — [`react-hooks-lab`](../.github/skills/react-hooks-lab/SKILL.md) · [`react-context-lab`](../.github/skills/react-context-lab/SKILL.md) · [`react-performance-lab`](../.github/skills/react-performance-lab/SKILL.md) · [`react-suspense-lab`](../.github/skills/react-suspense-lab/SKILL.md) · [`react-forms-lab`](../.github/skills/react-forms-lab/SKILL.md) · [`react-server-components-lab`](../.github/skills/react-server-components-lab/SKILL.md)
- **AWS** — [`aws-lambda-lab`](../.github/skills/aws-lambda-lab/SKILL.md) · [`aws-s3-lab`](../.github/skills/aws-s3-lab/SKILL.md) · [`aws-dynamodb-lab`](../.github/skills/aws-dynamodb-lab/SKILL.md) · [`aws-iam-lab`](../.github/skills/aws-iam-lab/SKILL.md) · [`aws-vpc-lab`](../.github/skills/aws-vpc-lab/SKILL.md) · [`aws-ecs-lab`](../.github/skills/aws-ecs-lab/SKILL.md)
- **Data (pandas/NumPy)** — [`pandas-lab`](../.github/skills/pandas-lab/SKILL.md) · [`numpy-lab`](../.github/skills/numpy-lab/SKILL.md) · [`data-cleaning-lab`](../.github/skills/data-cleaning-lab/SKILL.md) · [`data-wrangling-lab`](../.github/skills/data-wrangling-lab/SKILL.md) · [`groupby-aggregation-lab`](../.github/skills/groupby-aggregation-lab/SKILL.md) · [`timeseries-analysis-lab`](../.github/skills/timeseries-analysis-lab/SKILL.md)
- **Docker & Kubernetes** — [`docker-compose-lab`](../.github/skills/docker-compose-lab/SKILL.md) · [`k8s-deployment-lab`](../.github/skills/k8s-deployment-lab/SKILL.md) · [`k8s-service-networking-lab`](../.github/skills/k8s-service-networking-lab/SKILL.md) · [`helm-chart-lab`](../.github/skills/helm-chart-lab/SKILL.md) · [`k8s-configmap-secret-lab`](../.github/skills/k8s-configmap-secret-lab/SKILL.md) · [`k8s-autoscaling-lab`](../.github/skills/k8s-autoscaling-lab/SKILL.md)
- **Go** — [`go-goroutines-lab`](../.github/skills/go-goroutines-lab/SKILL.md) · [`go-channels-lab`](../.github/skills/go-channels-lab/SKILL.md) · [`go-interfaces-lab`](../.github/skills/go-interfaces-lab/SKILL.md) · [`go-error-handling-lab`](../.github/skills/go-error-handling-lab/SKILL.md) · [`go-generics-lab`](../.github/skills/go-generics-lab/SKILL.md) · [`go-modules-lab`](../.github/skills/go-modules-lab/SKILL.md)
- **Rust** — [`rust-ownership-lab`](../.github/skills/rust-ownership-lab/SKILL.md) · [`rust-borrowing-lab`](../.github/skills/rust-borrowing-lab/SKILL.md) · [`rust-traits-lab`](../.github/skills/rust-traits-lab/SKILL.md) · [`rust-error-handling-lab`](../.github/skills/rust-error-handling-lab/SKILL.md) · [`rust-lifetimes-lab`](../.github/skills/rust-lifetimes-lab/SKILL.md) · [`rust-async-lab`](../.github/skills/rust-async-lab/SKILL.md)
- **Java** — [`java-streams-lab`](../.github/skills/java-streams-lab/SKILL.md) · [`java-collections-lab`](../.github/skills/java-collections-lab/SKILL.md) · [`java-concurrency-lab`](../.github/skills/java-concurrency-lab/SKILL.md) · [`java-generics-lab`](../.github/skills/java-generics-lab/SKILL.md) · [`java-optional-lab`](../.github/skills/java-optional-lab/SKILL.md) · [`java-records-lab`](../.github/skills/java-records-lab/SKILL.md)
- **C#** — [`csharp-linq-lab`](../.github/skills/csharp-linq-lab/SKILL.md) · [`csharp-async-await-lab`](../.github/skills/csharp-async-await-lab/SKILL.md) · [`csharp-generics-lab`](../.github/skills/csharp-generics-lab/SKILL.md) · [`csharp-delegates-events-lab`](../.github/skills/csharp-delegates-events-lab/SKILL.md) · [`csharp-records-lab`](../.github/skills/csharp-records-lab/SKILL.md) · [`csharp-nullable-lab`](../.github/skills/csharp-nullable-lab/SKILL.md)
- **SQL** — [`sql-joins-lab`](../.github/skills/sql-joins-lab/SKILL.md) · [`sql-window-functions-lab`](../.github/skills/sql-window-functions-lab/SKILL.md) · [`sql-cte-lab`](../.github/skills/sql-cte-lab/SKILL.md) · [`sql-aggregation-lab`](../.github/skills/sql-aggregation-lab/SKILL.md) · [`sql-subqueries-lab`](../.github/skills/sql-subqueries-lab/SKILL.md) · [`sql-indexing-lab`](../.github/skills/sql-indexing-lab/SKILL.md)
- **Bash / shell** — [`bash-scripting-lab`](../.github/skills/bash-scripting-lab/SKILL.md) · [`bash-text-processing-lab`](../.github/skills/bash-text-processing-lab/SKILL.md) · [`bash-pipes-lab`](../.github/skills/bash-pipes-lab/SKILL.md) · [`bash-find-grep-lab`](../.github/skills/bash-find-grep-lab/SKILL.md) · [`bash-cron-lab`](../.github/skills/bash-cron-lab/SKILL.md) · [`bash-functions-lab`](../.github/skills/bash-functions-lab/SKILL.md)
- **Azure** — [`azure-functions-lab`](../.github/skills/azure-functions-lab/SKILL.md) · [`azure-storage-lab`](../.github/skills/azure-storage-lab/SKILL.md) · [`azure-cosmosdb-lab`](../.github/skills/azure-cosmosdb-lab/SKILL.md) · [`azure-aks-lab`](../.github/skills/azure-aks-lab/SKILL.md) · [`azure-keyvault-lab`](../.github/skills/azure-keyvault-lab/SKILL.md) · [`azure-servicebus-lab`](../.github/skills/azure-servicebus-lab/SKILL.md)
- **GCP** — [`gcp-cloud-functions-lab`](../.github/skills/gcp-cloud-functions-lab/SKILL.md) · [`gcp-cloud-storage-lab`](../.github/skills/gcp-cloud-storage-lab/SKILL.md) · [`gcp-bigquery-lab`](../.github/skills/gcp-bigquery-lab/SKILL.md) · [`gcp-pubsub-lab`](../.github/skills/gcp-pubsub-lab/SKILL.md) · [`gcp-iam-lab`](../.github/skills/gcp-iam-lab/SKILL.md) · [`gcp-gke-lab`](../.github/skills/gcp-gke-lab/SKILL.md)
- **PyTorch** — [`pytorch-tensors-lab`](../.github/skills/pytorch-tensors-lab/SKILL.md) · [`pytorch-autograd-lab`](../.github/skills/pytorch-autograd-lab/SKILL.md) · [`pytorch-nn-module-lab`](../.github/skills/pytorch-nn-module-lab/SKILL.md) · [`pytorch-training-loop-lab`](../.github/skills/pytorch-training-loop-lab/SKILL.md) · [`pytorch-dataloader-lab`](../.github/skills/pytorch-dataloader-lab/SKILL.md) · [`pytorch-transfer-learning-lab`](../.github/skills/pytorch-transfer-learning-lab/SKILL.md)
- **Git (advanced)** — [`git-rebase-lab`](../.github/skills/git-rebase-lab/SKILL.md) · [`git-bisect-lab`](../.github/skills/git-bisect-lab/SKILL.md) · [`git-hooks-lab`](../.github/skills/git-hooks-lab/SKILL.md) · [`git-reflog-lab`](../.github/skills/git-reflog-lab/SKILL.md) · [`git-cherry-pick-lab`](../.github/skills/git-cherry-pick-lab/SKILL.md) · [`git-submodules-lab`](../.github/skills/git-submodules-lab/SKILL.md)
- **Kafka** — [`kafka-producer-lab`](../.github/skills/kafka-producer-lab/SKILL.md) · [`kafka-consumer-lab`](../.github/skills/kafka-consumer-lab/SKILL.md) · [`kafka-topics-partitions-lab`](../.github/skills/kafka-topics-partitions-lab/SKILL.md) · [`kafka-consumer-groups-lab`](../.github/skills/kafka-consumer-groups-lab/SKILL.md) · [`kafka-streams-lab`](../.github/skills/kafka-streams-lab/SKILL.md) · [`kafka-connect-lab`](../.github/skills/kafka-connect-lab/SKILL.md)
- **Spark (PySpark)** — [`spark-rdd-lab`](../.github/skills/spark-rdd-lab/SKILL.md) · [`spark-dataframe-lab`](../.github/skills/spark-dataframe-lab/SKILL.md) · [`spark-sql-lab`](../.github/skills/spark-sql-lab/SKILL.md) · [`spark-transformations-lab`](../.github/skills/spark-transformations-lab/SKILL.md) · [`spark-partitioning-lab`](../.github/skills/spark-partitioning-lab/SKILL.md) · [`spark-streaming-lab`](../.github/skills/spark-streaming-lab/SKILL.md)
- **Local cloud — no subscription (Floci emulators)** — [`floci-aws-local-lab`](../.github/skills/floci-aws-local-lab/SKILL.md) · [`floci-azure-local-lab`](../.github/skills/floci-azure-local-lab/SKILL.md) · [`floci-gcp-local-lab`](../.github/skills/floci-gcp-local-lab/SKILL.md) — run the AWS/Azure/GCP labs **offline** against the free, open-source [Floci](https://github.com/floci-io/floci) emulators (`docker compose up`; localhost `:4566`/`:4577`/`:4588`; no cloud account). See [Sources.md](./Sources.md) §8.
- **Backend frameworks** — `django-lab` · `flask-lab` · `fastapi-lab` · `express-lab` · `spring-boot-lab` · `dotnet-webapi-lab`
- **Frontend frameworks** — `nextjs-app-lab` · `vue-basics-lab` · `angular-basics-lab` · `svelte-basics-lab` · `tailwind-lab` · `vite-lab`
- **AWS services (more)** — `aws-sqs-lab` · `aws-sns-lab` · `aws-apigateway-lab` · `aws-cloudwatch-lab` · `aws-stepfunctions-lab` · `aws-rds-lab`
- **Python (more)** — `python-testing-lab` · `python-packaging-lab` · `python-logging-lab` · `python-multiprocessing-lab` · `python-cli-lab` · `python-venv-lab`
- **scikit-learn** — `sklearn-classification-lab` · `sklearn-regression-lab` · `sklearn-clustering-lab` · `sklearn-pipelines-lab` · `sklearn-model-selection-lab` · `sklearn-preprocessing-lab`
- **Linux** — `linux-permissions-lab` · `linux-systemd-lab` · `linux-processes-lab` · `linux-networking-lab` · `linux-storage-lab` · `linux-users-lab`
- **Terraform** — `terraform-basics-lab` · `terraform-state-lab` · `terraform-modules-lab` · `terraform-workspaces-lab` · `terraform-provisioners-lab` · `terraform-import-lab`

**Practice locally — no subscription (free/OSS tools; see [LocalPractice.md](./LocalPractice.md)):**
- **Local cloud emulators** — `localstack-lab` · `azurite-lab` · `minio-s3-lab` · `dynamodb-local-lab` · `firebase-emulator-lab` · `gcp-pubsub-emulator-lab`
- **Local databases** — `postgres-local-lab` · `mysql-local-lab` · `mongodb-local-lab` · `redis-local-lab` · `cassandra-local-lab` · `sqlite-lab`
- **Local messaging/streaming** — `redpanda-local-lab` · `rabbitmq-local-lab` · `nats-local-lab` · `mosquitto-mqtt-lab` · `kafka-kraft-local-lab` · `pulsar-local-lab`
- **Local Kubernetes & containers** — `minikube-lab` · `kind-lab` · `k3d-lab` · `testcontainers-lab` · `docker-networking-lab` · `docker-volumes-lab`
- **Local AI / LLM / RAG (no API key)** — `ollama-local-llm-lab` · `ollama-rag-lab` · `chroma-vector-local-lab` · `qdrant-local-lab` · `pgvector-local-lab` · `local-llm-agent-lab`
- **Local observability & dev tools** — `prometheus-grafana-local-lab` · `jaeger-tracing-local-lab` · `loki-logging-local-lab` · `keycloak-auth-local-lab` · `mailpit-email-local-lab` · `wiremock-api-mock-lab`
- **Local data & analytics** — `duckdb-lab` · `jupyter-notebook-lab` · `dbt-duckdb-lab` · `trino-local-lab` · `metabase-local-lab` · `great-expectations-lab`
- **Local CI/CD & Git** — `act-github-actions-lab` · `gitea-local-lab` · `docker-registry-local-lab` · `sonarqube-local-lab` · `pre-commit-lab` · `drone-ci-local-lab`
- **Local web servers & proxies** — `nginx-local-lab` · `caddy-local-lab` · `traefik-local-lab` · `haproxy-local-lab` · `envoy-local-lab` · `swagger-ui-local-lab`
- **Local workflow & orchestration** — `airflow-local-lab` · `temporal-local-lab` · `n8n-local-lab` · `dagster-local-lab` · `prefect-local-lab` · `cron-scheduler-lab`
- **Local search engines** — `elasticsearch-local-lab` · `opensearch-local-lab` · `meilisearch-local-lab` · `typesense-local-lab` · `solr-local-lab` · `weaviate-local-lab`
- **Local data viz & apps** — `matplotlib-lab` · `seaborn-lab` · `plotly-lab` · `statsmodels-lab` · `streamlit-local-lab` · `gradio-local-lab`
- **Local security tools (defensive)** — `trivy-scan-lab` · `semgrep-lab` · `owasp-zap-baseline-lab` · `vault-local-lab` · `opa-policy-lab` · `cosign-signing-lab`
- **Local API & load testing** — `newman-api-test-lab` · `k6-load-test-lab` · `locust-load-test-lab` · `playwright-test-lab` · `cypress-test-lab` · `pact-contract-lab`
- **Local GCP emulators (more)** — `gcp-firestore-emulator-lab` · `gcp-datastore-emulator-lab` · `gcp-bigtable-emulator-lab` · `gcp-spanner-emulator-lab` · `gcp-storage-emulator-lab` · `gcp-tasks-emulator-lab`
- **Local observability (more)** — `opentelemetry-collector-lab` · `tempo-tracing-local-lab` · `victoriametrics-local-lab` · `alertmanager-lab` · `cadvisor-lab` · `node-exporter-lab`

### Build & extend
| Skill | What it does |
|---|---|
| [`role-composer`](../.github/skills/role-composer/SKILL.md) | Turn a `*.role.yml` into a correctly-formatted role-agent and wire it into Drona. |

## When to use a skill vs. an agent vs. a role

| You need… | Use |
|---|---|
| A repeatable **workflow** with the same tools throughout | **Skill** |
| A distinct **persona** with different tools or context isolation | **Agent** ([Agents.md](./Agents.md)) |
| A **domain expert** defined by data (skills, docs, certs, news) | **Role** ([Roles.md](./Roles.md)) |

## Authoring a new skill

1. Create `.github/skills/<name>/SKILL.md` (folder name **must** equal the `name` field).
2. Frontmatter:
   ```yaml
   ---
   name: <name>                 # lowercase, hyphens, matches folder
   description: 'What + when to use. Include trigger phrases — this is the discovery surface.'
   argument-hint: 'Optional hint shown at the / prompt'
   ---
   ```
3. Body: **When to use** → **Procedure** (numbered) → **Output shape** → **Tips**, and reference the
   Learning Footer from `AGENTS.md`.
4. Keep `SKILL.md` under ~500 lines; put large assets in `scripts/`, `references/`, `assets/` and link
   them with relative paths (`./scripts/x.js`).

### Progressive loading (why skills are cheap)

1. **Discovery** (~100 tokens): the agent reads only `name` + `description`.
2. **Instructions**: the `SKILL.md` body loads only when the skill is chosen.
3. **Resources**: referenced files load only when actually used.

So a large skill library costs almost nothing until a skill is invoked — this is how LearningOS can
grow to hundreds of skills without bloating context.

## Adding more skills

The library is designed to grow to hundreds of skills without bloating context (progressive loading,
above). To contribute one, follow the authoring steps and the house style in
[Standards.md](./Standards.md), then add it to the catalog table above. Good candidate areas for new
skills: assessment (rubric-grader, gap-analyzer), delivery (slide-outline, demo-script), and
stack-specific labs. See [Roadmap.md](./Roadmap.md).
