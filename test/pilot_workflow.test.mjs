import test from "node:test";
import assert from "node:assert/strict";
import { routeModel, recordModelOutcome } from "../config/model-routing.mjs";
import { advancePilot, outreachEligibility } from "../pilot/workflow.mjs";
import { normalizeOtterlyExport, createEvidenceManifest } from "../pilot/otterly-import.mjs";

const models = [
  { id: "cheap-a", provider: "a", enabled: true, approved: true, validationStatus: "passed",
    qualityScore: 82, costPerMillionTokens: 0.3,
    capabilities: ["research", "extraction", "structured_output"] },
  { id: "strong-b", provider: "b", enabled: true, approved: true, validationStatus: "passed",
    qualityScore: 94, costPerMillionTokens: 2,
    capabilities: ["research", "extraction", "structured_output"] },
];

test("routing selects quality within budget and a different-provider critic", () => {
  assert.deepEqual(routeModel({ role: "researchQualification", candidates: models,
    maxCostPerMillionTokens: 3, requireIndependentReview: true }), {
    status: "ready", role: "researchQualification", primary: "strong-b", fallback: "cheap-a",
    critic: "cheap-a", policyVersion: "1.0"
  });
});

test("routing blocks when no validated model meets the budget", () => {
  assert.equal(routeModel({ role: "researchQualification", candidates: models,
    maxCostPerMillionTokens: 0.1 }).status, "blocked");
});

test("model outcomes require cost, latency and recognized result", () => {
  const result = recordModelOutcome({ taskId: "T1", role: "researchQualification", modelId: "cheap-a",
    provider: "a", costUsd: 0.02, latencyMs: 50, result: "accepted",
    recordedAt: "2026-09-08T00:00:00Z" });
  assert.equal(result.costUsd, 0.02);
  assert.throws(() => recordModelOutcome({ role: "researchQualification" }), TypeError);
});

test("pilot cannot skip states or advance without required evidence", () => {
  const base = { id: "P1", state: "requested", history: [], openException: false };
  assert.equal(advancePilot(base, "report_ready").blockReason, "INVALID_TRANSITION");
  assert.equal(advancePilot(base, "business_verified").blockReason, "MISSING_EVIDENCE");
  assert.equal(advancePilot(base, "business_verified", {
    businessVerificationRef: "SYNTHETIC" }).state, "business_verified");
});

test("open exceptions block pilot advancement", () => {
  const result = advancePilot({ id: "P1", state: "facts_approved", history: [], openException: true },
    "evidence_imported", { evidenceManifestRef: "SYNTHETIC" });
  assert.equal(result.blockReason, "OPEN_EXCEPTION");
});

test("outreach requires verification, evidence, suppression check and Mike approval", () => {
  const prospect = { emailVerification: "verified", decisionMaker: "Synthetic Owner",
    sourceUrl: "https://example.invalid/source", suppressed: false, openException: false,
    mikeApprovalRef: "SYNTHETIC-APPROVAL" };
  assert.equal(outreachEligibility(prospect).eligible, true);
  assert.equal(outreachEligibility({ ...prospect, suppressed: true }).eligible, false);
  assert.equal(outreachEligibility({ ...prospect, mikeApprovalRef: "" }).eligible, false);
});

test("outreach blocks unknown or malformed exception status", () => {
  const prospect = { emailVerification: "verified", decisionMaker: "Synthetic Owner",
    sourceUrl: "https://example.invalid/source", suppressed: false,
    mikeApprovalRef: "SYNTHETIC-APPROVAL" };
  assert.equal(outreachEligibility(prospect).eligible, false);
  for (const openException of [undefined, null, true, "false", "true", 0, 1, ""]) {
    assert.equal(outreachEligibility({ ...prospect, openException }).eligible, false);
  }
  assert.equal(outreachEligibility({ ...prospect, openException: false }).eligible, true);
});

