const roles = {
  chiefOfStaff: { capabilities: ["reasoning", "planning", "tool_use"], risk: "high" },
  researchQualification: { capabilities: ["research", "extraction", "structured_output"], risk: "medium" },
  outreachDrafting: { capabilities: ["writing", "classification", "structured_output"], risk: "high" },
  contentReporting: { capabilities: ["writing", "analysis", "long_context"], risk: "medium" },
  crmAccount: { capabilities: ["structured_output", "classification", "tool_use"], risk: "high" },
  visibilityAnalysis: { capabilities: ["analysis", "long_context", "structured_output"], risk: "high" },
};

export const rolePolicies = Object.freeze(roles);

function supports(model, capabilities) {
  return capabilities.every(capability => model.capabilities?.includes(capability));
}

export function routeModel({ role, candidates, maxCostPerMillionTokens, requireIndependentReview = false }) {
  const policy = rolePolicies[role];
  if (!policy) throw new RangeError(`Unknown role: ${role}`);
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return { status: "blocked", reason: "NO_CANDIDATES" };
  }
  const eligible = candidates.filter(model => model.enabled === true
    && model.approved === true
    && Number.isFinite(model.costPerMillionTokens)
    && model.costPerMillionTokens <= maxCostPerMillionTokens
    && supports(model, policy.capabilities)
    && model.validationStatus === "passed");
  if (!eligible.length) return { status: "blocked", reason: "NO_VALIDATED_MODEL_WITHIN_BUDGET" };
  eligible.sort((a, b) => b.qualityScore - a.qualityScore
    || a.costPerMillionTokens - b.costPerMillionTokens
    || a.id.localeCompare(b.id));
  const primary = eligible[0];
  const fallback = eligible.find(model => model.provider !== primary.provider) ?? eligible[1] ?? null;
  const critic = requireIndependentReview
    ? eligible.find(model => model.provider !== primary.provider && model.id !== fallback?.id) ?? fallback
    : null;
  if (requireIndependentReview && !critic) {
    return { status: "blocked", reason: "NO_INDEPENDENT_REVIEWER" };
  }
  return { status: "ready", role, primary: primary.id, fallback: fallback?.id ?? null,
    critic: critic?.id ?? null, policyVersion: "1.0" };
}

export function recordModelOutcome(outcome) {
  const required = ["taskId", "role", "modelId", "provider", "costUsd", "latencyMs", "result"];
  if (!outcome || required.some(key => outcome[key] === undefined)) {
    throw new TypeError("Incomplete model outcome");
  }
  if (!rolePolicies[outcome.role]) throw new RangeError(`Unknown role: ${outcome.role}`);
  if (!Number.isFinite(outcome.costUsd) || outcome.costUsd < 0) throw new RangeError("Invalid costUsd");
  if (!Number.isSafeInteger(outcome.latencyMs) || outcome.latencyMs < 0) throw new RangeError("Invalid latencyMs");
  if (!["accepted", "corrected", "rejected", "failed"].includes(outcome.result)) {
    throw new RangeError("Invalid result");
  }
  return Object.freeze({ ...outcome, recordedAt: outcome.recordedAt ?? new Date().toISOString() });
}

