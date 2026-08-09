# Deploy all agents & skills

Run **Drona: Deploy all LearningOS agents & skills** to install the full catalog into a
location VS Code Copilot discovers natively:

- **128 specialist agents** — appear in the **Chat agent picker** (e.g. *Exam and Certification
  Coach*, *Data Engineer*, *Security Engineer*).
- **779 skills** — invoked with **`/`** in Chat (e.g. `/mock-exam`, `/concept-explainer`,
  `/research-brief`).

You choose where to install:

- **User profile (`~/.copilot`)** — recommended. Roams across **every** workspace **and** the
  Copilot CLI. No workspace changes.
- **This workspace (`.github`)** — installs into `.github/` and sets
  `chat.agentSkillsLocations` so `.github/skills/` is picked up here.

Deployment only **adds or overwrites LearningOS's own files** — it never deletes yours. Re-running
is idempotent unless you choose **Redeploy**.

```
@drona I want to prep for DP-700 — which specialist and skills should I use?
```
