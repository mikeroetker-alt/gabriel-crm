# AI Visibility product prototype

Static, synthetic-only implementation for GitHub Issue #22.

## Preview

Serve the repository root with any static HTTP server, then open:

`/prototypes/ai-visibility/`

The top navigation exposes four review assets:

1. Free Local AI Visibility Snapshot.
2. Monthly Client Dashboard.
3. Work Completed This Month ledger.
4. Local Business Spotlight prototype.

The Monthly Dashboard scenario selector demonstrates positive movement, little/no external movement, and a factual/provider exception. Use **Print report** for a print-friendly view.

## Data status

Every business, observation, citation, source, competitor, engagement event, and activity record is synthetic. The prototype makes no network requests and sends no outreach. It does not connect to the live CRM or any observation provider.

The provider-neutral entities and interface are documented in [`docs/AI_VISIBILITY_DATA_CONTRACT.md`](../../docs/AI_VISIBILITY_DATA_CONTRACT.md).

## Validation

From the repository root:

```sh
node --test
```

The tests cover deterministic scenarios, flat external movement with meaningful controlled work, factual-conflict blocking, provider unavailability, evidence placeholders, and absence of live CRM/private contact data.

