---
name: azure-bicep-lab
description: "Hands-on Azure lab: author, deploy, and decompile Bicep end to end — write resource/param/var/output syntax, factor reusable modules, preview changes with what-if, target resource-group / subscription / management-group scopes, decompile existing ARM JSON to Bicep, and prove idempotency with a redeploy. Use for 'Bicep lab', 'write a Bicep template', 'az deployment what-if', 'Bicep modules', 'decompile ARM JSON to Bicep', 'Bicep deployment scopes', 'infrastructure as code on Azure', or learning Azure IaC by doing."
argument-hint: "The infrastructure to declare (+ optional resource group)"
---

# Azure Bicep Lab

Learn Bicep by declaring real infrastructure — author, preview, deploy, redeploy, modularize — per
[`AGENTS.md`](../../../AGENTS.md). For the multi-cloud IaC mindset, pair with
[terraform-module-coach](../terraform-module-coach/SKILL.md).

## When to use

- The learner is still clicking through the portal and cannot reproduce an environment.
- They inherited ARM JSON and want maintainable Bicep, or they fear "deploy" because it might delete things.
- Reinforcing infrastructure as code for a **cloud / DevOps / platform** role-agent.

## Mental model

Bicep is a **domain-specific language that transpiles to ARM JSON** — same engine, same API, far less noise
(Azure Resource Manager docs, *What is Bicep?*). You declare **desired state**; ARM computes the delta. That
is why redeploying an unchanged template is a **no-op**, and why `what-if` can tell you the future before
you commit to it.

```mermaid
flowchart LR
  B[main.bicep] -->|az bicep build| J[ARM JSON]
  J --> ARM[Azure Resource Manager]
  B -->|az deployment ... what-if|   WI["Preview: create / modify / delete / no-change"]
  WI -.->|approve| ARM
  ARM --> AZ[(Azure resources)]
  OLD[Existing ARM JSON] -->|az bicep decompile| B
  M[modules/*.bicep] -->|module keyword| B
```

## Pick the deployment scope

| What you are creating | `targetScope` | CLI command | Note |
| --- | --- | --- | --- |
| Storage, VM, App Service, Key Vault | `resourceGroup` (default) | `az deployment group create -g <RG>` | The 95% case |
| The resource group itself, policy at sub level | `subscription` | `az deployment sub create --location <loc>` | `--location` stores deployment metadata |
| Policy/RBAC across many subscriptions | `managementGroup` | `az deployment mg create --management-group-id <id> --location <loc>` | Governance, not workloads |
| Tenant-wide artifacts | `tenant` | `az deployment tenant create --location <loc>` | Rare; needs elevated rights |

**Incremental (default) vs Complete mode:** incremental leaves untouched resources alone; **Complete mode
deletes resources in the resource group that are absent from the template** — powerful for drift control,
dangerous the first time you meet it.

## Procedure

1. **Install and set context.** Bicep and ARM deployments are free; you pay only for the resources declared.
   ```bash
   az bicep install && az bicep version
   az group create -n rg-bicep-lab -l eastus
   ```
2. **Author `main.bicep`** — parameters in, resource declared, output back out:
   ```bicep
   @description('Globally unique storage account name')
   @minLength(3)
   param storageName string = 'st${uniqueString(resourceGroup().id)}'
   param location string = resourceGroup().location

   resource stg 'Microsoft.Storage/storageAccounts@2023-05-01' = {
     name: storageName
     location: location
     sku: { name: 'Standard_LRS' }
     kind: 'StorageV2'
     properties: {
       minimumTlsVersion: 'TLS1_2'
       allowBlobPublicAccess: false
     }
   }

   output storageId string = stg.id
   ```
3. **Lint and transpile** to see what ARM actually receives — the moment Bicep clicks:
   ```bash
   az bicep build --file main.bicep --stdout | head -40
   ```
