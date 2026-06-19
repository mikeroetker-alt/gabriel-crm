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

## What the Current App Does

The root command center at `/gabriel-crm/` now includes:

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

## Suggested Next Codex Task

Build a dedicated `/tools/visibility-snapshot/` public-facing static page that lets Mike manually enter a business and produce a clean printable snapshot without exposing the internal command center.

Requirements:

- Keep it static and GitHub Pages compatible.
- No API calls.
- No login.
- No public access to the internal lead database.
- Output should be printable and copyable.
- Include clear Gabriel Impact Group branding.
- Do not include Gabriel Faith Alliance nonprofit language.
- Do not collect or transmit form data.

## Future Codex Tasks

1. Add public printable visibility snapshot page.
2. Add public request form placeholder with manual instructions, not live sending.
3. Add client spotlight page template.
4. Add offer pages for video upgrades, local visibility, SEO/AEO, reputation, GHL setup, and funding readiness.
5. Add a test checklist for public links, mobile layout, and no accidental command-center exposure.
