---
name: aws-rds-lab
description: "Hands-on AWS lab: stand up an Amazon RDS database (concepts) — pick an engine and instance, connect privately over a security group, tune settings with a parameter group, and understand automated backups, snapshots, and point-in-time recovery. Use for 'AWS RDS lab', 'create an RDS instance', 'connect to RDS', 'RDS parameter group', 'RDS backups and snapshots', 'point-in-time recovery', 'RDS hands-on lab', or learning managed relational databases by doing."
argument-hint: "The database"
---

# AWS RDS Lab

Learn RDS by standing up a managed database — provision, connect privately, tune, and protect with backups —
per [`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-vpc-lab](../aws-vpc-lab/SKILL.md) and [serverless-designer](../serverless-designer/SKILL.md).

## When to use

- The learner wants a guided walkthrough of a managed SQL database and its safety features, not just theory.
- Reinforcing managed data stores, networking, and backups for a **cloud/backend/data** role-agent.

## Mental model

RDS runs a managed engine (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server) and handles provisioning,
patching, backups, and failover. **Multi-AZ** keeps a synchronous standby for HA; **read replicas** scale
reads asynchronously (Amazon RDS User Guide, *What is Amazon RDS?*).

## Procedure

1. **Provision the instance:** choose engine, instance class, and gp3 storage; Single-AZ is fine for the lab,
   Multi-AZ for production HA.
2. **Connect privately:** place it in **private subnets**, keep *Publicly accessible* **off**, and let a
   security group allow only the app's SG on the DB port ([aws-vpc-lab](../aws-vpc-lab/SKILL.md)).
3. **Secure credentials:** store the password in **Secrets Manager** (rotation) or use IAM database auth —
   never hard-code it; enable encryption at rest (KMS) and TLS in transit.
4. **Tune with a parameter group:** change engine settings (e.g., `max_connections`) via a **DB parameter
   group** — static params need a reboot, dynamic ones apply live (*Working with parameter groups*).
5. **Protect with backups:** automated backups give point-in-time recovery (retention 1–35 days); take a
   **manual snapshot** before risky changes — snapshots persist until you delete them.
6. ⚠ **Watch cost & clean up:** an instance bills 24/7 and a *stopped* one auto-starts after 7 days — take a
   final snapshot, then delete the instance and stray snapshots.

## Output shape

```
DB: <engine> on <class>, gp3, Single-AZ (lab)
Network: private subnets, Publicly accessible OFF, SG = app SG only
Secrets: Secrets Manager / IAM auth | encrypt at rest + TLS
Params: DB parameter group (max_connections…) static=reboot
Backups: automated PITR 1–35d + manual snapshot
Cleanup: final snapshot → delete instance  [⚠ bills 24/7; auto-starts @7d]
```

## Tips

- Practice free and offline first with [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md) — Floci runs RDS locally (approximate), so verify backup/PITR on real AWS.
- A Lambda or app connecting to RDS should go through **RDS Proxy** to pool connections ([aws-lambda-lab](../aws-lambda-lab/SKILL.md)).
- End with the **Learning Footer** (`AGENTS.md`) — one parameter to change + one snapshot restore to rehearse yourself.
