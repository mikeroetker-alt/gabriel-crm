export const pilotStates = Object.freeze([
  "requested", "business_verified", "facts_approved", "evidence_imported",
  "report_ready", "mike_approved", "delivery_ready", "delivered", "cancelled"
]);

const transitions = {
  requested: ["business_verified", "cancelled"],
  business_verified: ["facts_approved", "cancelled"],
  facts_approved: ["evidence_imported", "cancelled"],
  evidence_imported: ["report_ready", "cancelled"],
  report_ready: ["mike_approved", "cancelled"],
  mike_approved: ["delivery_ready", "cancelled"],
  delivery_ready: ["delivered", "cancelled"],
  delivered: ["cancelled"],
  cancelled: [],
};

const requirements = {
  business_verified: ["businessVerificationRef"],
  facts_approved: ["factApprovalRef"],
  evidence_imported: ["evidenceManifestRef"],
  report_ready: ["reportRef", "headlineTraceabilityConfirmed"],
  mike_approved: ["mikeApprovalRef"],
  delivery_ready: ["recipientConfirmed", "deliveryDisclosureVersion"],
  delivered: ["deliveryReceiptRef"],
};

export function advancePilot(record, nextState, evidence = {}) {
  if (!record || !pilotStates.includes(record.state)) throw new TypeError("Invalid pilot record");
  if (!transitions[record.state].includes(nextState)) {
    return { ...record, blocked: true, blockReason: "INVALID_TRANSITION" };
  }
  const missing = (requirements[nextState] ?? []).filter(key => evidence[key] !== true
    && !(typeof evidence[key] === "string" && evidence[key].trim()));
  if (missing.length) return { ...record, blocked: true, blockReason: "MISSING_EVIDENCE", missing };
  if (record.openException === true && nextState !== "cancelled") {
    return { ...record, blocked: true, blockReason: "OPEN_EXCEPTION" };
  }
  return { ...record, ...evidence, state: nextState, blocked: false, blockReason: null,
    history: [...(record.history ?? []), { from: record.state, to: nextState,
      at: evidence.at ?? new Date().toISOString() }] };
}

export function outreachEligibility(prospect) {
  const checks = {
    verifiedEmail: prospect.emailVerification === "verified",
    namedDecisionMaker: typeof prospect.decisionMaker === "string" && prospect.decisionMaker.trim() !== "",
    sourceUrl: /^https:\/\//.test(prospect.sourceUrl ?? ""),
    unsuppressed: prospect.suppressed === false,
    noOpenException: prospect.openException !== true,
    mikeApproved: typeof prospect.mikeApprovalRef === "string" && prospect.mikeApprovalRef.trim() !== "",
  };
  return { eligible: Object.values(checks).every(Boolean), checks };
}

