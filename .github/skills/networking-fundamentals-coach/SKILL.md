---
name: networking-fundamentals-coach
description: "Teach TCP/IP networking from first principles: the layers, IP addresses & subnets/CIDR, TCP vs UDP, ports & sockets, NAT, and how a request flows end to end. Use for 'explain networking', 'how does the internet work', 'what is a subnet', 'TCP vs UDP', 'what is NAT', or learning the networking basics."
argument-hint: "The networking topic or 'the basics'"
---

# Networking Fundamentals Coach

Teach how data actually moves across a network — build the model layer by layer — following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants networking from the ground up (layers, IP, ports, routing, NAT).
- A specialist needs to ground a networking sub-topic before DNS, TLS, or load balancing.

## Mental model

Data is wrapped by cooperating layers, each doing **one** job (RFC 1122, 1989):

| Layer | Job | Examples |
| --- | --- | --- |
| Application | app messages | HTTP, DNS, TLS |
| Transport | process↔process, reliability | TCP, UDP (ports) |
| Internet | host↔host routing | IP, CIDR, NAT |
| Link | local delivery | Ethernet, Wi-Fi |

## Procedure

1. **Scope & level.** Pick the layer(s) in question; state the one-sentence core idea first.
2. **Addressing.** IP + subnet mask/CIDR; public vs private (RFC 1918); how routing picks the next hop.
3. **Transport.** TCP = reliable, ordered, 3-way handshake; UDP = fast, connectionless; **ports** name the process.
4. **NAT & the edge.** Private→public translation lets many devices share one public IP.
5. **Trace end to end.** Walk one request: DNS lookup → TCP handshake → TLS → HTTP → response.
6. **Footer.** End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Scope: <layer/topic> | Level: …
Model: Link → Internet(IP) → Transport(TCP/UDP) → Application
Addressing: <IP/CIDR, public vs private>
Transport: TCP vs UDP → <which fits & why>
Path: DNS → handshake → request → response
```

## Tips

- Cite primary sources: RFC 791 (IP), RFC 9293 (TCP), RFC 768 (UDP), RFC 1918 (private IPs).
- Hand deeper topics to `dns-coach`, `tls-ssl-explainer`, `load-balancing-coach`; explain via `concept-explainer`.
- End with the **Learning Footer** (`AGENTS.md`) — the layer model to keep + a `traceroute`/`ip addr` drill.
