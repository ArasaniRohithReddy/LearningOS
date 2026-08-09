---
name: lwc-component-lab
description: "Hands-on Lightning Web Component lab in a free Salesforce Developer Edition org — build a component with @api/@wire/@track, choose between wire and imperative Apex, read and write records through Lightning Data Service instead of custom Apex, publish and subscribe over Lightning Message Service, and prove behaviour with sfdx-lwc-jest tests. Use for 'build an LWC', 'Lightning Web Component', '@wire vs imperative Apex', 'LWC decorators', 'Lightning Data Service', 'Lightning Message Service', 'component communication', 'LWC Jest test', or 'lwc not re-rendering'."
argument-hint: "A component goal, e.g. 'record list with search', 'child-to-parent event', or 'why doesn't my array update the UI'"
---

# LWC Component Lab

A build-it lab for Lightning Web Components — **standard web components plus a reactivity contract** —
following [`AGENTS.md`](../../../AGENTS.md). Learn the contract and the rest is plain JavaScript.
Runs entirely in a **free Salesforce Developer Edition org**.

## When to use

- The learner is writing their first LWC and needs the file bundle, decorators and deploy loop explained.
- Their UI "doesn't update" after mutating an object or array in place.
- They cannot decide between `@wire` and an imperative Apex call, or between LDS and custom Apex.
- Two components that are not parent and child need to talk (Lightning Message Service).
- They need Jest tests that run locally without an org.

## Free environment — Developer Edition org + sfdx-lwc-jest

| Step | Command | Verify |
| --- | --- | --- |
| 1. Free org | Sign up at `developer.salesforce.com/signup` | Login works |
| 2. CLI | `npm install --global @salesforce/cli` | `sf --version` |
| 3. Auth | `sf org login web --alias devorg --set-default` | `sf org display` |
| 4. Project | `sf project generate --name lwc-lab && cd lwc-lab` | `force-app/main/default/lwc/` exists |
| 5. Component | `sf lightning generate component --type lwc --name contactList --output-dir force-app/main/default/lwc` | `.js`, `.html`, `.js-meta.xml` created |
| 6. Jest | `npm install && npm install --save-dev @salesforce/sfdx-lwc-jest` | `npx sfdx-lwc-jest --version` |
| 7. Deploy | `sf project deploy start --source-dir force-app` | "Deploy Succeeded" |
| 8. Test | `npm run test:unit` (or `npx sfdx-lwc-jest`) | Jest pass/fail summary |

Expose the component by setting `<isExposed>true</isExposed>` and a `<target>` (e.g.
`lightning__RecordPage`) in `<component>.js-meta.xml`, then drop it on a page in **Lightning App Builder**.

## Data and message flow

```mermaid
flowchart TD
  subgraph Component
    A[template .html] -->|renders| B[class .js]
    B -->|@api public props| A
  end
  P[Parent] -->|@api property down| B
  B -->|CustomEvent up| P
  B -->|@wire getRecord| LDS[(Lightning Data Service cache)]
  LDS --> UIAPI[UI API]
  B -->|imperative import method| APEX[Apex @AuraEnabled]
  B <-->|publish / subscribe| LMS[Lightning Message Service channel]
  LMS <--> O[Unrelated component elsewhere on the page]
```

## Decision table

| Question | Choose | Why / trade-off |
| --- | --- | --- |
| Public input from a parent | `@api property` | One-way down; parent owns the value |
| Child needs to notify a parent | `this.dispatchEvent(new CustomEvent('select', {detail}))` | Events bubble up; no tight coupling |
| Reactive field that is an object/array mutated in place | `@track` | Since LWC API v48 all fields are reactive on **reassignment**; `@track` only adds deep observation |
| Single record CRUD | **Lightning Data Service** (`lightning-record-form`, `getRecord`, `updateRecord`) | Shared cache, FLS + sharing enforced by UI API, no Apex to test |
| Data arriving on load, cached, auto-refreshing | `@wire` | Declarative, reactive to `$param` changes; **cannot be called on demand** |
| Data on a button click, or with ordering/error control | Imperative Apex (`import m from '@salesforce/apex/...'` → `await m({args})`) | Full control over when and error handling; no automatic cache |
| Two unrelated components on the page | **Lightning Message Service** | `@wire(MessageContext)` + `publish`/`subscribe` on a `.messageChannel-meta.xml` |
| Refreshing wired data after a DML | `refreshApex(this.wiredResult)` | Only works on the **whole wired result object**, not the extracted value |

