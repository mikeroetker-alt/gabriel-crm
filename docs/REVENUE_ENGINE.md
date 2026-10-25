# Gabriel Growth Engine — Revenue Engine Workflow

This repository supports the Gabriel Impact Group paid-services workflow. It is intentionally separate from Gabriel Faith Alliance, the nonprofit / charitable / educational arm.

## Purpose

The app is a local-first command center for moving warm or manually researched prospects through this simple revenue path:

1. Free business spotlight video or free visibility snapshot.
2. Human-approved warm outreach.
3. Paid video, visibility, reputation, website trust, SEO/AEO, or GoHighLevel setup offer.
4. Business funding readiness only as a back-end conversation when trust exists and the business has a real need.

## Hard Rules

- Static / GitHub Pages compatible.
- Local-first storage using browser localStorage.
- No paid APIs.
- No email auto-sending.
- No Facebook / Meta auto-posting.
- No scraping that violates terms.
- No cold-blast system.
- No law firm targeting.
- No guessed emails.
- No funding promises.
- Human approval required before outreach.
- Do not mix Gabriel Faith Alliance nonprofit language into Gabriel Impact Group paid-service conversion.

## Current Pages

- `/gabriel-crm/` — internal revenue command center.
- `/gabriel-crm/home/` — public funnel page.
- `/gabriel-crm/tools/` — tools landing page.
- `/gabriel-crm/tools/visibility-snapshot/` — public printable visibility snapshot tool.

## What the Current App Does

The root command center at `/gabriel-crm/` includes:

- Prospect database.
- Priority queue.
- Relationship warmth scoring.
- Visibility need scoring.
- Funding readiness screen.
- Revenue priority score.
- Recommended next action.
- Visibility Snapshot generator.
- Funding Readiness generator with disclaimer.
- Human-approved outreach draft generator.
- Proposal / next-step generator.
- CSV export.
- JSON backup / restore.
- CSV import.
- Demo local-business leads.

The public tool at `/gabriel-crm/tools/visibility-snapshot/` includes:

- Manual business inputs.
- Manual visibility observations.
- Opportunity scoring.
- Printable output.
- Copyable output.
- No API calls.
- No login.
- No data collection or transmission.

## How Mike Uses It Daily

1. Add a warm or researched prospect.
2. Fill in business, relationship/source, website, local area, visibility observations, and funding-readiness details if known.
3. Select the prospect from the priority queue.
4. Generate a Visibility Snapshot.
5. Generate a draft outreach message.
6. Review and approve manually before sending anywhere.
7. If the prospect responds or already has a real need, generate a simple proposal.
8. Only discuss funding after trust exists and there is a clear business need.

## Funding Disclaimer

All funding output must preserve this concept:

> This is a preliminary readiness screen only, not an approval, offer, promise, quote, or guarantee.

## Completed Codex / Assistant Build Steps

- Built the internal Revenue Command Center at the root app.
- Added `docs/REVENUE_ENGINE.md` to preserve operating rules and next steps.
- Added `/tools/visibility-snapshot/` as a public printable static snapshot generator.
- Added `/tools/` as a simple landing page for current and future tools.

## Suggested Next Codex Task

Build a dedicated `/client-spotlight-template/` static page that lets Mike create a clean client spotlight draft for an approved local business.

Requirements:

- Static and GitHub Pages compatible.
- No API calls.
- No login.
- No automatic posting.
- No data collection or transmission.
- Output should be printable and copyable.
- Include Gabriel Impact Group branding only.
- Do not include Gabriel Faith Alliance nonprofit language.
- Include sections for business story, services, service area, trust points, photos/video placeholder notes, local SEO terms, and manual share draft.

## Future Codex Tasks

1. Add client spotlight page generator/template.
2. Add public request form placeholder with manual instructions, not live sending.
3. Add offer pages for video upgrades, local visibility, SEO/AEO, reputation, GHL setup, and funding readiness.
4. Add a test checklist for public links, mobile layout, and no accidental command-center exposure.
5. Add a simple README link map for all public GitHub Pages routes.
