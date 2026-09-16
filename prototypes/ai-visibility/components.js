// Shared synthetic report components. No provider, CRM, storage, or checkout hooks.
export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

export const disclosure = () => `<div class="disclosure"><strong>How to read this prototype:</strong> These are sampled observations, not universal rankings or market share. Results vary by system, location, retrieval mode, model, personalization and time. Movement after GIG work is not proof that GIG caused it. All businesses, measurements, citations and engagement events shown here are synthetic. No rankings, inclusion, citations, traffic, leads or revenue are guaranteed.</div>`;

export function evidenceMarkup(items) {
  return `<div class="grid grid-3">${items.map(item => `<article class="card evidence-card"><p class="eyebrow">${escapeHtml(item.surface)}</p><p class="evidence-query">“${escapeHtml(item.query)}”</p><p class="quote">${escapeHtml(item.finding)}</p>${item.tags.map(tag => `<span class="tag ${/conflict|not|unavailable|blocked/.test(tag) ? "warn" : ""}">${escapeHtml(tag)}</span>`).join("")}</article>`).join("")}</div>`;
}

export function activityMarkup(items) {
  return items.map(a => `<article class="timeline-item ${a.status === "Blocked" ? "blocked" : ""}"><div class="timeline-meta"><span>${escapeHtml(a.date)}</span><span>${escapeHtml(a.status)}</span></div><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.detail)}</p><span class="tag">${escapeHtml(a.type)}</span> <span class="tag hash">${escapeHtml(a.hash)}</span></article>`).join("");
}

export function observationContext(data) {
  return `<p class="source-note observation-context"><strong>Synthetic sample:</strong> ${escapeHtml(data.client)} · Roofing · ${escapeHtml(data.market)} · Window: ${escapeHtml(data.period)} · Captured: ${escapeHtml(data.captured)} · Panel: ${escapeHtml(data.queryPanel)} (10 fixed query families). Evidence sources are synthetic placeholders.</p>`;
}
