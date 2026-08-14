# OutreachAI Bridge — 2026-08-14

Purpose: eliminate the ChatGPT ↔ GitHub ↔ Codex handoff loop by placing sanitized, verifiable OutreachAI artifacts where the ChatGPT Codex Connector can read them.

## Confirmed platform

Live app URL: `https://outreachapp-yywiz6tr.manus.space`

A saved probe script tied to that exact URL records these visible pipelines:

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

## Files in this bridge

- `scrape_outreach.py` — read-only probe for likely REST/tRPC contact endpoints on the exact OutreachAI app.
- `import_contacts.mjs` — sanitized importer previously used to map an OutreachAI contact export into a SQL leads table with duplicate checks.

No API keys, OAuth tokens, database credentials, prospect exports, or private contact records are committed here.

## Important boundary

These files are evidence associated with the confirmed OutreachAI platform and prior migration work. They are **not** claimed to be the complete live Manus source tree. Codex must not invent missing production behavior.

## Codex task

1. Treat these files as the first machine-readable bridge to the confirmed OutreachAI system.
2. Inspect these artifacts plus reachable repository history.
3. Produce an updated MASTER CRM READINESS REPORT distinguishing:
   - verified from these artifacts;
   - verified from repository history;
   - still unknown because the full Manus source/database is not present.
4. Execute the next safe shared-environment build step: convert the sanitized mappings into fixtures and implement a strictly read-only contract test covering response shape, stage normalization, pagination, stable IDs, and aggregate counts, without including private records or mutation procedures.
5. Prefer reusing existing Gabriel CRM components and these OutreachAI mappings over building another CRM from scratch.
6. Do not send outreach, deploy to production, change credentials, delete data, or expose prospect/private data.

## Owner direction

The owner should not be used as a message courier between ChatGPT and Codex. Use GitHub issues/PRs as the shared handoff channel from this point forward.