# LearningOS — Roles (config-driven agents)

The **most important idea** in LearningOS: instead of hand-writing hundreds of agent prompts, you
describe a role in a small YAML file and let [`role-composer`](../.github/skills/role-composer/SKILL.md)
generate a correctly-formatted agent. This is how the framework covers *every* technical career.

> *"Users could build thousands of GitHub Copilot Agents simply by defining configuration files
> instead of writing new prompts every time."* — the design goal this system implements.

## The `.role.yml` schema

Copy [`_TEMPLATE.role.yml`](../.github/roles/_TEMPLATE.role.yml) and fill it in. Only `name` and
`skills` are required.

| Field | Meaning |
|---|---|
| `name` | Display name (Title Case) → also the file slug. **Required.** |
| `summary` | One-line "who this is / who it helps". Feeds the agent `description`. |
| `personality` | Teaching tone: `mentor` \| `coach` \| `professor` \| `interviewer` \| `pragmatic-senior`. |
| `level_default` | The learner level this role usually addresses. |
| `focus` | 3–6 concrete strengths. |
| `skills` | The technologies/skills this role covers. **Required.** Drives "What you do" + keywords. |
| `docs` | Official docs to prefer/cite. |
| `sources` | Extra trusted sources (blogs, standards, papers, repos). |
| `news` | Topics to watch (routed to the Research & News Analyst). |
| `certifications` | Relevant certs (routed to the Exam & Certification Coach). |
| `tools` | Copilot tool aliases (default `[read, search, web, edit]`; add `execute` for build/run roles). |
| `mcp` | Recommended MCP servers to enable (advisory). |

## How composition works

Run `/role-composer .github/roles/<role>.role.yml`. The skill:

1. Reads and validates the config.
2. Maps fields → agent frontmatter (`description`, `name`, `tools`, `argument-hint`).
3. Maps fields → agent body (What you do · Knowledge sources · How you teach · Stay current ·
   Certifications · Related skills), keeping the house style.
4. Writes `.github/agents/<slug>.agent.md`.
5. Wires the new name into Drona's `agents:` allow-list and routing map.

No engine changes, ever — every role shares the same constitution and skills.

## Provided roles

A catalog of **122 role-agents** spanning **every domain** in the vision. Each has a `.role.yml`
config and a generated `.agent.md`; regenerate or tweak any with `/role-composer`. (Browse them as
installable packs in [`marketplace/CATALOG.md`](../marketplace/CATALOG.md).)

**Software Engineering** — [`frontend-engineer`](../.github/roles/frontend-engineer.role.yml) ·
[`backend-engineer`](../.github/roles/backend-engineer.role.yml) ·
[`full-stack-engineer`](../.github/roles/full-stack-engineer.role.yml) ·
[`mobile-engineer`](../.github/roles/mobile-engineer.role.yml) ·
[`game-developer`](../.github/roles/game-developer.role.yml) ·
[`embedded-iot-engineer`](../.github/roles/embedded-iot-engineer.role.yml)

**Programming Languages** — [`python-developer`](../.github/roles/python-developer.role.yml) ·
[`java-developer`](../.github/roles/java-developer.role.yml) ·
[`csharp-dotnet-developer`](../.github/roles/csharp-dotnet-developer.role.yml) ·
[`golang-developer`](../.github/roles/golang-developer.role.yml) ·
[`rust-developer`](../.github/roles/rust-developer.role.yml) ·
[`cpp-developer`](../.github/roles/cpp-developer.role.yml) ·
[`typescript-developer`](../.github/roles/typescript-developer.role.yml) ·
[`kotlin-developer`](../.github/roles/kotlin-developer.role.yml) ·
[`scala-developer`](../.github/roles/scala-developer.role.yml) ·
[`php-developer`](../.github/roles/php-developer.role.yml) ·
[`swift-developer`](../.github/roles/swift-developer.role.yml) ·
[`elixir-developer`](../.github/roles/elixir-developer.role.yml) ·
[`r-developer`](../.github/roles/r-developer.role.yml) ·
[`dart-developer`](../.github/roles/dart-developer.role.yml) ·
[`haskell-developer`](../.github/roles/haskell-developer.role.yml) ·
[`clojure-developer`](../.github/roles/clojure-developer.role.yml)

