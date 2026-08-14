# OutreachAI Bridge — 2026-08-14

Purpose: eliminate the ChatGPT ↔ GitHub ↔ Codex handoff loop by placing sanitized, verifiable OutreachAI artifacts where both systems can inspect the same repository state.

## Confirmed platform

Live app URL: `https://outreachapp-yywiz6tr.manus.space`

Visible pipelines previously verified from the authenticated UI:

- HVAC
- Bank
- DAC
- Personal Dev
- Plumbing
- Electrical
- Restaurants
- Auto Repair
- Trucking
- Roofing
- Healthcare
- Landscaping
- Retail
- Construction

A saved import bridge additionally supports `Banks` and `Brokers` as normalized trade values.

## Sanitized read-contract findings

Value-free discovery established the following structure without committing or displaying prospect values:

- `/api/contacts`, `/api/leads`, and `/api/prospects` return the HTML SPA shell rather than the contacts JSON contract.
- The observed read route is `GET /api/trpc/contacts.list`.
- The observed response path is `result.data.json.contacts` with `result.data.json.total`.
- Observed contact metadata uses `status`; the internal bridge normalizes that verified field to `stage`.
- No live `page.nextCursor`, `countsByPipeline`, or pagination/filter input contract has been verified.
- Because the unauthenticated route unexpectedly returned a production contact, live probing stopped immediately. No production contact values were displayed, saved, or committed, and this repository work must not call that live endpoint again without an authorized sanitized capture process.

## Files in this bridge

- `scrape_outreach.py` — historical read-only probe template. Do not run it against the live app as part of current repository-only work.
- `import_contacts.mjs` — sanitized transformation-only mapping helper; no database writes.
- `outreachai_adapter.mjs` — dependency-injected, GET-only adapter targeting the verified tRPC route and translating the sanitized tRPC shape into the internal contact shape.
- `fixtures/contacts-page.synthetic.json` — legacy synthetic internal envelope containing no prospect data.
- `fixtures/contacts-list-trpc.synthetic.json` — synthetic tRPC envelope matching only the verified structural metadata.
- `fixtures/authorized-contract-capture.template.json` — metadata-only template for a future authorized sanitized contract capture.
- `AUTHENTICATED_CONTRACT_GAPS.md` — verified metadata and the remaining contract details that still require an authorized sanitized capture.
- `RECONCILIATION_PLAN.md` — aggregate-only plan for resolving the 1,508-vs-1,395 count discrepancy without inspecting prospect values.

No API keys, OAuth tokens, database credentials, prospect exports, or private contact records are committed here.

## Important boundary

These files are evidence associated with the confirmed OutreachAI platform and prior migration work. They are **not** claimed to be the complete live Manus source tree. Do not invent missing production behavior.

The adapter intentionally does not implement unverified pagination, filters, cursors, aggregate counts, writes, or outreach actions. Unsupported options are rejected before any request is made.

## Current safe task

1. Use synthetic fixtures only to harden the tRPC translation contract.
2. Preserve stable IDs, pipeline normalization, and `status` → internal `stage` translation.
3. Keep unverified pagination/filter/aggregate behavior disabled rather than guessing.
4. Continue repository-only tests, documentation, reconciliation preparation, and privacy guardrails without calling the live endpoint.
5. Do not send outreach, deploy to production, change credentials, delete data, or expose prospect/private data.

## Owner direction

The owner should not be used as a message courier between ChatGPT and Codex. Use GitHub issues/PRs as the shared handoff channel from this point forward.
