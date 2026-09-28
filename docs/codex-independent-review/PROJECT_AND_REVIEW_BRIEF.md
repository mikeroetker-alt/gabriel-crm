# Codex Independent Review Brief

## Assignment

Independently audit the proposed AI-driven local-business marketing stack, the attached Month 1–3 spreadsheet, and the supplied Kimi, Grok, Manus, and ChatGPT discussion records.

Do not assume that any prior conclusion is correct. Several earlier answers contained confident factual errors. Treat every pricing, plan-limit, API, model-routing, automation, and product-capability claim as unverified until checked against current official documentation or a live product test.

Do not modify the original files. Produce a separate written assessment and, only when necessary, a separately named corrected spreadsheet.

---

## Business objective

Build a largely automated, human-supervised system targeting local businesses expanding outward from Lowell, Indiana that:

- Have an active Google Business Profile.
- Have no website or a weak/inadequate website.
- Are not law firms.
- Can be reached through verified business or decision-maker email addresses.
- May benefit from a free short AI Business Spotlight video, matching branded image, and possibly a website or landing-page concept.

The owner does not want to make cold calls. The owner should mainly approve important actions, respond to qualified prospects, take booked calls, and close sales.

---

## Non-negotiable rules

- Never guess an email address.
- Use verified emails only.
- No law firms.
- No outbound contact without human approval.
- No spending, account changes, or client-facing actions without approval.
- Verify changing claims about pricing, limits, APIs, and product capabilities using current official sources.
- Keep GoHighLevel or another durable database as the system of record.
- Do not store critical workflow state only inside an AI chat or agent session.
- Treat AI-generated facts, claims, media, and recommendations as drafts requiring verification.

---

## Proposed launch architecture

### Owner
Final authority over spending, prospects, factual claims, media, outreach, pricing, and sales.

### GoHighLevel Starter
Proposed CRM and system of record for:

- Prospect records
- Pipeline stages
- Approval stages
- Workflows
- Follow-ups
- Reply monitoring
- Appointment booking
- Delivery and client records
- Custom webhook/API actions where supported

### Kimi Allegretto / K3 when actually available and explicitly selected
Provisional operational-intelligence layer for:

- Prospect research
- Batch analysis
- Website and Google-profile analysis
- Personalization
- Agent Swarm tasks
- Claw/browser work
- Draft reports, proposals, and outreach

Unresolved questions:

- Whether K3 is actually used or silently falls back to K2.6.
- Allegretto credit consumption.
- Exact relationship between “up to 300 sub-agents” and “4 concurrent Swarm subtasks.”
- Reliability of Claw/browser automation at daily operating volume.
- Whether K3 is materially better than GPT-5.6/Codex for this actual workflow.

### ChatGPT Plus
Proposed role:

- Strategy
- Independent fact-checking
- Performance analysis
- Quality control
- Writing and decision support
- Scheduled monitoring within product limits

### Codex
Proposed role:

- Technical architecture
- Integrations
- Webhook handlers
- Middleware
- Websites and landing pages
- Testing
- Debugging
- Deployment
- Ongoing maintenance

### Grok Imagine API
Proposed short-form media engine:

- Branded hero images
- Short Business Spotlight clips
- Dialogue/audio where supported

Unresolved questions:

- Exact model required for text-to-video versus image-to-video.
- Current price by model, duration, resolution, and region.
- Average reroll rate and usable-output rate.
- Temporary asset URL handling.
- Asynchronous polling and storage requirements.
- Whether SuperGrok is useful or redundant when API access is used.

### Lightweight middleware
Potential small durable service, built and maintained with Codex, for:

- Asynchronous Grok jobs
- Polling
- Retries
- Idempotency
- Logs
- Temporary URL retrieval
- Durable storage
- Complex transformations
- Any API workflow GHL cannot handle reliably

Possible implementation:

- Python/FastAPI
- Railway, Render, or comparable low-cost hosting
- Object storage for generated media

### Google Workspace
Gmail, Drive, Docs, Sheets, and business files.

### GHL Premium Prospecting
Potential local prospect discovery, GBP analysis, audit, or report component. Verify its exact current capabilities, cost, limits, and whether it replaces or duplicates outside prospecting tools.

### SuperGrok
Currently budgeted as optional. Determine whether it is redundant if the Grok API is used.

---

## Intended workflow

1. Find qualified local businesses.
2. Confirm Google Business Profile and website status.
3. Find a verified business or decision-maker email.
4. Research the company and personalize the offer.
5. Generate a branded hero image and short business video.
6. Store prospect research, verification status, and media in GHL.
7. Pause for human approval.
8. Send approved outreach.
9. Run approved follow-ups.
10. Monitor replies and score leads.
11. Book qualified appointments.
12. Prepare proposals, website concepts, SEO/AEO plans, and onboarding.
13. Produce daily and weekly performance reports.

---

## Spreadsheet to audit

File: `Final_Stack_Month_1_to_3_Projections.xlsx`

Current modeled operating costs:

- Month 1: $178.99
- Month 2: $387.99
- Month 3: $537.99
- Three-month total: $1,104.97

Month 1 assumes the current GoHighLevel trial covers the $97 Starter subscription.

### Fixed subscriptions modeled

- ChatGPT Plus/Codex: $20/month
- Kimi Allegretto: $39/month
- GHL Starter: $0 Month 1, then $97/month
- GHL Premium Prospecting: $29/month
- Google Workspace: $9.99/month
- SuperGrok: $30/month, optional

### Variable costs modeled

