---
name: aws-vpc-lab
description: "Hands-on AWS lab: build a VPC network end to end — plan CIDR, create public and private subnets, attach an internet gateway and NAT, wire route tables, and contrast security groups with network ACLs. Use for 'AWS VPC lab', 'build a VPC', 'public vs private subnets', 'route tables', 'NAT gateway', 'security groups vs NACLs', 'VPC hands-on lab', or learning cloud networking by doing."
argument-hint: "The network"
---

# AWS VPC Lab

Learn VPC networking by building one — carve subnets, route traffic, and layer the firewalls — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-well-architected-review](../aws-well-architected-review/SKILL.md) and [terraform-module-coach](../terraform-module-coach/SKILL.md).

## When to use

- The learner wants a runnable network they can trace packet-by-packet, not just a diagram.
- Reinforcing network isolation and defense-in-depth for a **cloud/DevOps/security** role-agent.

## Topology

```mermaid
graph LR; IGW-->Pub[Public subnet]; Pub-->NAT; NAT-->Priv[Private subnet]
```

## Procedure

1. **Plan the CIDR:** pick a VPC range (e.g., `10.0.0.0/16`) and non-overlapping subnet blocks across two
   AZs for availability (Amazon VPC User Guide, *VPCs and subnets*).
2. **Public vs private subnets:** a subnet is "public" only because its route table sends `0.0.0.0/0` to an
   **internet gateway** — nothing else marks it.
3. **Add egress for private:** put a **NAT gateway** in a public subnet so private instances reach out
   outbound-only — ⚠ NAT bills per hour + per GB processed.
4. **Wire route tables:** public → IGW, private → NAT; associate each subnet with the right table.
5. **Layer the firewalls:** **security groups** are stateful and instance-level (allow-only); **NACLs** are
   stateless and subnet-level (allow + deny) — reach for SGs first, NACLs for coarse blocks.
6. ⚠ **Verify & clean up:** test reachability, then delete the **NAT gateway first** (its hourly charge is
   the usual surprise), then the subnets and VPC.

## Output shape

```
Network: <purpose> | VPC CIDR: 10.0.0.0/16 across 2 AZs
Subnets: public <…> (→IGW) | private <…> (→NAT)
Routes: public 0.0.0.0/0→IGW | private 0.0.0.0/0→NAT
Firewalls: SG (stateful, instance) | NACL (stateless, subnet)
Verify: public reachable | private outbound-only
Cleanup: delete NAT → subnets/routes → VPC  [⚠ NAT bills hourly]
```

## Tips

- Security group = stateful (return traffic auto-allowed); NACL = stateless (open both directions).
- NAT gateways quietly cost money — delete them the moment a lab is done.
- End with the **Learning Footer** (`AGENTS.md`) — one route to trace + one SG rule to tighten yourself.
