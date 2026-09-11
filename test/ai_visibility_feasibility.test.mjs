import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFeasibility } from "../prototypes/ai-visibility/feasibility.mjs";

const synthetic = () => ({
  dataCostAt25: 15, fullyLoadedCostAt25: 25, medianInterventionMinutes: 5,
  clientsOver15MinutesRate: 0.1, failedObservationRate: 0.03,
  panelCompletionRate: 0.97, medianPresenceAgreement: 0.8,
  businessesWithTwoInsightsRate: 0.7, businessesWithControlledImprovementRate: 0.6,
  materialFactErrorRate: 0.01, fabricatedObservationCount: 0, publishedUnresolvedFactCount: 0,
  auditReadyEvidence: true, commercialRights: true, headlineTraceability: true,
  noPressureToPublishUnresolvedFacts: true, documentedMarginBuffer: true,
  studyEvidenceRef: "SYNTHETIC-STUDY", reviewerRef: "SYNTHETIC-REVIEWER",
  measurementDefinitionsRef: "SYNTHETIC-DEFINITIONS",
});

test("passing synthetic measurements only request review; never authorize operations", () => {
  const input = synthetic();
  const before = structuredClone(input);
  const result = evaluateFeasibility(input);
  assert.equal(result.status, "ready-for-review");
  assert.equal(result.authorizedToLaunch, false);
  assert.equal(result.authorizedToPurchase, false);
  assert.deepEqual(input, before);
});

test("each hard threshold accepts its boundary and rejects the failing side", () => {
  for (const row of evaluateFeasibility(synthetic()).results.filter(row => "threshold" in row)) {
    const atBoundary = { ...synthetic(), [row.id]: row.threshold };
    assert.equal(evaluateFeasibility(atBoundary).status, "ready-for-review", row.id);
    const increment = row.unit === "count" ? 1 : 0.001;
    atBoundary[row.id] += row.direction === "max" ? increment : -increment;
    assert.equal(evaluateFeasibility(atBoundary).status, "no-go", row.id);
  }
});

test("missing evidence never passes, including a wholly empty packet", () => {
  assert.equal(evaluateFeasibility().status, "incomplete");
  for (const key of Object.keys(synthetic())) {
    const packet = synthetic();
    delete packet[key];
    assert.equal(evaluateFeasibility(packet).status, "incomplete", key);
  }
});

test("invalid measurements cannot masquerade as zero or a passing percentage", () => {
  for (const value of [null, "0", NaN, Infinity, -1, true]) {
    assert.equal(evaluateFeasibility({ ...synthetic(), dataCostAt25: value }).status, "incomplete");
  }
  assert.equal(evaluateFeasibility({ ...synthetic(), panelCompletionRate: 80 }).status, "incomplete");
  assert.equal(evaluateFeasibility({ ...synthetic(), fabricatedObservationCount: 0.1 }).status, "incomplete");
});

test("80 percent coverage does not waive the stricter five percent failure gate", () => {
  assert.equal(evaluateFeasibility({ ...synthetic(), panelCompletionRate: 0.8,
    failedObservationRate: 0.2 }).status, "no-go");
});

test("failed rights or evidence gates override good economics and missing data", () => {
  for (const key of ["commercialRights", "auditReadyEvidence", "headlineTraceability",
    "noPressureToPublishUnresolvedFacts", "documentedMarginBuffer"]) {
    assert.equal(evaluateFeasibility({ ...synthetic(), [key]: false }).status, "no-go");
    assert.equal(evaluateFeasibility({ ...synthetic(), [key]: "true" }).status, "incomplete");
  }
  assert.equal(evaluateFeasibility({ commercialRights: false }).status, "no-go");
});

test("evidence references and object shape are required", () => {
  assert.equal(evaluateFeasibility({ ...synthetic(), reviewerRef: "  " }).status, "incomplete");
  for (const input of [null, [], "pass", 1]) assert.throws(() => evaluateFeasibility(input), TypeError);
});
