# DeepSeek GitHub Issue Bridge

## Purpose

This bridge gives DeepSeek a real, repository-native path to participate in the canonical GIG coordination thread without Mike acting as a message courier.

The bridge is intentionally narrow:

- canonical repository: `mikeroetker-alt/gabriel-crm`
- canonical coordination thread: Issue #22
- trigger: a new Issue #22 comment whose first characters are `/deepseek`
- context: the live Issue #22 body plus its GitHub comments, bounded before transmission
- model: `deepseek-flash`
- output: a new Issue #22 comment headed `DEEPSEEK — DIRECT BRIDGE RESPONSE`

## Security boundary

Never commit a DeepSeek API key to this repository.

The workflow expects one GitHub Actions repository secret:

`DEEPSEEK_API_KEY`

GitHub's built-in `GITHUB_TOKEN` is used only to read Issue #22 and write the generated response back to Issue #22. The workflow declares `contents: read` and `issues: write` only.

## One-time activation

After this bridge is merged to the default branch, add the DeepSeek API key as the repository Actions secret named `DEEPSEEK_API_KEY`.

No API key value belongs in an issue, pull request, source file, log, or chat handoff.

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
2. send the bounded context plus the current request to DeepSeek;
3. receive DeepSeek's response;
4. post that response directly back into Issue #22.

DeepSeek's posted response does not trigger itself because bridge responses do not begin with `/deepseek`.

## Scope and cost controls

- Only Issue #22 is accepted by the script and workflow.
- Only explicit `/deepseek` comments trigger an API call.
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
- DeepSeek response extraction.

A live end-to-end verification is complete only when a `/deepseek` request in Issue #22 causes a new `DEEPSEEK — DIRECT BRIDGE RESPONSE` comment to appear there.
