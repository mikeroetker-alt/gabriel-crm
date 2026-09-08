const requiredTokens = ["businessName", "senderName", "snapshotUrl", "unsubscribeUrl"];

function requireFields(values) {
  const missing = requiredTokens.filter(key => typeof values?.[key] !== "string" || !values[key].trim());
  if (missing.length) throw new TypeError(`Missing outreach fields: ${missing.join(", ")}`);
}

export function renderInitialSnapshotMessage(values) {
  requireFields(values);
  const subject = `A private AI visibility snapshot for ${values.businessName}`;
  const text = `Hi ${values.decisionMaker ?? "there"},

We sampled a defined set of questions people may ask AI assistants when choosing an HVAC company and prepared a private snapshot for ${values.businessName}.

The snapshot shows where the business was and was not observed in that sample, the comparison set, and the source evidence available for each observation. It is a sampled measurement, not a universal ranking, and it does not promise leads or placement.

View the private snapshot: ${values.snapshotUrl}

If you would like, reply and I can walk you through it. There is no obligation.

${values.senderName}

Stop future email: ${values.unsubscribeUrl}`;
  return { subject, text };
}

export function renderSnapshotFollowup(values) {
  requireFields(values);
  const subject = `Re: AI visibility snapshot for ${values.businessName}`;
  const text = `Hi ${values.decisionMaker ?? "there"},

I wanted to make sure the private snapshot reached you: ${values.snapshotUrl}

It records a fixed sample of AI answers and the evidence behind the result. If the sample is useful, I can explain what is controllable, what is outside anyone's control, and what we would measure next.

${values.senderName}

Stop future email: ${values.unsubscribeUrl}`;
  return { subject, text };
}

export function renderServiceInvitation(values) {
  requireFields(values);
  const subject = `Next steps for ${values.businessName}'s AI visibility`;
  const text = `Hi ${values.decisionMaker ?? "there"},

Based on the private snapshot, we can monitor the same defined question set, maintain an evidence-backed work ledger, and provide a monthly report for the proposed $197/month service.

The service cannot guarantee mentions, rankings, citations, leads, traffic, or revenue. We only recommend proceeding when the measurement is useful to you and the included work is clear.

Review the snapshot: ${values.snapshotUrl}

Reply if you want the exact monthly scope and cancellation terms.

${values.senderName}

Stop future email: ${values.unsubscribeUrl}`;
  return { subject, text };
}

