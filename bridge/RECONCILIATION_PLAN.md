# OutreachAI count reconciliation plan

## Verified aggregate observations

Authenticated UI observations previously recorded for the same OutreachAI account:

- Contacts page: **1,508** contacts.
- Dashboard: **1,395** total contacts.
- Difference: **113**.
- Dashboard high-priority count: **113**.

The numerical equality between the 113-record difference and the 113 high-priority count is **not evidence of causation**. Do not treat it as an explanation without source-level metadata.

## Read-contract findings relevant to reconciliation

Sanitized discovery established that the contacts read route is `GET /api/trpc/contacts.list` and that the observed response contains `result.data.json.contacts` plus `result.data.json.total`. No verified pagination metadata or pipeline aggregate object was observed.

Further live probing is intentionally blocked because the route unexpectedly exposed a production contact. Reconciliation must proceed from metadata-only evidence, not additional prospect-value access.

## Hypotheses to test once authorized metadata is available

1. Contacts page and Dashboard use different filters or lifecycle states.
2. One count is cached or refreshed on a different schedule.
3. One surface deduplicates contacts differently.
4. One count excludes pending/imported/suppressed/archived records.
5. The two surfaces use different backing queries or count semantics.
6. Tenant/account scoping differs between the two requests.

These are hypotheses only.

## Minimum metadata needed to resolve the discrepancy

Capture both surfaces as close together in time as practical, with prospect values removed, and record only:

- route/procedure name and method;
- request filter/input field names and types;
- response count field paths and values;
- timestamps and cache/version headers;
- tenant/account scope metadata;
- lifecycle/exclusion rules if exposed by source/schema;
- deduplication/count semantics;
- aggregate-only breakdowns by pipeline/status if a safe aggregate endpoint exists.

Do not capture contact names, emails, phones, addresses, message content, credentials, cookies, tokens, or full contact payloads.

## Decision rule

Do not change CRM counts, merge records, delete records, or alter production behavior merely to make the two totals agree. First establish why the surfaces differ from metadata or source-level evidence.