## Procedure

1. **State the component's job in one sentence** and decide its inputs (`@api`), its outputs
   (`CustomEvent`) and where its data comes from (LDS, wire Apex, imperative Apex).
2. **Set up the free org and project** with the table above; confirm `sf org display` before coding.
3. **Prefer Lightning Data Service first.** Explain the trade-off: LDS enforces field-level security and
   sharing and shares a cache across components, so a custom `@AuraEnabled` method is only justified when
   the logic is genuinely server-side (aggregation, multi-object, callouts).
4. **Write the bundle**: `.html` template (no logic beyond expressions), `.js` class with decorators,
   `.js-meta.xml` with `isExposed` and targets. Keep the class small; getters over template logic.
5. **Wire the data**, showing both shapes: the `@wire(fn, {param: '$reactiveProp'}) wiredX({data, error})`
   handler form and the property form — and demonstrate that `$` makes the parameter reactive.
6. **Add the imperative variant** of the same call so the learner can compare error handling
   (`try/catch` + `error.body.message`) against the wire's `error` branch.
7. **Add communication**: parent→child via `@api`, child→parent via `CustomEvent`, and cross-DOM via a
   message channel — create it as `force-app/main/default/messageChannels/Sample__c.messageChannel-meta.xml`,
   then `import CH from '@salesforce/messageChannel/Sample__c'`. **Always unsubscribe** in
   `disconnectedCallback()`.
8. **Write Jest tests**: `createElement`, append to `document.body`, `await Promise.resolve()` before
   asserting on rendered DOM, and use the `__mocks__`/`jest.mock` stubs for Apex and wire adapters
   (`emit()` on the test wire adapter). Clean the DOM in `afterEach`.
9. **Run everything and paste the real output** — `npm run test:unit` locally, then
   `sf project deploy start --source-dir force-app` and open the page in the org. A component that has not
   been rendered in a real org is not finished.
10. **Debug from evidence**: browser devtools console, `sf org open`, and Setup → Debug Logs for the Apex
    side. If a re-render is missing, check for in-place mutation before blaming the framework.
11. **Route onward** — server logic and limits →
    [apex-soql-lab](../apex-soql-lab/SKILL.md); component API design →
    [component-designer](../component-designer/SKILL.md); rendering/perf reasoning →
    [react-performance-lab](../react-performance-lab/SKILL.md); UI test strategy →
    [e2e-testing-coach](../e2e-testing-coach/SKILL.md).

## Output shape

```
LWC lab — <component goal>

Bundle: force-app/main/default/lwc/<name>/
  <name>.html | <name>.js | <name>.js-meta.xml | __tests__/<name>.test.js

Data strategy: <LDS | @wire Apex | imperative Apex>  — because <trade-off>
Communication: <@api down | CustomEvent up | LMS across>

Code (annotated):
  <html>
  <js with decorators and getters>
  <jest test>

Reactivity check: reassigned (not mutated) <field>?  yes/no
Unsubscribe in disconnectedCallback? yes/no

Run this:
  npm run test:unit
  sf project deploy start --source-dir force-app && sf org open
Actual result: <paste Jest summary + what rendered>

Pitfall avoided: <in-place mutation | missing $ | leaked subscription>
Next: <linked skill>
```

## Tips

- Reassign, don't mutate: `this.items = [...this.items, row]` re-renders; `this.items.push(row)` does not
  unless the field is `@track`-ed for deep observation.
- `$param` in a wire config is what makes it reactive — a bare `param` is read once and never again.
- `@wire` cannot be invoked on demand; if the user must press a button, it has to be imperative.
- Keep templates dumb — move conditions into getters so they are unit-testable without the DOM.
- `refreshApex` needs the **whole** wired result stashed (`this.wiredResult = result`), not `result.data`.
- Always `unsubscribe(this.subscription)` in `disconnectedCallback()`; leaked LMS subscriptions cause
  ghost updates that look like framework bugs.
- Ground every decorator, module and adapter name in the **Lightning Web Components Developer Guide**, the
  **LWC component reference**, the **UI API** docs and **Trailhead** — never invent a module path such as
  `lightning/...`; confirm it exists first.
- End with the **Learning Footer** (`AGENTS.md`).