test("pilot confirmations require booleans and references require text", () => {
  for (const [state, next, reference, confirmation] of [
    ["evidence_imported", "report_ready", "reportRef", "headlineTraceabilityConfirmed"],
    ["mike_approved", "delivery_ready", "deliveryDisclosureVersion", "recipientConfirmed"],
  ]) {
    const record = { state, openException: false };
    for (const invalid of [false, "false", "true", 1, null, undefined]) {
      assert.equal(advancePilot(record, next, { [reference]: "SYNTHETIC", [confirmation]: invalid }).blocked, true);
    }
    assert.equal(advancePilot(record, next, { [reference]: true, [confirmation]: true }).blocked, true);
    assert.equal(advancePilot(record, next, { [reference]: "SYNTHETIC", [confirmation]: true }).state, next);
  }
});

test("unknown exception status blocks progress but permits cancellation", () => {
  for (const openException of [undefined, null, "false", 0]) {
    const record = { state: "requested", openException };
    assert.equal(advancePilot(record, "business_verified", { businessVerificationRef: "SYNTHETIC" }).blockReason,
      "EXCEPTION_STATUS_UNKNOWN");
    assert.equal(advancePilot(record, "cancelled").state, "cancelled");
  }
});

test("transition evidence cannot replace identity, suppression, or later approval", () => {
  const record = { id: "SYNTHETIC-1", state: "requested", suppressed: true, openException: false };
  const result = advancePilot(record, "business_verified", { businessVerificationRef: "SYNTHETIC",
    id: "OTHER", suppressed: false, openException: true, mikeApprovalRef: "INJECTED", state: "delivered" });
  assert.equal(result.id, record.id);
  assert.equal(result.suppressed, true);
  assert.equal(result.openException, false);
  assert.equal(result.mikeApprovalRef, undefined);
  assert.equal(result.state, "business_verified");
  assert.equal(record.state, "requested");
});

test("malformed and inherited evidence cannot advance a pilot", () => {
  const record = { state: "requested", openException: false };
  for (const evidence of [null, [], "SYNTHETIC"]) {
    assert.equal(advancePilot(record, "business_verified", evidence).blockReason, "INVALID_EVIDENCE");
  }
  assert.equal(advancePilot(record, "business_verified",
    Object.create({ businessVerificationRef: "SYNTHETIC" })).blocked, true);
});

test("complete staged lifecycle preserves evidence and clears resolved missing fields", () => {
  let record = { id: "SYNTHETIC-1", state: "requested", openException: false };
  record = advancePilot(record, "business_verified");
  assert.deepEqual(record.missing, ["businessVerificationRef"]);
  for (const [next, evidence] of [
    ["business_verified", { businessVerificationRef: "SYNTHETIC" }],
    ["facts_approved", { factApprovalRef: "SYNTHETIC" }],
    ["evidence_imported", { evidenceManifestRef: "SYNTHETIC" }],
    ["report_ready", { reportRef: "SYNTHETIC", headlineTraceabilityConfirmed: true }],
    ["mike_approved", { mikeApprovalRef: "SYNTHETIC" }],
    ["delivery_ready", { recipientConfirmed: true, deliveryDisclosureVersion: "SYNTHETIC" }],
    ["delivered", { deliveryReceiptRef: "SYNTHETIC" }],
  ]) {
    record = advancePilot(record, next, evidence);
    assert.equal(record.state, next);
    assert.equal(record.blocked, false);
    assert.deepEqual(record.missing, []);
  }
  assert.equal(record.history.length, 7);
  assert.equal(record.businessVerificationRef, "SYNTHETIC");
});

test("manual export preserves nulls and labels prompted mentions", () => {
  const rows = normalizeOtterlyExport([{ response_id: "R1", prompt: "Compare Demo Brand",
    engine: "chatgpt", timestamp: "2026-09-06T12:00:00Z", response_text: "Demo Brand appears.",
    brand_mentioned: true, brand_sentiment: null,
    citations: ["https://example.invalid/source"] }], { mainBrand: "Demo Brand" });
  assert.equal(rows[0].mentionMode, "prompted");
  assert.equal(rows[0].sentiment, null);
  assert.equal(rows[0].runState, "unavailable-in-export");
  const manifest = createEvidenceManifest(rows);
  assert.equal(manifest.readyForHeadlineReporting, false);
  assert.equal(manifest.missingAuditMetadataCount, 1);
});

