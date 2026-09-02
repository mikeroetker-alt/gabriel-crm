# Critical CRM audit evidence — deployed source c4739219870c99a671814491a531de468be76cc8

Source package: sanitized Manus audit ZIP, SHA-256 `bd0b2082e7b1c59fb064a1a92bec09dd102af606e2257b25c8132649311dfd1e`.
Manus checkpoint: `c4739219`.
Live app: `https://outreachapp-3jjmc6fg.manus.space/`.

This file records exact sanitized source excerpts from the verified package for independent Codex review. No production records, credentials, cookies, tokens, or private prospect data are included.

## Finding 1 — AgentMail failed-event retry can be suppressed as a duplicate

Source: `server/db.ts`, function `processAgentMailEvent`.

```ts
export async function processAgentMailEvent(event: AgentMailWebhookEvent) {
  const db = await requireDb();
  const eventId = event.event_id;
  const eventType = event.event_type;
  if (!eventId || !eventType) throw new Error("AgentMail event_id and event_type are required");
  const seen = await db.select().from(externalEvents).where(and(eq(externalEvents.provider, "AgentMail"), eq(externalEvents.providerEventId, eventId))).limit(1);
  if (seen.length) return { duplicate: true };
  await db.insert(externalEvents).values({ provider: "AgentMail", providerEventId: eventId, eventType, status: "Processed", detail: serialized(event) } as any);

  const data = event.message ?? event.send ?? event.delivery ?? event.bounce ?? event.complaint ?? event.reject ?? {};
  const contact = await findContactForAgentMailEvent(event);
  const outbound = await updateOutboundByProviderMessage(data.message_id, {});
  const timestamp = parseDate(data.timestamp);

  try {
    // event processing branches ...
  } catch (error) {
    const message = error instanceof Error ? error.message : "AgentMail webhook processing failed";
    await db.update(externalEvents).set({ status: "Failed", detail: message } as any).where(and(eq(externalEvents.provider, "AgentMail"), eq(externalEvents.providerEventId, eventId)));
    if (contact) await createIntegrationException({ provider: "AgentMail", contactId: contact.id, outboundItemId: outbound?.id, failureReason: message });
    throw error;
  }
  return { duplicate: false, contactId: contact?.id ?? null };
}
```

The event row is inserted before processing. On failure it is changed to `Failed`. A later retry with the same `event_id` hits `if (seen.length) return { duplicate: true };` regardless of status, so the retry is not reprocessed. This is a source-confirmed failure/retry idempotency defect unless another recovery path outside this function compensates for it.

Relevant schema excerpt from `drizzle/schema.ts`:

```ts
export const externalEvents = mysqlTable("external_events", {
  id: int("id").autoincrement().primaryKey(),
  provider: varchar("provider", { length: 64 }).notNull(),
  providerEventId: varchar("providerEventId", { length: 512 }).notNull(),
  eventType: varchar("eventType", { length: 128 }).notNull(),
  processedAt: timestamp("processedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["Processed", "Ignored", "Failed"]).default("Processed").notNull(),
  detail: text("detail"),
}, (table) => [
  uniqueIndex("external_events_provider_event_uq").on(table.provider, table.providerEventId),
]);
```

## Finding 2 — unsubscribe GET mutates suppression state and is vulnerable to link scanners

Source: `server/crmIntegrationRoutes.ts`.

```ts
app.get("/unsubscribe/:token", async (req, res) => {
  const signature = typeof req.query.sig === "string" ? req.query.sig : "";
  try {
    await consumeUnsubscribeToken({ token: req.params.token, signature, source: "CRM unsubscribe link" });
    unsubscribePage(res, "You have been unsubscribed", "Your email address has been recorded as do not contact. Future automated outreach is blocked.");
  } catch {
    unsubscribePage(res, "This unsubscribe link is unavailable", "The link may have already been used or expired. If you still need help, reply directly with “unsubscribe.”", 400);
  }
});

app.post("/unsubscribe/:token", express.urlencoded({ extended: false }), async (req, res) => {
  const signature = typeof req.query.sig === "string" ? req.query.sig : "";
  const oneClick = String(req.body?.["List-Unsubscribe"] ?? "") === "One-Click";
  if (!oneClick) return res.status(400).send("Invalid one-click unsubscribe request");
  try {
    await consumeUnsubscribeToken({ token: req.params.token, signature, source: "CRM one-click unsubscribe" });
    return res.status(204).send();
  } catch {
    return res.status(400).send("Unsubscribe request unavailable");
  }
});
```

The GET route directly calls `consumeUnsubscribeToken`, so any security scanner, email prefetcher, or link checker that follows the unsubscribe URL can mutate CRM suppression state without an intentional user action. The POST one-click route is the safer mutating path, but the GET must be made non-mutating if link-scanner safety is required.

## Related AgentMail webhook endpoint

Source: `server/crmIntegrationRoutes.ts`.

```ts
app.post("/api/integrations/agentmail/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const secret = process.env.AGENTMAIL_WEBHOOK_SECRET;
  if (!secret) return res.status(503).send("AgentMail webhook integration is not configured");
  try {
    const verified = new Webhook(secret).verify(req.body, req.headers as Record<string, string>);
    await processAgentMailEvent(verified as any);
    return res.status(204).send();
  } catch (error) {
    console.error("[AgentMail] Webhook rejected or processing failed", error);
    return res.status(400).send("Invalid AgentMail webhook");
  }
});
```

A transient processing exception returns HTTP 400, so AgentMail may retry. Because the failed event row already exists, the retry behavior above can then incorrectly return as duplicate.

## Independent-review request

Codex should independently determine:
1. Whether the failed-event retry behavior above is a material failure of AT-09 and/or other send-safety controls.
2. Whether the mutating GET unsubscribe behavior is a material failure of AT-04 under link-scanner conditions.
3. The smallest safe code fixes and regression tests required before the no-send dry run or M1-B1-20 live pilot.

Review only. No production writes, outreach, deployment, credential changes, or architecture substitutions.