import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { disclosure, evidenceMarkup, activityMarkup, observationContext } from "../prototypes/ai-visibility/components.js";
import { scenarios, scenarioEvidence, activities } from "../prototypes/ai-visibility/fixtures.js";

const source = path => readFileSync(new URL(path, import.meta.url), "utf8");
const html = source("../prototypes/ai-visibility/sales/index.html");

// Minimal DOM boundary for testing handlers without a browser or dependencies.
// This exercises the real entry modules. Layout/native-dialog behavior still needs browser QA.
function element() {
  return {
    hidden: true, disabled: true, innerHTML: "", textContent: "", open: false,
    dataset: {}, listeners: {}, classList: { toggle() {} },
    addEventListener(type, handler) { this.listeners[type] = handler; },
    focus() { this.focused = true; },
    showModal() { this.open = true; },
    close() { this.open = false; this.listeners.close?.(); }
  };
}

async function withDOM(location, action) {
  const selectors = ["#hero-observation", "#flat-observation", "#work-preview", "#evidence-context", "#evidence-cards", "#shared-disclosure", "#offer-preview", "#dialog-title", "#dialog-description", "#close-preview", "#preview-gate", "#staging-content", "#app", "#print-report", "#scenario"];
  const elements = Object.fromEntries(selectors.map(id => [id, element()]));
  elements["#preview-gate"].hidden = false;
  const buttons = ["growth", "snapshot"].map(name => Object.assign(element(), { dataset: { preview: name } }));
  const effects = [];
  const denied = name => () => { effects.push(name); throw new Error(`Forbidden: ${name}`); };
  const overrides = {
    document: { querySelector: id => { assert.ok(elements[id], `Unexpected selector ${id}`); return elements[id]; }, querySelectorAll: id => id === "[data-preview]" ? buttons : [] },
    location,
    window: { addEventListener() {}, print() {} },
    fetch: denied("fetch"), XMLHttpRequest: denied("XMLHttpRequest"), WebSocket: denied("WebSocket"),
    localStorage: { setItem: denied("localStorage"), getItem: denied("localStorage") },
    sessionStorage: { setItem: denied("sessionStorage"), getItem: denied("sessionStorage") },
    navigator: { sendBeacon: denied("sendBeacon") }
  };
  const previous = Object.fromEntries(Object.keys(overrides).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  try {
    for (const [key, value] of Object.entries(overrides)) Object.defineProperty(globalThis, key, { configurable: true, value });
    await action({ elements, buttons });
    assert.deepEqual(effects, [], "No network or storage side effects");
  } finally {
    for (const key of Object.keys(overrides)) {
      if (previous[key]) Object.defineProperty(globalThis, key, previous[key]);
      else delete globalThis[key];
    }
  }
}

let run = 0;
const loadSales = () => import(`../prototypes/ai-visibility/sales/sales.js?test=${++run}`);
const loadReports = () => import(`../prototypes/ai-visibility/app.js?test=${++run}`);

test("Growth dominates and the downsell is closed until an explicit choice", () => {
  const beforeDownsell = html.slice(0, html.indexOf('<details id="snapshot-choice">'));
  assert.match(beforeDownsell, /\$197/);
  assert.doesNotMatch(beforeDownsell, /\$25|\$49|\$79/);
  assert.match(html, /<details id="snapshot-choice"><summary>Not ready for monthly service\?/);
  assert.match(html, /seven calendar days after Snapshot delivery/);
  assert.match(html, /\$172/);
  assert.match(html, /Later payments remain \$197\/month/);
  assert.match(html, /No custom research, calls, remediation roadmap/);
});

test("HTML fails closed before JavaScript and prohibits live collection", () => {
  assert.match(html, /id="staging-content" hidden/);
  assert.equal([...html.matchAll(/data-preview="[^"]+" disabled/g)].length, 2);
  assert.match(html, /noindex, nofollow, noarchive/);
  for (const directive of ["connect-src 'none'", "form-action 'none'", "frame-src 'none'", "worker-src 'none'"]) assert.ok(html.includes(directive));
  assert.doesNotMatch(html, /<(form|input|textarea|iframe)\b|\baction=|https?:\/\//i);
  const entry = source("../prototypes/ai-visibility/sales/sales.js");
  assert.doesNotMatch(entry, /fetch\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|serviceWorker|\.submit\(/);
});

test("hosted, lookalike and file URLs cannot enable preview actions", async () => {
  for (const location of [
    {hostname: "gabrielimpactgroup.com", protocol: "https:", search: "?staging=true&live=true"},
    {hostname: "localhost.example", protocol: "https:"},
    {hostname: "", protocol: "file:"}
  ]) await withDOM(location, async ({elements, buttons}) => {
    await loadSales();
    assert.equal(elements["#staging-content"].hidden, true);
    assert.equal(elements["#preview-gate"].hidden, false);
    assert.ok(buttons.every(button => button.disabled));
    assert.equal(elements["#hero-observation"].innerHTML, "");
  });
});

test("local preview renders shared evidence and every CTA only opens an informational dialog", async () => {
  await withDOM({hostname: "127.0.0.1", protocol: "http:"}, async ({elements, buttons}) => {
    await loadSales();
    assert.equal(elements["#staging-content"].hidden, false);
    assert.equal(elements["#preview-gate"].hidden, true);
    assert.match(elements["#hero-observation"].innerHTML, /29 <span>of 120/);
    assert.match(elements["#hero-observation"].innerHTML, /No increase observed/);
    assert.equal(elements["#evidence-cards"].innerHTML, evidenceMarkup(scenarioEvidence.flat));
    assert.equal(elements["#work-preview"].innerHTML, activityMarkup(activities.filter(a => a.type === "improvement")));
    assert.equal(elements["#shared-disclosure"].innerHTML, disclosure());
    for (const button of buttons) {
      assert.equal(button.disabled, false);
      button.listeners.click();
      assert.equal(elements["#offer-preview"].open, true);
      assert.match(elements["#dialog-title"].textContent, button.dataset.preview === "growth" ? /\$197\/month/ : /\$25 one time/);
      elements["#close-preview"].listeners.click();
      assert.equal(elements["#offer-preview"].open, false);
      assert.equal(button.focused, true);
    }
    assert.match(elements["#dialog-description"].textContent, /seven calendar days after Snapshot delivery/);
  });
});

test("shared report markup escapes evidence instead of introducing active content", () => {
  const malicious = '<img src=x onerror="alert(1)">';
  const rendered = evidenceMarkup([{surface: malicious, query: malicious, finding: malicious, tags: [malicious]}]);
  assert.doesNotMatch(rendered, /<img|<script/);
  assert.match(rendered, /&lt;img/);
  assert.doesNotMatch(activityMarkup([{date: malicious, title: malicious, detail: malicious, status: malicious, type: malicious, hash: malicious}]), /<img/);
});

test("each shared observation context names the synthetic window, market, panel and capture date", () => {
  for (const data of Object.values(scenarios)) {
    const context = observationContext(data);
    for (const value of [data.market, data.period, data.captured, data.queryPanel]) assert.ok(context.includes(value));
    assert.match(context, /Synthetic sample/);
  }
  assert.match(disclosure(), /not proof that GIG caused it/);
});

test("reused dashboard defaults to flat and suppresses stale metrics during an outage", async () => {
  await withDOM({hostname: "localhost", protocol: "http:", hash: "#dashboard"}, async ({elements}) => {
    await loadReports();
    assert.match(elements["#app"].innerHTML, /flat" selected/);
    assert.match(elements["#app"].innerHTML, /29 of 120 eligible observations/);
    elements["#scenario"].listeners.change({target: {value: "blocked"}});
    assert.match(elements["#app"].innerHTML, /Current observations unavailable/);
    assert.match(elements["#app"].innerHTML, /Publishing remains blocked/);
    assert.doesNotMatch(elements["#app"].innerHTML, /metric-card|Observed trend|Competitive comparison|24\.2%/);
    elements["#scenario"].listeners.change({target: {value: "positive"}});
    assert.match(elements["#app"].innerHTML, /29 of 120 eligible observations/);
  });
});

test("all four report views remain renderable with the retired free offer removed", async () => {
  for (const hash of ["#snapshot", "#dashboard", "#ledger", "#spotlight"]) {
    await withDOM({hostname: "localhost", protocol: "http:", hash}, async ({elements}) => {
      await loadReports();
      assert.ok(elements["#app"].innerHTML.length > 500);
      assert.match(elements["#app"].innerHTML, /synthetic/i);
      assert.doesNotMatch(elements["#app"].innerHTML, /free.*snapshot/i);
      if (hash === "#spotlight") {
        assert.match(elements["#app"].innerHTML, /PUBLISHING BLOCKED/);
        assert.match(elements["#app"].innerHTML, /Pending verification/);
      }
    });
  }
});