**Web & Frameworks** — [`react-developer`](../.github/roles/react-developer.role.yml) ·
[`angular-developer`](../.github/roles/angular-developer.role.yml) ·
[`vuejs-developer`](../.github/roles/vuejs-developer.role.yml) ·
[`nextjs-developer`](../.github/roles/nextjs-developer.role.yml) ·
[`nodejs-developer`](../.github/roles/nodejs-developer.role.yml) ·
[`ruby-rails-developer`](../.github/roles/ruby-rails-developer.role.yml) ·
[`wordpress-developer`](../.github/roles/wordpress-developer.role.yml) ·
[`api-designer`](../.github/roles/api-designer.role.yml) ·
[`localization-engineer`](../.github/roles/localization-engineer.role.yml)

**Emerging & Specialized Tech** — [`ar-vr-engineer`](../.github/roles/ar-vr-engineer.role.yml) ·
[`quantum-computing-engineer`](../.github/roles/quantum-computing-engineer.role.yml) ·
[`edge-computing-engineer`](../.github/roles/edge-computing-engineer.role.yml) ·
[`computer-graphics-engineer`](../.github/roles/computer-graphics-engineer.role.yml) ·
[`bioinformatics-engineer`](../.github/roles/bioinformatics-engineer.role.yml) ·
[`quantitative-developer`](../.github/roles/quantitative-developer.role.yml) ·
[`gis-developer`](../.github/roles/gis-developer.role.yml) ·
[`hpc-engineer`](../.github/roles/hpc-engineer.role.yml)

**AI / ML** — [`ai-engineer`](../.github/roles/ai-engineer.role.yml) ·
[`ml-engineer`](../.github/roles/ml-engineer.role.yml) ·
[`azure-ai-engineer`](../.github/roles/azure-ai-engineer.role.yml) ·
[`mlops-engineer`](../.github/roles/mlops-engineer.role.yml) ·
[`prompt-engineer`](../.github/roles/prompt-engineer.role.yml) ·
[`computer-vision-engineer`](../.github/roles/computer-vision-engineer.role.yml) ·
[`nlp-engineer`](../.github/roles/nlp-engineer.role.yml) ·
[`deep-learning-engineer`](../.github/roles/deep-learning-engineer.role.yml) ·
[`llmops-engineer`](../.github/roles/llmops-engineer.role.yml) ·
[`mlops-platform-engineer`](../.github/roles/mlops-platform-engineer.role.yml)

**Data & BI** — [`data-engineer`](../.github/roles/data-engineer.role.yml) ·
[`data-analyst`](../.github/roles/data-analyst.role.yml) ·
[`data-scientist`](../.github/roles/data-scientist.role.yml) ·
[`power-bi-developer`](../.github/roles/power-bi-developer.role.yml) ·
[`fabric-engineer`](../.github/roles/fabric-engineer.role.yml) ·
[`databricks-engineer`](../.github/roles/databricks-engineer.role.yml) ·
[`analytics-engineer`](../.github/roles/analytics-engineer.role.yml) ·
[`data-architect`](../.github/roles/data-architect.role.yml) ·
[`database-administrator`](../.github/roles/database-administrator.role.yml) ·
[`streaming-data-engineer`](../.github/roles/streaming-data-engineer.role.yml) ·
[`big-data-engineer`](../.github/roles/big-data-engineer.role.yml) ·
[`snowflake-engineer`](../.github/roles/snowflake-engineer.role.yml) ·
[`tableau-developer`](../.github/roles/tableau-developer.role.yml) ·
[`data-governance-specialist`](../.github/roles/data-governance-specialist.role.yml) ·
[`looker-developer`](../.github/roles/looker-developer.role.yml)

**Cloud & Platform** — [`azure-data-engineer`](../.github/roles/azure-data-engineer.role.yml) ·
[`aws-solutions-architect`](../.github/roles/aws-solutions-architect.role.yml) ·
[`gcp-data-engineer`](../.github/roles/gcp-data-engineer.role.yml) ·
[`cloud-engineer`](../.github/roles/cloud-engineer.role.yml) ·
[`platform-engineer`](../.github/roles/platform-engineer.role.yml) ·
[`network-engineer`](../.github/roles/network-engineer.role.yml) ·
[`azure-solutions-architect`](../.github/roles/azure-solutions-architect.role.yml) ·
[`azure-developer`](../.github/roles/azure-developer.role.yml) ·
[`aws-developer`](../.github/roles/aws-developer.role.yml) ·
[`aws-devops-engineer`](../.github/roles/aws-devops-engineer.role.yml) ·
[`gcp-cloud-architect`](../.github/roles/gcp-cloud-architect.role.yml) ·
[`terraform-iac-engineer`](../.github/roles/terraform-iac-engineer.role.yml) ·
[`cloud-native-engineer`](../.github/roles/cloud-native-engineer.role.yml) ·
[`serverless-engineer`](../.github/roles/serverless-engineer.role.yml)

