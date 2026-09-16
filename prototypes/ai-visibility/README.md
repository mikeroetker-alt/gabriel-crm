# AI Visibility product prototype

Static, synthetic-only implementation for GitHub Issue #22.

## Preview

Serve the repository root with any static HTTP server, then open:

`/prototypes/ai-visibility/`

The top navigation exposes four review assets:

1. AI Discovery Snapshot synthetic example (limited $25 one-time downsell; pricing appears only after the sales-page choice).
2. Monthly Client Dashboard.
3. Work Completed This Month ledger.
4. Local Business Spotlight prototype.

The Monthly Dashboard scenario selector demonstrates positive movement, little/no external movement, and a factual/provider exception. Use **Print report** for a print-friendly view.

## Data status

Every business, observation, citation, source, competitor, engagement event, and activity record is synthetic. The prototype makes no network requests and sends no outreach. It does not connect to the live CRM or any observation provider.

The provider-neutral entities and interface are documented in [`docs/AI_VISIBILITY_DATA_CONTRACT.md`](../../docs/AI_VISIBILITY_DATA_CONTRACT.md). The current provider, cost, stability, automation, exception, and kill-criteria plan is in [`docs/AI_VISIBILITY_FEASIBILITY_PLAN.md`](../../docs/AI_VISIBILITY_FEASIBILITY_PLAN.md).

## Validation

From the repository root:

```sh
node --test
```

The tests cover deterministic scenarios, flat external movement with meaningful controlled work, factual-conflict blocking, provider unavailability, evidence placeholders, and absence of live CRM/private contact data.


## Sales-page staging

The authorized $197/month primary sales page is at `/prototypes/ai-visibility/sales/`. See [sales/README.md](sales/README.md) for local-only preview, scope, and validation. The former free Snapshot positioning is superseded by the closed Option A decision. Historical issue text and dated status entries remain a record of earlier decisions.
