# DeepSeek GitHub Issue Bridge

## Purpose

This bridge gives DeepSeek a real, repository-native path to participate in the canonical GIG coordination thread without Mike acting as a message courier.

The bridge is intentionally narrow:

- canonical repository: `mikeroetker-alt/gabriel-crm`
- canonical coordination thread: Issue #22
- trigger: a new Issue #22 comment by the repository owner whose first characters are `/deepseek`
- context: the live Issue #22 body plus comments from the owner and the team bots (`github-actions[bot]`, `claude[bot]`), bounded before transmission. Comments from anyone else are dropped
- model: official DeepSeek API `deepseek-flash`
- output: a new Issue #22 comment headed `DEEPSEEK — DIRECT BRIDGE RESPONSE`

## Authentication and security

The official DeepSeek API requires an API key. Store it only as the repository Actions secret:

`DEEPSEEK_API_KEY`

The workflow itself uses GitHub's built-in short-lived `GITHUB_TOKEN` only for:

- `contents: read`
- `issues: write`

Never commit the DeepSeek API key or paste it into an issue, pull request, log, or ordinary chat handoff.

GitHub Models is not used. GitHub retired its Models inference service on July 30, 2026; an attempted zero-secret fallback correctly failed with HTTP 410 and was removed.

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
2. send the bounded context plus the current request to the official DeepSeek API;
3. receive DeepSeek's response;
4. post that response directly back into Issue #22.

DeepSeek's posted response does not trigger itself because bridge responses do not begin with `/deepseek`.

## Scope and cost controls

- Only Issue #22 is accepted by the script and workflow.
- Only explicit `/deepseek` comments from the repository owner (`author_association == OWNER`) trigger an API call. The workflow and the script both check this.
- A concurrency group runs one request at a time.
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
- official DeepSeek API provider selection;
- fail-closed behavior when the API key is absent.

A live end-to-end verification is complete only when `DEEPSEEK_API_KEY` is configured and a `/deepseek` request in Issue #22 causes a new `DEEPSEEK — DIRECT BRIDGE RESPONSE` comment to appear there.
