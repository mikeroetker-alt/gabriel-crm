# OutreachAI authenticated contract gaps

The adapter and fixture are deliberately synthetic and read-only. Before replacing them with a sanitized authenticated capture, record the following metadata without committing credentials, cookies, tokens, or contact fields:

- final origin, path, protocol (REST, tRPC, or other), HTTP method, and non-secret content negotiation headers;
- query/input names and types for page size, cursor/offset, pipeline, stage, sort order, and filters;
- response status and content type plus the exact JSON paths to contacts, total, page size, next/previous cursor, and aggregate counts;
- pagination semantics: maximum/default page size, cursor opacity, terminal-page signal, ordering guarantees, and behavior when data changes between pages;
- stable contact-ID field, type, uniqueness scope, nullability, and whether it persists across export/import or merges;
- pipeline and stage fields, their allowed values, null behavior, and any normalization performed by the live client;
- sanitized error envelopes for unauthenticated, unauthorized, invalid-input, rate-limited, and server-error responses;
- rate-limit headers and reset units, retry guidance, cache headers/ETags, and any schema/API version headers;
- whether aggregate counts describe the filtered result set or the full account and whether they are computed atomically with the returned page.

Capture only field names, types, paths, headers, status codes, and synthetic/redacted examples. Do not capture or commit authorization material, private prospect values, or full production payloads. Live verification must remain a read-only `GET`; the adapter intentionally exposes no mutation operation.
