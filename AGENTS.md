# Shared Instructions for Codex and ChatGPT

## Purpose

Use this repository as the shared source of truth for Gabriel CRM and related Gabriel Impact Group technical work.

## Required handoff process

- Before starting, read `PROJECT_STATUS.md`, the latest commits, and any open pull request or issue related to the task.
- After each meaningful work session, update `PROJECT_STATUS.md` with completed work, files changed, tests run, blockers, and next actions.
- Commit and push completed work. ChatGPT cannot review local-only or uncommitted changes.
- Use clear commit messages describing the business outcome.
- For substantial work, use a dedicated branch and pull request.
- Do not commit passwords, API keys, access tokens, private client data, or secrets.

## Validation

- Run the relevant build, lint, test, and type-check commands before marking work complete.
- Record exact commands and results in `PROJECT_STATUS.md`.
- If validation cannot run, document why and what remains unverified.

## Communication

- Keep the repository understandable to both technical and nontechnical reviewers.
- State assumptions explicitly.
- Flag decisions requiring Michael Roetker's approval rather than making financial, outreach, contractual, or client-facing commitments automatically.