4. **Preview before you deploy.** Never skip this on anything that already exists:
   ```bash
   az deployment group what-if -g rg-bicep-lab --template-file main.bicep
   ```
   Read every line: `+ Create`, `~ Modify`, `- Delete`, `= NoChange`. A surprise `-` is your cue to stop.
5. **Deploy with confirmation built in:**
   ```bash
   az deployment group create -g rg-bicep-lab --template-file main.bicep --confirm-with-what-if
   ```
6. **Prove idempotency (the verification step).** Run the *same* command again and confirm what-if reports
   `NoChange` and the deployment succeeds without recreating anything:
   ```bash
   az deployment group create -g rg-bicep-lab --template-file main.bicep --name redeploy-check --confirm-with-what-if
   az deployment group show -g rg-bicep-lab -n redeploy-check --query properties.provisioningState -o tsv
   ```
7. **Extract a module** once a second resource appears — modules are Bicep's unit of reuse:
   ```bicep
   module storage 'modules/storage.bicep' = {
     name: 'storage-deploy'
     params: { storageName: storageName, location: location }
   }
   output moduleStorageId string = storage.outputs.storageId
   ```
   Move parameter values into a typed `main.bicepparam` file (`using './main.bicep'`) and deploy with
   `--parameters main.bicepparam`.
8. **Decompile existing ARM JSON** you inherited, then clean it up by hand:
   ```bash
   az bicep decompile --file azuredeploy.json
   az bicep build --file azuredeploy.bicep     # must compile before you trust it
   ```
   Decompilation is **best-effort** (Bicep docs): expect generated `param`/`var` names, lost comments, and
   awkward expressions — treat the output as a first draft, then re-run what-if against the live resource
   group to confirm it produces `NoChange`.
9. ⚠ **Clean up:** `az group delete -n rg-bicep-lab --yes --no-wait` — the resources, not the templates, are
   what bills you.

## Output shape

```
Goal: <infrastructure to declare>   Scope: resourceGroup | subscription | managementGroup | tenant
Files: main.bicep | main.bicepparam | modules/<name>.bicep
Params: <name:type=default, with @description/@allowed constraints>
Outputs: <what downstream consumers need>
Transpile: az bicep build --stdout -> ARM JSON OK
Preview: what-if -> +Create <n> | ~Modify <n> | -Delete <n> | =NoChange <n>   Surprises: <none|...>
Deploy: az deployment group create --confirm-with-what-if -> Succeeded
Idempotency check: redeploy -> what-if =NoChange, provisioningState=Succeeded
Decompiled: <source ARM JSON> -> bicep (best-effort; manual fixes: <...>)
Cleanup: az group delete -n <rg> --yes  [⚠ stops resource cost]
```

## Tips

- **`what-if` is the seatbelt.** Wire `--confirm-with-what-if` into local runs and a what-if step into CI so
  reviewers see the delta, not just the diff of the file.
- **Complete mode deletes.** Only use `--mode Complete` when the template is the single source of truth for
  that resource group, and only after reading the what-if output line by line.
- **Never hard-code secrets in a template or parameter file.** Use `@secure()` parameters and reference Key
  Vault; parameter files land in Git.
- **Pin API versions deliberately.** The version in `'Microsoft.Storage/storageAccounts@2023-05-01'` is part
  of your contract — bump it on purpose, not by accident.
- **A module should have a job, not just fewer lines.** Split by lifecycle and ownership (networking,
  data, app), the same instinct taught in
  [terraform-module-coach](../terraform-module-coach/SKILL.md).
- **`existing` beats re-declaring.** Reference resources you do not own with the `existing` keyword instead
  of accidentally taking ownership of their configuration.
- Deployments are named and historical — `az deployment group list` is a free audit trail; give deployments
  meaningful names in CI.
- End with the **Learning Footer** (`AGENTS.md`) — one hard-coded value to parameterize + one what-if
  `-Delete` line to explain yourself.
