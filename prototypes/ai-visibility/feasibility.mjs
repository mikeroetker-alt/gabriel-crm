// Offline decision support only. No provider, CRM, billing, or publishing calls.
// Thresholds come from docs/AI_VISIBILITY_FEASIBILITY_PLAN.md.
const checks = [
  ["dataCostAt25", 30, "max", "USD/client/month at 25 clients"],
  ["fullyLoadedCostAt25", 40, "max", "USD/client/month at 25 clients"],
  ["medianInterventionMinutes", 10, "max", "minutes/client/month"],
  ["clientsOver15MinutesRate", 0.20, "max", "fraction of clients"],
  ["failedObservationRate", 0.05, "max", "fraction after bounded retries"],
  ["panelCompletionRate", 0.80, "min", "fraction of scheduled cells"],
  ["medianPresenceAgreement", 0.70, "min", "fraction agreement"],
  ["businessesWithTwoInsightsRate", 0.60, "min", "fraction of studied businesses"],
  ["businessesWithControlledImprovementRate", 0.50, "min", "fraction of studied businesses"],
  ["materialFactErrorRate", 0.02, "max", "fraction of reviewed material facts"],
  ["fabricatedObservationCount", 0, "max", "count"],
  ["publishedUnresolvedFactCount", 0, "max", "count"],
];

const confirmations = [
  "auditReadyEvidence", "commercialRights", "headlineTraceability",
  "noPressureToPublishUnresolvedFacts", "documentedMarginBuffer",
];

export function evaluateFeasibility(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("Expected a feasibility evidence object");
  }
  const results = checks.map(([id, threshold, direction, unit]) => {
    const value = input[id];
    const isRate = unit.startsWith("fraction");
    const valid = typeof value === "number" && Number.isFinite(value) && value >= 0
      && (!isRate || value <= 1) && (unit !== "count" || Number.isSafeInteger(value));
    const passed = valid && (direction === "max" ? value <= threshold : value >= threshold);
    return { id, value: valid ? value : null, threshold, direction, unit,
      status: !valid ? "unverified" : passed ? "pass" : "fail" };
  });
  for (const id of confirmations) {
    results.push({ id, status: input[id] === true ? "pass"
      : input[id] === false ? "fail" : "unverified" });
  }
  // Numeric summaries alone cannot establish the provenance or sufficiency of a study.
  for (const id of ["studyEvidenceRef", "reviewerRef", "measurementDefinitionsRef"]) {
    results.push({ id, status: typeof input[id] === "string" && input[id].trim()
      ? "pass" : "unverified" });
  }
  const status = results.some(row => row.status === "fail") ? "no-go"
    : results.some(row => row.status === "unverified") ? "incomplete" : "ready-for-review";
  return { status, results, authorizedToLaunch: false, authorizedToPurchase: false,
    note: "Self-reported evidence must be reviewed; this result grants no operational authorization." };
}
