---
name: aws-iam-lab
description: "Hands-on AWS lab: work with IAM identities and permissions — create a role and least-privilege policy, set a trust relationship, and read a policy document's Effect/Action/Resource/Condition. Use for 'AWS IAM lab', 'create an IAM role', 'least-privilege policy', 'IAM trust policy', 'assume role', 'read an IAM policy', 'IAM hands-on lab', or learning AWS permissions by doing."
argument-hint: "The access need"
---

# AWS IAM Lab

Learn IAM by granting one identity exactly what it needs — read a policy, scope it, then test it — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-well-architected-review](../aws-well-architected-review/SKILL.md) and [terraform-module-coach](../terraform-module-coach/SKILL.md).

## When to use

- The learner is granting AWS access and wants least privilege they can verify, not a broad `*` policy.
- Reinforcing security-by-default for any **cloud/DevOps/security** role-agent.

## Policy anatomy

An IAM policy is JSON: **Effect** (Allow/Deny) × **Action** × **Resource** × optional **Condition**.
Evaluation is default-deny, and an explicit **Deny** always overrides an Allow (AWS IAM User Guide,
*Policy evaluation logic*).

## Procedure

1. **Pick the identity:** prefer a **role** with temporary credentials over an IAM user with long-lived
   access keys (AWS IAM User Guide, *Security best practices*).
2. **Read a policy:** parse Effect/Action/Resource/Condition; a `"Resource": "*"` or `"Action": "s3:*"`
   is your cue to narrow it.
3. **Scope least privilege:** start from nothing and add only the specific actions on the specific ARNs
   the task calls — add a `Condition` (e.g., source VPC) where it fits.
4. **Set the trust policy:** the *trust* policy says **who can assume** the role; the *permissions* policy
   says **what they can do** — keep the two straight.
5. **Test it:** use the IAM policy simulator and IAM Access Analyzer to catch over-broad or public grants
   before anyone relies on them.
6. ⚠ **Verify & clean up:** confirm allowed calls pass and denied calls fail, then delete lab users, roles,
   and any access keys.

## Output shape

```
Need: <who needs what> | Identity: role (temp creds) > user+keys
Policy: Effect Allow | Action <exact:actions> | Resource <exact ARNs>
Condition: <e.g., aws:SourceVpc = vpc-…> (optional)
Trust: principal <who assumes it> can sts:AssumeRole
Test: allowed call ✓ | denied call ✗ | Access Analyzer clean
Cleanup: delete lab role/user + rotate/remove keys
```

## Tips

- Start from zero and add permissions — never start from `*` and try to subtract.
- Roles over users: temporary credentials beat long-lived keys you must rotate and guard.
- End with the **Learning Footer** (`AGENTS.md`) — one action to remove + one Condition to add yourself.
