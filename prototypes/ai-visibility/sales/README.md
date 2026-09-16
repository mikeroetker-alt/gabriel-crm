# AI Visibility Growth — staging sales page

Coordination: [Issue #22](https://github.com/mikeroetker-alt/gabriel-crm/issues/22). Reuses [PR #23](https://github.com/mikeroetker-alt/gabriel-crm/pull/23), head `5ac57a9b381897f76ea65edcf1fb5d823807547b`.

Mike explicitly authorized this staging build in the current continuation request. Option A is closed: $197/month Growth is primary; $25 one-time Snapshot is a limited secondary diagnostic. The [formal consensus](https://github.com/mikeroetker-alt/gabriel-crm/issues/22#issuecomment-5702721656) records the seven-calendar-day credit test after Snapshot delivery. Earlier review-only and free-Snapshot positioning do not govern this authorized build.

## Local preview

From this branch's repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

On Windows with the Python launcher, use `py -m http.server 8765 --bind 127.0.0.1`.

Open `http://127.0.0.1:8765/prototypes/ai-visibility/sales/` in your local browser. Keep the terminal running. Stop the server with Ctrl+C when finished. No build or package installation is required. Direct `file://` opening is intentionally unsupported.

This is a local staging page, not a hosted preview URL. Do not deploy it as part of review.

## What to review

1. Hero and main offer: Growth is the dominant $197/month CTA. Inspect the finite monthly scope and exclusions.
2. Evidence: the shared PR #23 fixture shows 29 of 120 mentions in both comparison windows. The page names the synthetic business, market, query panel, observation window and capture date. Work completed, subsequent observations and unresolved facts are separate.
3. Click **Preview Growth enrollment**. It opens an informational modal. It collects nothing, makes no reservation and creates no enrollment. Escape or **Return to the page** closes the native dialog.
4. Open **Not ready for monthly service?** below Growth. Only then does the $25 Snapshot offer appear. Its strict scope and seven-day, manually administered credit test are disclosed. The first Growth payment after the full credit would be $172; subsequent payments remain $197/month. No credit automation exists.
5. Click **Preview the Snapshot option**. This is also an informational modal, not a purchase or subscription.
6. Follow the demo links to the reused Snapshot, monthly dashboard, work ledger and blocked Spotlight. The dashboard opens with the flat scenario. Its selector still provides positive and blocked examples. The blocked scenario suppresses current metrics instead of treating retained values as new data.
7. Check desktop and phone layouts, keyboard navigation, focus return from dialogs, the collapsed secondary offer, disclosures, and print output.

## Reuse and boundaries

- `../components.js` extracts the shared evidence cards, activity entries, disclosures and observation context; both report and sales views consume them.
- `../fixtures.js` remains synthetic and provider-neutral. No real-business records were added. A synthetic query-panel identifier supplies the missing comparison context.
- The existing report views and provider/data contracts remain in place. There is no new implementation of the dashboard or ledger.
- The initial HTML hides the sales body and disables preview actions. Only HTTP(S) loopback hosts (`localhost`, `127.0.0.1`, `[::1]`) enable the informational UI. There is no query-string activation switch. This guard is defense in depth, not authentication or permission to publish these files.
- Both entry documents are `noindex, nofollow, noarchive`. Content Security Policy prohibits connections, forms, frames, objects and workers. Only local static modules/styles are loaded; the prototype's remote Google Fonts dependency was removed.
- No form, checkout, payment SDK, CRM hook, provider call, analytics, storage write, outreach, deployment configuration or production route was added.
- There is no $49/$79 or other lower monthly tier. Rendered prototype copy no longer advertises a free Snapshot. Historical issues and dated status entries are retained as history.

## Verification

```sh
npm test
node --check prototypes/ai-visibility/app.js
node --check prototypes/ai-visibility/components.js
node --check prototypes/ai-visibility/sales/sales.js
git diff --check
```

The Node suite passes 24 tests, including eight sales-page/shared-component tests. These exercise the real JavaScript entry modules against a minimal DOM boundary, assert no network/storage effects, verify the hosting guard, and check all four reused report views and the provider-outage path. They are not a browser/layout test. This static project has no separate build, lint or type-check configuration.

Browser QA is **pending**: this session's Cloud Browser rejected the loopback URL with `ERR_BLOCKED_BY_CLIENT` and an explicit URL-policy block. No alternate browser, public host, tunnel or deployment was used to bypass it. Responsive CSS is implemented; visual rendering, mobile overflow, native dialog keyboard behavior and print layout still require the local review above. No screenshots are claimed.

## Next gate

Review this draft branch against PR #23. Complete local browser QA and address feedback before considering a merge. PR #23 itself is still open and was reported non-mergeable against main when inspected; this stacked change does not resolve or merge that unrelated branch divergence.

Mike reaffirmed during this build that he must review the page, complete the optimization review, and explicitly approve launch first. No merge or launch is authorized. Any live checkout, payment, intake, CRM write, provider access, outreach, deployment or production change requires Mike's separate approval. Provider feasibility, evidence rights and coverage, final cancellation/refund/retention terms, and pilot capacity must be confirmed before activation. The pricing decision is not reopened by these activation gates.
