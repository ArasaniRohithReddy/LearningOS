---
name: react-server-components-lab
description: "Hands-on React lab on Server Components with the Next.js App Router — server vs client components, server-side data fetching, the 'use client' boundary, and Server Actions — by building one route. Use for 'React Server Components lab', 'RSC', 'Next.js App Router', 'use client', 'server actions', 'server vs client component', or practicing RSC hands-on."
argument-hint: "The app/route"
---

# React Server Components Lab

Build one App Router route to feel the server / client split — fetching on the server, marking interactive
leaves as client — teaching where the boundary belongs, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [react-suspense-lab](../react-suspense-lab/SKILL.md).

## When to use

- The learner is new to the App Router and unsure what runs on the server vs the client.
- Deciding where to place `'use client'` and how to fetch data without a client-side effect.

## Procedure

1. **Frame the concept** — Server Components render on the server, ship no JS, and can be `async` to fetch
   directly; Client Components add interactivity (react.dev, *Server Components*; nextjs.org, 2024).
2. **Exercise — build the route**: in `app/<route>/page.tsx` (a Server Component) `await` your data and
   render it; keep it free of hooks and browser APIs.
3. **Add a client leaf** — extract the interactive piece (button, input) into a `'use client'` component and
   import it from the server page, passing data down as serializable props.
4. **Respect the boundary** — a Server Component can render a Client Component, not the reverse; only
   serializable props cross, so functions, dates, and class instances don't.
5. **Mutate with a Server Action** — call a `'use server'` function from the client to update data and
   revalidate, replacing a manual API route (react.dev, *use server*, 2024).
6. **Name the pitfalls** — `'use client'` at the top of the tree, fetching in a client effect, non-serializable
   props, and secrets leaking into client code.

## Output shape

```
Route: app/<route>/page.tsx (server) — awaits <data>
Client leaf: <component> ('use client') — props: <serializable>
Boundary: server → client only; props serializable? yes/no
Server Action: <fn> ('use server') → mutate + revalidate
Pitfall: <named> → fix
```

## Tips

- Push `'use client'` to the leaves; keep pages and data fetching on the server.
- Only serializable props cross the boundary — no functions, dates, or class instances.
- Keep secrets and heavy deps server-side; for shared client state see [state-management-coach](../state-management-coach/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
