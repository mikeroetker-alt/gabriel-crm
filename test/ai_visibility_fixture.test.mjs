import test from "node:test";
import assert from "node:assert/strict";
import { scenarios, activities, spotlightFacts } from "../prototypes/ai-visibility/fixtures.js";

test("fixtures include deterministic positive, flat, and blocked scenarios", () => {
  assert.deepEqual(Object.keys(scenarios), ["positive", "flat", "blocked"]);
  assert.equal(scenarios.positive.metrics.mention[0], 17);
  assert.equal(scenarios.positive.metrics.mention[1], 24);
});

test("flat scenario proves controlled work without external mention improvement", () => {
  assert.deepEqual(scenarios.flat.metrics.mention, [24, 24]);
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

test("fixtures do not claim real businesses or external observations", () => {
  const serialized = JSON.stringify({ scenarios, activities, spotlightFacts });
  assert.match(serialized, /Northstar Roofing Co\./);
  assert.match(serialized, /synthetic|Synthetic/);
  assert.doesNotMatch(serialized, /outreachapp-|mikeroetker@gmail\.com/);
});

