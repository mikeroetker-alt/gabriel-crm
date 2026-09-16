import { scenarios, scenarioEvidence, activities } from "../fixtures.js";
import { disclosure, evidenceMarkup, activityMarkup, observationContext } from "../components.js";

// Deliberately no hosted allowlist, query-string override, storage, or activation flag.
// A separately approved implementation is required for any hosted or live flow.
const localPreview = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)
  && ["http:", "https:"].includes(location.protocol);

if (localPreview) {
  const data = scenarios.flat;
  const [previous, current] = data.metrics.mention;
  const sample = `<div class="sample-count"><strong>${current[0]} <span>of ${current[1]}</span></strong><span>eligible responses mentioned the business</span></div><p class="flat-note">Prior window: ${scenarios.positive.period} · ${previous[0]} of ${previous[1]} · No increase observed</p>${observationContext(data)}`;
  document.querySelector("#hero-observation").innerHTML = sample;
  document.querySelector("#flat-observation").innerHTML = sample;
  document.querySelector("#work-preview").innerHTML = activityMarkup(activities.filter(item => item.type === "improvement"));
  document.querySelector("#evidence-context").innerHTML = observationContext(data);
  document.querySelector("#evidence-cards").innerHTML = evidenceMarkup(scenarioEvidence.flat);
  document.querySelector("#shared-disclosure").innerHTML = disclosure();

  const dialog = document.querySelector("#offer-preview");
  let trigger;
  document.querySelectorAll("[data-preview]").forEach(button => {
    button.disabled = false;
    button.addEventListener("click", () => {
      trigger = button;
      const growth = button.dataset.preview === "growth";
      document.querySelector("#dialog-title").textContent = growth ? "AI Visibility Growth · $197/month" : "AI Discovery Snapshot · $25 one time";
      document.querySelector("#dialog-description").textContent = growth
        ? "The proposed enrollment step would confirm service scope, eligibility and disclosed terms before any purchase. This preview collects no information."
        : "The limited diagnostic would cover one business/trade, one geography and one locked query panel. The pilot permits a full $25 credit toward the first $197 payment for an upgrade within seven calendar days after Snapshot delivery; later payments remain $197/month. No purchase or subscription is created here.";
      dialog.showModal();
    });
  });
  document.querySelector("#close-preview").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => trigger?.focus());
  document.querySelector("#preview-gate").hidden = true;
  document.querySelector("#staging-content").hidden = false;
}
