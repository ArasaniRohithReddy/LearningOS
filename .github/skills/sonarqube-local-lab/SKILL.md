---
name: sonarqube-local-lab
description: "Hands-on lab to run SonarQube Community Build (free, open-source, no subscription) locally in Docker and scan a project with SonarScanner — surface bugs, code smells, vulnerabilities, duplications, and a quality gate at localhost:9000. Use for 'local code quality', 'static analysis', 'SonarQube setup', 'find code smells', 'quality gate', or learning SAST / code quality by doing."
argument-hint: "The project/language to analyze"
---

# SonarQube Local Lab

Learn static code analysis by running a quality server yourself — **SonarQube Community Build** is
free and open-source — then scan a project and read the results, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [secure-code-review](../secure-code-review/SKILL.md) and [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).

## When to use

- You want bugs, code smells, vulnerabilities, and duplication measured on real code — locally, no subscription.
- Learning what a **quality gate** enforces before adding one to CI.

## Mental model

- Two parts: the **server** (web UI + analysis engine at `localhost:9000`) and a **scanner** you run in
  your project. The scanner uploads findings; the server stores them, applies rules, and computes a
  pass/fail **quality gate**. Community Build is free/OSS; Developer/Enterprise editions (paid) add branch analysis and more.

## Procedure

1. **Start the server:** `docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:community`
   (SonarQube docs, *Try out SonarQube*); open `http://localhost:9000`, log in `admin`/`admin`, and change the password.
2. **Create a project & token:** **Create new project**, set a **project key**, then **Generate a
   token** (used by the scanner instead of your password).
3. **Configure the scan:** add `sonar-project.properties` with `sonar.projectKey`, `sonar.sources=.`,
   and `sonar.host.url=http://localhost:9000`.
4. **Analyze:** run **SonarScanner CLI** (`sonar-scanner`) with the token; for Maven/Gradle the scanner is invoked by the build.
5. **Read results:** triage **bugs / vulnerabilities / code smells / security hotspots** and check the
   quality gate — focus fixes on *new* code.

## Output shape

```
Tool: SonarQube Community Build (free/OSS) | Server: http://localhost:9000
Login: admin/admin (change on first login) | Auth: project token
Scan cfg: sonar-project.properties (projectKey, sources, host.url)
Run: sonar-scanner (CLI) | Maven/Gradle: build-invoked
Results: bugs · vulnerabilities · code smells · hotspots · quality gate
Editions: Community=free; Developer/Enterprise=paid | docs.sonarsource.com (2025)
```

## Tips

- The server needs a few GB of RAM; on Linux raise `vm.max_map_count` (Elasticsearch) if it won't start.
- A quality gate only helps if it *fails* the build — pair with [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md) and [secure-code-review](../secure-code-review/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one smell you fixed + one rule to enable yourself.