**DevOps / SRE / Observability** — [`devops-engineer`](../.github/roles/devops-engineer.role.yml) ·
[`kubernetes-engineer`](../.github/roles/kubernetes-engineer.role.yml) ·
[`site-reliability-engineer`](../.github/roles/site-reliability-engineer.role.yml) ·
[`observability-engineer`](../.github/roles/observability-engineer.role.yml) ·
[`finops-engineer`](../.github/roles/finops-engineer.role.yml) ·
[`linux-administrator`](../.github/roles/linux-administrator.role.yml) ·
[`windows-server-administrator`](../.github/roles/windows-server-administrator.role.yml) ·
[`release-engineer`](../.github/roles/release-engineer.role.yml) ·
[`chaos-engineer`](../.github/roles/chaos-engineer.role.yml) ·
[`performance-engineer`](../.github/roles/performance-engineer.role.yml) ·
[`database-reliability-engineer`](../.github/roles/database-reliability-engineer.role.yml)

**Security** — [`security-engineer`](../.github/roles/security-engineer.role.yml) ·
[`cloud-security-engineer`](../.github/roles/cloud-security-engineer.role.yml) ·
[`application-security-engineer`](../.github/roles/application-security-engineer.role.yml) ·
[`soc-analyst`](../.github/roles/soc-analyst.role.yml) ·
[`devsecops-engineer`](../.github/roles/devsecops-engineer.role.yml) ·
[`iam-engineer`](../.github/roles/iam-engineer.role.yml) ·
[`grc-analyst`](../.github/roles/grc-analyst.role.yml) ·
[`privacy-engineer`](../.github/roles/privacy-engineer.role.yml)

**QA, Testing & Architecture** — [`qa-automation-engineer`](../.github/roles/qa-automation-engineer.role.yml) ·
[`sdet`](../.github/roles/sdet.role.yml) ·
[`solution-architect`](../.github/roles/solution-architect.role.yml)

**Design, Docs & Advocacy** — [`ux-ui-designer`](../.github/roles/ux-ui-designer.role.yml) ·
[`technical-writer`](../.github/roles/technical-writer.role.yml) ·
[`developer-advocate`](../.github/roles/developer-advocate.role.yml) ·
[`accessibility-engineer`](../.github/roles/accessibility-engineer.role.yml) ·
[`design-systems-engineer`](../.github/roles/design-systems-engineer.role.yml) ·
[`content-strategist`](../.github/roles/content-strategist.role.yml)

**Product & Delivery Management** — [`product-manager`](../.github/roles/product-manager.role.yml) ·
[`engineering-manager`](../.github/roles/engineering-manager.role.yml) ·
[`technical-program-manager`](../.github/roles/technical-program-manager.role.yml) ·
[`business-analyst`](../.github/roles/business-analyst.role.yml) ·
[`scrum-master`](../.github/roles/scrum-master.role.yml)

**Business, Support & Growth** — [`growth-engineer`](../.github/roles/growth-engineer.role.yml) ·
[`sales-engineer`](../.github/roles/sales-engineer.role.yml) ·
[`customer-success-engineer`](../.github/roles/customer-success-engineer.role.yml) ·
[`it-support-engineer`](../.github/roles/it-support-engineer.role.yml)

**Enterprise Platforms** — [`power-platform-developer`](../.github/roles/power-platform-developer.role.yml) ·
[`salesforce-developer`](../.github/roles/salesforce-developer.role.yml) ·
[`blockchain-engineer`](../.github/roles/blockchain-engineer.role.yml) ·
[`servicenow-developer`](../.github/roles/servicenow-developer.role.yml) ·
[`sap-abap-consultant`](../.github/roles/sap-abap-consultant.role.yml) ·
[`dynamics-365-developer`](../.github/roles/dynamics-365-developer.role.yml) ·
[`robotics-engineer`](../.github/roles/robotics-engineer.role.yml)

## Adding your own

1. `cp .github/roles/_TEMPLATE.role.yml .github/roles/my-role.role.yml`
2. Fill in `name`, `skills`, and the fields that matter.
3. `/role-composer .github/roles/my-role.role.yml`
4. Pick your new agent from the agent picker (or `@My Role`).

Don't fabricate cert codes or doc URLs — verify them or leave a `TODO:` for `role-composer` to flag.
