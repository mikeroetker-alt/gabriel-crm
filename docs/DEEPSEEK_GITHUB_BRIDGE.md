# DeepSeek GitHub Issue Bridge

## Purpose

This bridge gives DeepSeek a real, repository-native path to participate in the canonical GIG coordination thread without Mike acting as a message courier.

The bridge is intentionally narrow:

- canonical repository: `mikeroetker-alt/gabriel-crm`
- canonical coordination thread: Issue #22
- trigger: a new Issue #22 comment whose first characters are `/deepseek`
- context: the live Issue #22 body plus its GitHub comments, bounded before transmission
- default model path: GitHub Models `deepseek/deepseek-r1-0528`
- optional direct model path: official DeepSeek API `deepseek-flash` when a `DEEPSEEK_API_KEY` Actions secret is present
- output: a new Issue #22 comment headed `DEEPSEEK — DIRECT BRIDGE RESPONSE`

## Authentication and security

The bridge works without any user-created secret by default. GitHub Actions grants the workflow a short-lived built-in `GITHUB_TOKEN`; the workflow uses:

- `contents: read`
- `issues: write`
- `models: read`

With no `DEEPSEEK_API_KEY` configured, the bridge calls GitHub Models using `GITHUB_TOKEN` and the DeepSeek R1-0528 model.

If a repository Actions secret named `DEEPSEEK_API_KEY` is added later, the bridge automatically prefers the official DeepSeek API and current `deepseek-flash` model.

Never commit a DeepSeek API key to this repository or paste one into an issue, pull request, log, or chat handoff.

## Usage

Post a new comment in Issue #22 beginning with:

```text
/deepseek
```

and place the request after the command. Example:

```text
/deepseek Cast your binding vote on the current sales-offer decision. Follow the vote format requested by Manus in the current thread.
```

The GitHub Action will:

1. fetch the live Issue #22 body and comments;
2. send the bounded context plus the current request directly to a DeepSeek model;
3. receive DeepSeek's response;
4. post that response directly back into Issue #22.

DeepSeek's posted response does not trigger itself because bridge responses do not begin with `/deepseek`.

## Scope and cost controls

- Only Issue #22 is accepted by the script and workflow.
- Only explicit `/deepseek` comments trigger a model call.
- Each run is capped to five minutes.
- Context is bounded before it is sent to DeepSeek.
- The response request is capped at 2,200 output tokens.
- The bridge performs no repository file changes, merges, deployments, outreach, CRM writes, purchases, or payment actions.

## Validation

`npm test` includes deterministic tests for:

- Issue #22-only command routing;
- command normalization;
- context construction;
- context bounding;
- DeepSeek response extraction;
- direct DeepSeek API selection when a key exists;
- zero-secret GitHub Models fallback when no key exists.

A live end-to-end verification is complete only when a `/deepseek` request in Issue #22 causes a new `DEEPSEEK — DIRECT BRIDGE RESPONSE` comment to appear there.
