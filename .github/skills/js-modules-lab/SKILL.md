---
name: js-modules-lab
description: "A hands-on lab in JavaScript on modules — ES Modules vs CommonJS, named/default imports and exports, dynamic import() for code splitting, plus bundling and tree-shaking basics. Use for 'modules lab', 'ESM vs CommonJS', 'import/export exercises', 'how does tree-shaking work', or learning JS module systems by doing."
argument-hint: "The module setup"
---

# JS Modules Lab

Learn the module system by **splitting real code into files and wiring imports** — following the
teach-by-doing principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner needs to structure code across files and choose ESM vs CommonJS.
- Setting up a project — pair with [`practice-generator`](../practice-generator/SKILL.md); review structure with [`code-review-coach`](../code-review-coach/SKILL.md).

## Procedure

1. **Concept, briefly.** **ESM** (`import`/`export`) is static, strict, and analyzable; **CommonJS**
   (`require`/`module.exports`) is dynamic and synchronous (MDN, *JavaScript modules*; ESM is ES2015,
   dynamic `import()` ES2020; CommonJS is Node's system).
2. **Exercise 1 — export/import.** Create `math.js` with named exports and one default; import both into
   `app.js`. Contrast named vs default and renaming with `as`.
3. **Exercise 2 — CommonJS.** Re-express `math.js` with `module.exports` and `require`; note the value
   copy versus ESM's live bindings.
4. **Exercise 3 — dynamic import.** Load a module lazily with `await import('./math.js')`; discuss code
   splitting and when it helps.
5. **Reference solution sketch.** ESM named exports + one default; `const m = await import(...)` returns a promise.
6. **Pitfalls.** Mixing ESM/CJS interop; missing file extensions in ESM; `__dirname` absent in ESM; assuming
   tree-shaking works on side-effectful or CommonJS modules.

## Output shape

```
ESM: import/export (static, strict, live bindings)
CJS: require/module.exports (dynamic, sync, value copy)
Dynamic: const m = await import('./x.js')  → code splitting
Tree-shaking: static ESM + side-effect-free → dead exports dropped
Pitfalls: interop · extensions · __dirname · CJS not shakeable
Your turn → <one module-structuring exercise>
```

## Tips

- Prefer ESM for new code; keep modules side-effect-free (`"sideEffects": false`) so bundlers can tree-shake.
- Use static `import` by default; reach for dynamic `import()` only for real lazy-loading wins.
- End with the **Learning Footer** (`AGENTS.md`).
