import test from "node:test";
import assert from "node:assert/strict";
import { scenarios, scenarioSurfaces, scenarioEvidence, activities, spotlightFacts } from "../prototypes/ai-visibility/fixtures.js";

test("fixtures include deterministic positive, flat, and blocked scenarios", () => {
  assert.deepEqual(Object.keys(scenarios), ["positive", "flat", "blocked"]);
  assert.deepEqual(scenarios.positive.metrics.mention[0], [20, 120]);
  assert.deepEqual(scenarios.positive.metrics.mention[1], [29, 120]);
});

test("flat scenario proves controlled work without external mention improvement", () => {
  assert.deepEqual(scenarios.flat.metrics.mention, [[29, 120], [29, 120]]);
  assert.ok(activities.filter(event => event.status === "Complete").length >= 5);
  assert.ok(activities.some(event => event.type === "improvement"));
});

test("factual conflict blocks publication instead of selecting a value", () => {
  assert.ok(scenarios.blocked.gaps.some(gap => gap.status === "blocked"));
  assert.ok(activities.some(event => event.status === "Blocked"));
});

test("provider unavailable is distinct from a zero observation", () => {
  assert.equal(scenarios.blocked.responses, 0);
  assert.ok(scenarios.blocked.gaps.some(gap => gap.status === "provider"));
});

test("all Spotlight facts carry evidence placeholders", () => {
  assert.ok(spotlightFacts.length >= 5);
  assert.ok(spotlightFacts.every(fact => fact.source.includes("DEMO-S")));
});

test("every rate stores numerator and denominator instead of a derived percentage", () => {
  for (const scenario of Object.values(scenarios)) {
    for (const key of ["mention", "recommendation", "share", "queries"]) {
      for (const fraction of scenario.metrics[key]) {
        assert.equal(fraction.length, 2);
        assert.ok(Number.isInteger(fraction[0]));
        assert.ok(Number.isInteger(fraction[1]));
        assert.ok(fraction[0] <= fraction[1]);
      }
    }
  }
});

test("unresolved material service area is never presented as verified", () => {
  const serviceArea = spotlightFacts.find(fact => fact.label === "Service area");
  assert.equal(serviceArea.value, "Pending verification");
  assert.match(serviceArea.source, /conflict/i);
});

test("each dashboard scenario owns its surface and evidence records", () => {
  assert.deepEqual(Object.keys(scenarioSurfaces), Object.keys(scenarios));
  assert.deepEqual(Object.keys(scenarioEvidence), Object.keys(scenarios));
  assert.ok(scenarioEvidence.blocked.some(record => record.tags.includes("provider unavailable")));
  assert.ok(scenarioSurfaces.blocked.some(surface => surface.state === "Unavailable"));
});

test("competitor visual roles are explicit and unique", () => {
  for (const scenario of Object.values(scenarios)) {
    assert.equal(scenario.competitors.filter(item => item.role === "client").length, 1);
    assert.equal(scenario.competitors.filter(item => item.role === "other").length, 1);
    assert.ok(scenario.competitors.filter(item => item.role === "competitor").length >= 1);
  }
});

test("fixtures do not claim real businesses or external observations", () => {
  const serialized = JSON.stringify({ scenarios, activities, spotlightFacts });
  assert.match(serialized, /Northstar Roofing Co\./);
  assert.match(serialized, /synthetic|Synthetic/);
  assert.doesNotMatch(serialized, /outreachapp-|mikeroetker@gmail\.com/);
});