- Grok media and rerolls
- Email finding and validation
- Kimi/OpenAI/other API usage
- Middleware hosting and media storage
- GHL premium workflow executions
- Email/SMS/phone usage
- Technical and usage contingency

### Revenue and projected profit modeled

#### Very conservative
- Revenue: $500 / $1,250 / $1,550
- Three-month revenue: $3,300
- Three-month projected profit: $2,096.03

#### Conservative
- Revenue: $1,500 / $1,850 / $3,200
- Three-month revenue: $6,550
- Three-month projected profit: $5,248.53

#### Realistic target
- Revenue: $2,500 / $4,200 / $6,250
- Three-month revenue: $12,950
- Three-month projected profit: $11,456.53

Profit currently deducts projected operating costs and a 3% payment-processing allowance. It does not deduct income taxes, owner labor, subcontractors, refunds, chargebacks, fulfillment labor, client software, sales tax, compliance costs, or major one-time setup expenses.

---

## Required Codex review

### 1. Executive verdict
Give a direct answer:

- Is the architecture technically viable?
- Is it viable at the proposed launch budget?
- Is it realistically “largely automated”?
- Which components are essential on day one?
- Which components should be removed, postponed, replaced, or treated as optional?

### 2. Technical architecture audit
Map every workflow step to the exact system responsible for it.

For each step, identify:

- Trigger
- Required input data
- API or browser action
- State storage
- Human approval gate
- Retry behavior
- Failure path
- Logging
- Security and credential handling
- Expected cost driver

Identify any place where the current proposal incorrectly assumes that an AI model itself provides persistent scheduling, retries, state, or monitoring.

### 3. GoHighLevel audit
Verify through current official documentation:

- Starter price
- Subaccount allowance
- Basic API availability
- Location API limitations
- Custom Webhook availability
- Premium workflow charges
- Required endpoints for contacts, opportunities, workflows, appointments, custom fields, and files
- Whether Starter can support the proposed single-business launch
- Exactly which needs would force a higher GHL plan

### 4. Kimi audit
Verify through current official documentation and clearly label anything that cannot be verified:

- Current availability of K3
- Actual model routing and fallback behavior
- Allegretto price and included features
- K3, Claw, Work, Code, and Swarm access
- Credit pool and consumption rules
- “300 sub-agents” versus concurrent-task limits
- Scheduling and persistence limits
- Whether Kimi can reliably coordinate this system or should be treated only as a reasoning and execution component

### 5. OpenAI/ChatGPT/Codex audit
Verify:

- What is included in ChatGPT Plus
- Current Codex limits and capabilities
- Browser/computer-use capabilities
- Scheduled task capabilities and limitations
- Whether a separate OpenAI API budget is likely
- Which parts Codex can build versus what must run on deployed infrastructure

### 6. Grok Imagine audit
Verify:

- Exact available video models
- Text-to-video versus image-to-video support
- Maximum duration and resolution
- Current API prices
- Async job behavior
- Polling requirements
- Result URL lifetime
- Audio support
- Expected need for rerolls
- Need for post-production, captions, logo overlays, and file persistence
- Whether SuperGrok adds anything operationally necessary beyond API use

### 7. Prospecting and verified-email audit
Determine the simplest compliant source for:

- Finding local businesses with GBP but no adequate website
- Identifying a real decision maker
- Finding and validating email addresses
- Recording confidence and source evidence
- Excluding law firms
- Avoiding guessed emails

Estimate realistic coverage rates and costs. Do not relax the verified-email rule unless explicitly presenting it as a business tradeoff for the owner to decide.

### 8. Spreadsheet and projection audit
Inspect every formula and assumption in the attached workbook.

Check for:

- Formula errors
- Incorrect links
- Missing expenses
- Double counting
- Unrealistic usage assumptions
- Missing taxes or fees that should at least be disclosed
- Whether revenue targets correspond to an explicit number of offers, closes, average order value, and recurring revenue
- Whether profit is gross contribution or actual business profit
- Whether month-to-month scaling is operationally possible

Build a transparent driver model for each scenario using:

- Prospects researched
- Verified emails found
- Approved outreach sent
- Reply rate
- Qualified-lead rate
- Appointment rate
- Close rate
- Average first-sale value
- Monthly recurring revenue
- Churn/refunds
- Fulfillment cost
- Media cost per prospect
- Human minutes per prospect

When the current numbers cannot be justified, replace them with better-documented assumptions and show the effect.

### 9. Risk register
Rank the top technical, financial, operational, deliverability, compliance, and quality risks by:

- Probability
- Impact
- Detectability
- Mitigation
- Owner decision required

### 10. Five-prospect pilot design
Provide a precise, instrumented pilot plan.

Required measurements:

- Research accuracy
- Invented-claim count
- Verified-email success rate
- Kimi credits used
- Grok attempts and rerolls
- Media first-pass acceptance
- Human minutes per prospect
- API and workflow failures
- GHL record accuracy
- Total cost per approved prospect
- Outreach replies and appointments

Define pass/fail gates before the test begins.

### 11. Final deliverables
Produce:

1. A written independent assessment.
2. A corrected architecture diagram.
3. A day-one minimum stack.
4. A deferred/optional-tools list.
5. A verified monthly cost range.
6. Revised Month 1–3 projections.
7. A list of every claim that still requires a live product test.
8. A direct final verdict: proceed, revise, or stop.

Do not give promotional language. Clearly separate:

- Verified official fact
- Reasonable inference
- Unverified claim
- Live-test requirement
