---
name: go-modules-lab
description: "Hands-on Go lab on modules: go mod init, go.mod and go.sum, semantic versioning and the /vN major-version suffix, adding and tidying dependencies, and multi-module workspaces. Use for 'teach me Go modules', 'hands-on modules lab', 'go.mod', 'go mod tidy', 'semantic import versioning', 'go work / workspaces', or setting up a Go project from scratch."
argument-hint: "The project setup"
---

# Go Modules Lab

Learn modules by initializing a project and managing its dependencies yourself — a guided, hands-on lab
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* `go.mod`, versioning, and workspaces by setting up a real project.
- Teaching dependency management for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** a module is a versioned collection of packages rooted at a `go.mod`; the `go` command
resolves dependencies and pins exact versions and checksums in `go.sum` (go.dev/ref/mod).

1. **Init:** `go mod init example.com/greet` writes `go.mod` with the module path and a `go` version line.
2. **Add a dep:** import a package, then `go get` (or `go mod tidy`); `require` + checksums land in `go.sum`.
3. **Version:** dependencies use semantic versions (`v1.4.2`); a major `v2+` carries a `/v2` import-path suffix.
4. **Tidy & upgrade:** `go mod tidy` prunes unused requires; `go get pkg@latest` bumps a version.
5. **Workspace:** `go work init ./greet ./cli` writes `go.work` to develop several modules together (Go 1.18, 2022).

**Reference sketch:**
```
module example.com/greet

go 1.22

require rsc.io/quote/v3 v3.1.0 // v2+ needs the /vN suffix in the path

require golang.org/x/text v0.14.0 // indirect
```
**Pitfalls:** hand-editing `go.mod`/`go.sum` instead of using `go` commands; omitting the `/v2` suffix for
a major version; committing without `go mod tidy`; confusing GOPATH-era layout with modules.

## Output shape
```
Concept: module = go.mod + versioned deps; go.sum pins checksums
Steps 1–5: <what you set up + why>; init → get → tidy → (work)
Check: module path right? /vN for v2+? tidied? go.mod and go.sum committed?
```

## Tips
- Let the `go` tool edit `go.mod`; commit both `go.mod` and `go.sum` (go.dev/ref/mod).
- Develop linked modules with a workspace (go.dev/doc/tutorial/workspaces, Go 1.18); plan the layout with [`worked-example`](../worked-example/SKILL.md).
- Version or import errors? [`debugging-coach`](../debugging-coach/SKILL.md); drill via [`practice-generator`](../practice-generator/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
