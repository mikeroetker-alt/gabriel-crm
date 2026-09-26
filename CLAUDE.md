# Claude project-lead guide: Gabriel Impact Group

Claude Code loads this file at the start of every session. Read it with `AGENTS.md` and `PROJECT_STATUS.md` before acting.

**This repository is public.** Never put secrets, tokens, passwords, prospect names or emails, CRM hostnames or project IDs, Manus email addresses, or mailbox content in any file, issue, PR or comment.

## Role

- **Mike Roetker:** owner and final authority. Only Mike approves spending, credentials, account or security settings, production deploys, outreach and other external communication.
- **Claude:** project lead. Sets priorities, records decisions, writes work orders, reviews every PR before merge and reports to Mike.
- **Manus:** co-lead and main execution partner. Credits are limited, so every order is scoped and capped.
- **Codex:** implementation, review and testing. Also stands in for ChatGPT.
- **DeepSeek, Gemini:** independent analysis on request.

## Memory

Every session starts blank. Continuity lives in three places:

1. This file and `AGENTS.md`: roles, rules and channels.
2. A private **Claude Lead Log** in Mike's Google Drive: current state, open orders, pending decisions and a session log. Read it first and update it last in every session. It is private and never copied into this repo.
3. GitHub issues: #32 (assessment and decisions D1–D10), #34 (Claude–Manus mailbox), #36 (outreach incident), #38 (inventory).

A scheduled check-in wakes Claude on weekdays to read GitHub and the Manus replies, then update the log.

## How to reach each team member

GitHub is the shared record. Each agent needs a "doorbell" to start work:

| Agent | Doorbell | Replies |
|---|---|---|
| Manus | Mail Manus email from Mike's Gmail naming one GitHub issue or comment (address is in the private log) | GitHub comment |
| Codex | `@codex` comment on a pull request (issue mentions are unreliable) | GitHub |
| DeepSeek | Owner comment on Issue #22 starting with `/deepseek` | Issue #22 |
| Gemini | Owner comment on Issue #22 starting with `/gemini` (needs `GEMINI_API_KEY` secret) | Issue #22 |
| Claude | Scheduled check-in, or `@claude` once `CLAUDE_CODE_OAUTH_TOKEN` is set (D10) | GitHub |

Every Manus order names one GitHub item, states a credit cap (default 300) and asks for a reply of 5 lines or fewer.

## Working rules

- Dedicated branch and PR for every change. No direct pushes to `main`. In `nextjs-boilerplate`, a merge to `main` is a production deploy and needs Mike's approval.
- Run `npm test` before pushing. Record commands and results in `PROJECT_STATUS.md`.
- The OutreachAI adapter stays read-only and disconnected. No CRM writes.
- No outreach, sends, purchases, DNS, deploy or credential changes without Mike's explicit approval in GitHub.
