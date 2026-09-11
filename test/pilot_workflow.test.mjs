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


test("unknown exception state blocks advancement and outreach", () => {
  for (const openException of [undefined, null, "false", 0]) {
    assert.equal(advancePilot({ state: "requested", openException }, "business_verified",
      { businessVerificationRef: "SYNTHETIC" }).blockReason, "OPEN_EXCEPTION");
    assert.equal(outreachEligibility({ emailVerification: "verified", decisionMaker: "Synthetic Owner",
      sourceUrl: "https://example.invalid/source", suppressed: false, openException,
      mikeApprovalRef: "SYNTHETIC" }).eligible, false);
  }
  assert.equal(advancePilot({ state: "requested" }, "cancelled").state, "cancelled");
});

test("confirmations require true and evidence references require text", () => {
  for (const headlineTraceabilityConfirmed of [false, "false", "true", 1]) {
    assert.equal(advancePilot({ state: "evidence_imported", openException: false }, "report_ready",
      { reportRef: "SYNTHETIC", headlineTraceabilityConfirmed }).blockReason, "MISSING_EVIDENCE");
  }
  assert.equal(advancePilot({ state: "requested", openException: false }, "business_verified",
    { businessVerificationRef: true }).blockReason, "MISSING_EVIDENCE");
  assert.equal(advancePilot({ state: "mike_approved", openException: false }, "delivery_ready",
    { recipientConfirmed: "false", deliveryDisclosureVersion: "SYNTHETIC" }).blockReason, "MISSING_EVIDENCE");
});
