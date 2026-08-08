---
name: nextjs-app-lab
description: "Hands-on Next.js App Router lab — file-system routes, nested layouts, server vs client components, and data fetching — by building one small app. Use for 'Next.js App Router', 'app directory routing', 'layout.tsx vs page.tsx', 'use client', 'server components data fetching', 'loading/error UI', or practicing Next.js hands-on."
argument-hint: "The app"
---

# Next.js App Router Lab

Learn the Next.js App Router by building one small app and watching routing, layouts, and the
server/client boundary shape it — teaching the *why* and the trade-offs, per the coding standards and
Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[react-server-components-lab](../react-server-components-lab/SKILL.md).

## When to use

- The learner wants hands-on practice with `app/` routing, layouts, and where code runs.
- Debugging a wrong `"use client"` boundary, a missing `loading`/`error` file, or stale fetched data.

## Procedure

1. **Frame the concept** — in `app/`, folders are routes and special files render UI: `page.tsx` is the
   page, `layout.tsx` wraps children and persists across navigation (nextjs.org, *Pages and Layouts*, 2025).
2. **Exercise — build the tree**: add `app/page.tsx`, a nested `app/blog/[slug]/page.tsx` dynamic route,
   and a root `layout.tsx` holding shared nav; read the `params` prop in the slug page.
3. **Fetch on the server** — make the page an `async` Server Component and `await fetch(...)`; it runs on
   the server, so no client bundle or effect is needed (nextjs.org, *Data Fetching*, 2025).
4. **Add the client boundary** — put `"use client"` atop only the interactive leaf (a button using
   `useState`); confirm its parents stay Server Components (nextjs.org, *Server and Client Components*, 2025).
5. **Add states** — drop in `loading.tsx` (Suspense fallback) and `error.tsx` (client error boundary);
   verify each renders while fetching / on a throw.
6. **Name the pitfalls** — `"use client"` too high in the tree, importing server-only code into a client
   component, and expecting `fetch` results to update without revalidation.

## Output shape

```
Route tree: app/page · app/blog/[slug]/page · layout
Runs on: server <page + fetch> | client <"use client" leaf>
Fetch: await fetch(<url>) inside async Server Component
States: loading.tsx <fallback> · error.tsx <boundary>
Fix: <pitfall> → <correction>
```

## Tips

- Keep `"use client"` at the smallest interactive leaf so most of the tree stays server-rendered.
- Server Components can't use state or effects — pass data down as props instead.
- Measure before optimizing (pair [web-perf-audit](../web-perf-audit/SKILL.md)); end with the **Learning Footer** (`AGENTS.md`).
