---
name: linux-networking-lab
description: "Hands-on Linux networking lab: inspect interfaces and routes with ip, list listening ports and sockets with ss, test HTTP with curl, and troubleshoot connectivity layer by layer (link → IP → route → DNS → port). Use for 'Linux networking hands-on lab', 'ip/ss lab', 'check open ports', 'connection refused', 'curl a service', 'network troubleshooting', or learning Linux networking by doing."
argument-hint: "The network issue"
---

# Linux Networking Lab

A guided, hands-on lab on Linux networking — read interfaces, sockets, and ports, then isolate a fault layer by
layer — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`networking-fundamentals-coach`](../networking-fundamentals-coach/SKILL.md) and [`linux-command-coach`](../linux-command-coach/SKILL.md).

## When to use

- A connection is refused, times out, or "the port isn't open" and the learner needs a methodical check.
- Teaching the modern iproute2 tools (`ip`, `ss`) that replace legacy `ifconfig`/`netstat`.

## Procedure

1. **Concept.** Work bottom-up: is the **interface** up, does it have an **IP**, is there a **route**, does **DNS**
   resolve, is the **port** listening, does the **app** answer (`ip(8)`, `ss(8)`).
2. **Addresses & routes.** `ip addr` shows interfaces/IPs, `ip link` their state, `ip route` the routing table,
   `ip neigh` the ARP cache.
3. **Sockets & ports (exercise).** `ss -tlnp` lists TCP **l**istening sockets, **n**umeric, with **p**rocess;
   `ss -tunap` shows all TCP/UDP — confirm your service is actually bound to the expected port.
4. **App layer.** `curl -v http://host:port/` shows the handshake, request, and status; `curl -I` fetches only
   headers; add `--resolve host:port:IP` to bypass DNS (curl(1)).
5. **Isolate.** `ping <host>` (reachability), `traceroute <host>` (path), `dig <name>` (DNS) — each step names
   which layer failed instead of guessing.
6. **Verify & pitfalls.** ⚠ On a remote/SSH host, `ip addr/route add|del`, `ip link set ... down`, or firewall edits
   can cut your session — change with care. Confirm with `ss -ltn` (port up) and a successful `curl`.

## Output shape

```
Layer check: link → IP → route → DNS → port → app
Addr/route: ip addr ; ip link ; ip route ; ip neigh
Ports: ss -tlnp (listening) ; ss -tunap (all)   → is it bound?
App: curl -v http://host:port/ ; curl -I ; --resolve host:port:IP
Isolate: ping <host> ; traceroute <host> ; dig <name>
⚠ Remote: ip/link/firewall changes can drop your SSH session
```

## Tips

- "Connection refused" = you reached the host but nothing is listening on that port; "timed out" = never reached it.
- `ss` replaces `netstat` and `ip` replaces `ifconfig`/`route` — learn the iproute2 tools on modern distros.
- End with the **Learning Footer** (`AGENTS.md`) — the layer-by-layer checklist + an `ss -tlnp` + `curl -v` drill.
