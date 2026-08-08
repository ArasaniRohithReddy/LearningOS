---
name: vite-lab
description: "Hands-on Vite lab — the native-ESM dev server, hot module replacement, production builds, and vite.config basics — by wiring one small project. Use for 'Vite basics', 'dev server', 'HMR', 'vite build', 'vite.config.js', 'Vite plugins', 'why dev is fast but build is bundled', or practicing Vite hands-on."
argument-hint: "The build setup"
---

# Vite Lab

Learn Vite by wiring one small project and watching the dev server, HMR, and build behave differently —
teaching the *why* and the trade-offs, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [web-perf-audit](../web-perf-audit/SKILL.md).

## When to use

- The learner wants hands-on understanding of how Vite serves, reloads, and builds code.
- Debugging a slow dev start, HMR that full-reloads, or an env/config option that isn't applied.

## Procedure

1. **Frame the concept** — in dev, Vite serves source over native ES modules (no bundling), so start time
   stays flat as the app grows (vite.dev, *Why Vite*, 2025).
2. **Exercise — run dev**: scaffold a project, `import` a module into `main.js`, and open the dev server;
   note only requested modules are transformed, on demand.
3. **See HMR** — edit a module and watch the browser patch just that module in place, keeping app state
   (vite.dev, *Features → Hot Module Replacement*, 2025); compare with a full page reload.
4. **Build for production** — run `vite build`; Vite bundles with Rollup, code-splits, and hashes assets into
   `dist/`; preview it with `vite preview` (vite.dev, *Building for Production*, 2025).
5. **Configure it** — add `vite.config.js` exporting `defineConfig({ plugins: [...], resolve: { alias } })`;
   change `server.port`, restart, and verify it applies (vite.dev, *Configuring Vite*, 2025).
6. **Name the pitfalls** — expecting unbundled dev to mirror the built output, missing a framework plugin,
   and env vars without the required `VITE_` prefix.

## Output shape

```
Dev: native ESM, on-demand transform → fast start
HMR: edit module → patched in place (state kept)
Build: vite build → Rollup bundle + hashes → dist/
Config: vite.config.js { plugins, server.port, alias }
Fix: <pitfall> → <correction>
```

## Tips

- Dev is unbundled and prod is Rollup-bundled — always smoke-test the `build` output, not just dev.
- Only client env vars prefixed `VITE_` reach app code — keep secrets server-side.
- Add just the plugins you need; end with the **Learning Footer** (`AGENTS.md`).
