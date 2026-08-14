# OutreachAI authenticated contract gaps

The bridge now contains a synthetic-only translation layer based on sanitized structural metadata. No credentials, cookies, tokens, or prospect values are stored here.

## Verified structural metadata

- Read protocol/method: HTTP `GET`.
- Observed route: `/api/trpc/contacts.list`.
- Contacts array path: `result.data.json.contacts`.
- Total path: `result.data.json.total`.
- Observed contact workflow field: `status`; the internal bridge maps it to `stage`.
- `/api/contacts`, `/api/leads`, and `/api/prospects` were observed returning the HTML SPA shell rather than the contacts JSON contract.
- No `page.nextCursor` or `countsByPipeline` structure was observed in the sanitized discovery.

The unauthenticated tRPC route unexpectedly returned a production contact during discovery. Probing stopped immediately. No production field values were displayed, saved, or committed. Do not repeat live probing merely to fill the gaps below.

## Still unknown and requiring an authorized sanitized capture

- exact query/input names and types for page size, cursor/offset, pipeline, status/stage, sort order, and filters;
- default and maximum page size, if pagination exists;
- pagination semantics, terminal-page signal, ordering guarantees, and behavior when data changes between pages;
- stable contact-ID type, uniqueness scope, nullability, and merge/export persistence;
- complete allowed values/null behavior for pipeline and status plus any normalization performed by the live client;
- whether any aggregate counts are returned by a separate route or query and how they relate to the 1,508 Contacts-page count and 1,395 Dashboard count;
- sanitized error envelopes for unauthenticated, unauthorized, invalid-input, rate-limited, and server-error responses;
- rate-limit headers/reset units, retry guidance, cache headers/ETags, and schema/API version metadata;
- tenant/account scoping and count/deduplication semantics needed to reconcile the 113-record difference.

## Capture rule

Any future authorized capture must contain only field names, types, JSON paths, non-secret headers, status codes, count metadata, and synthetic/redacted examples. Do not capture or commit authorization material, private prospect values, or full production payloads.

Until that capture exists, the adapter must remain GET-only and must reject unverified pagination/filter options rather than inventing production behavior.
