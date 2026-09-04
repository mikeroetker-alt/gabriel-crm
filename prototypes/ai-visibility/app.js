import { scenarios, surfaces, evidence, scenarioSurfaces, scenarioEvidence, activities, spotlightFacts } from "./fixtures.js";

const app = document.querySelector("#app");
const links = [...document.querySelectorAll("[data-view-link]")];
let selectedScenario = "positive";

const rate = ([numerator, denominator]) => denominator ? numerator / denominator * 100 : 0;
const pct = fraction => `${rate(fraction).toFixed(1)}%`;
const delta = ([before, after], suffix = " pts") => {
  const diff = rate(after) - rate(before);
  return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}${suffix} vs baseline`;
};
const disclosure = () => `<div class="disclosure"><strong>How to read this prototype:</strong> These are sampled observations, not universal rankings or market share. Results vary by system, location, retrieval mode, model, personalization and time. Movement after GIG work is not proof that GIG caused it. All businesses, measurements, citations and engagement events shown here are synthetic.</div>`;
const metric = (label, value, note, change, flat = false) => `<article class="card metric-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-note">${note}</div>${change ? `<span class="delta ${flat ? "flat" : ""}">${change}</span>` : ""}</article>`;
const bar = ({name,value,role}) => `<div class="bar-row"><span>${name}</span><div class="bar-track"><div class="bar-fill ${role}" style="width:${value}%"></div></div><span class="bar-value">${value}%</span></div>`;

function hero(data, title, text, eyebrow = "AI visibility evidence") {
  return `<section class="hero"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lede">${text}</p><div class="report-meta"><span><strong>${data.client}</strong></span><span>${data.market}</span><span>Captured ${data.captured}</span><span>${data.responses} sampled responses</span></div></section>`;
}

function surfacesMarkup(items = surfaces) {
  return `<div class="surface-grid">${items.map(item => `<div class="surface"><strong><i class="status-dot ${item.state === "Not observed" || item.state === "Unavailable" ? "missing" : ""}"></i>${item.name}</strong><small>${item.state} · ${item.note}</small></div>`).join("")}</div>`;
}

function evidenceMarkup(items = evidence) {
  return `<div class="grid grid-3">${items.map(item => `<article class="card evidence-card"><p class="eyebrow">${item.surface}</p><p class="evidence-query">“${item.query}”</p><p class="quote">${item.finding}</p>${item.tags.map(tag => `<span class="tag ${tag.includes("conflict") || tag.includes("not") || tag.includes("unavailable") || tag.includes("blocked") ? "warn" : ""}">${tag}</span>`).join("")}</article>`).join("")}</div>`;
}

function snapshot() {
  const d = scenarios.positive;
  return `<div class="shell">${hero(d,"Are local customers finding you—or your competitors?","A transparent sample of how AI and search assistants represented this business across buyer-intent questions. No mystery score. Just named observations and evidence.","Free Local AI Visibility Snapshot")}
    <section class="grid grid-4">
      ${metric("AI mention presence",`7 of 40`,"eligible responses · 120 total surface observations","17.5% observed")}
      ${metric("Recommendation presence",`4 of 40`,"applicable responses · 120 total surface observations","10% observed")}
      ${metric("Query coverage",`4 of 10`,"fixed buyer-intent families","client observed")}
      ${metric("Information conflicts",`3`,"facts requiring attention","not auto-corrected",true)}
    </section>
    <section class="section grid grid-2">
      <article class="card"><div class="section-heading"><h2>Who appears instead?</h2><span class="section-kicker">share of observed mentions</span></div><div class="bar-list">${d.competitors.map(bar).join("")}</div></article>
      <article class="card"><div class="section-heading"><h2>Surface coverage</h2><span class="section-kicker">captured sample</span></div>${surfacesMarkup()}<p class="source-note">“Not observed” means absent from this defined sample—not absent everywhere.</p></article>
    </section>
    <section class="section"><div class="section-heading"><h2>What the evidence looked like</h2><span class="section-kicker">representative synthetic captures</span></div>${evidenceMarkup()}</section>
    <section class="section panel"><p class="eyebrow">First correction opportunity</p><h2>Make the service area clear and consistent.</h2><p>Three different service-area descriptions were observed across source placeholders. GIG would stop, request verification, and update only the asset it controls after approval.</p><button class="button button-primary" type="button" disabled>Request my factual review</button></section>
    ${disclosure()}</div>`;
}

function trendMarkup(data) {
  const point = (v,i,arr) => `${i*(100/(arr.length-1))},${190-v*5.8}`;
  const mention = data.trend.mention.map((v,i,a)=>point(v,i,a)).join(" ");
  const rec = data.trend.recommendation.map((v,i,a)=>point(v,i,a)).join(" ");
  return `<div class="trend"><div class="trend-y"><span>30%</span><span>20%</span><span>10%</span><span>0%</span></div><svg viewBox="0 0 100 200" preserveAspectRatio="none" aria-label="Four-cycle mention and recommendation trend with zero to thirty percent scale"><line x1="0" y1="16" x2="100" y2="16"/><line x1="0" y1="74" x2="100" y2="74"/><line x1="0" y1="132" x2="100" y2="132"/><polyline points="${mention}" fill="none" stroke="#0f6b55" stroke-width="2.2" vector-effect="non-scaling-stroke"/><polyline points="${rec}" fill="none" stroke="#d89c3f" stroke-width="2.2" vector-effect="non-scaling-stroke"/></svg></div><div class="trend-labels"><span>Baseline</span><span>Cycle 1</span><span>Cycle 2</span><span>Current</span></div><div class="legend"><span><i></i>Mention rate</span><span><i class="gold"></i>Recommendation rate</span></div>`;
}

function scenarioPicker() {
  return `<div class="scenario-switcher"><label for="scenario">Demo scenario</label><select id="scenario">${Object.entries(scenarios).map(([key,v])=>`<option value="${key}" ${key===selectedScenario?"selected":""}>${v.label}</option>`).join("")}</select></div>`;
}

function dashboard() {
  const d = scenarios[selectedScenario]; const m = d.metrics;
  return `<div class="shell">${hero(d,"Your monthly AI visibility evidence.","See where you appeared, who appeared more often, what GIG completed, and what needs attention next.","$197/month · client dashboard")}${scenarioPicker()}
    <div class="question-strip"><div><small>01</small>Where am I showing up?</div><div><small>02</small>Who is beating me?</div><div><small>03</small>What did GIG do?</div><div><small>04</small>What needs attention?</div></div>
    <section class="grid grid-4">
      ${metric("Mention rate",pct(m.mention[1]),`${m.mention[1][0]} of ${m.mention[1][1]} eligible observations`,delta(m.mention),rate(m.mention[1])===rate(m.mention[0]))}
      ${metric("Recommendation rate",pct(m.recommendation[1]),`${m.recommendation[1][0]} of ${m.recommendation[1][1]} applicable observations`,delta(m.recommendation),rate(m.recommendation[1])<=rate(m.recommendation[0]))}
      ${metric("Observed competitive share",pct(m.share[1]),`${m.share[1][0]} of ${m.share[1][1]} defined-brand mentions`,delta(m.share),rate(m.share[1])===rate(m.share[0]))}
      ${metric("Query coverage",`${m.queries[1][0]} of ${m.queries[1][1]}`,"fixed prompt families",`${m.queries[1][0]-m.queries[0][0] >= 0 ? "+" : ""}${m.queries[1][0]-m.queries[0][0]} families vs baseline`,m.queries[1][0]===m.queries[0][0])}
    </section>
    <section class="section grid grid-2">
      <article class="card"><div class="section-heading"><h2>Observed trend</h2><span class="section-kicker">same panel · four cycles</span></div>${trendMarkup(d)}</article>
      <article class="card"><div class="section-heading"><h2>Competitive comparison</h2><span class="section-kicker">sampled mentions only</span></div><div class="bar-list">${d.competitors.map(bar).join("")}</div></article>
    </section>
    <section class="section grid grid-2">
      <article class="card"><h2>Surface coverage</h2>${surfacesMarkup(scenarioSurfaces[selectedScenario])}</article>
      <article class="card"><h2>Spotlight engagement</h2><div class="grid grid-2">${metric("Views",m.views,"first-party sessions","No lead claim",true)}${metric("Action clicks",m.clicks,"website, call or email clicks","Not verified sales",true)}</div></article>
    </section>
    <section class="section"><div class="section-heading"><h2>Citation & source evidence</h2><span class="section-kicker">what observed systems relied upon</span></div><div class="grid grid-4">${metric("Supporting domains",m.sources[1],`${m.sources[0]} at baseline`,`${m.sources[1]-m.sources[0] >= 0 ? "+" : ""}${m.sources[1]-m.sources[0]} domains`)}${metric("Spotlight citations",m.spotlightCitations[1],`${m.spotlightCitations[0]} at baseline`,`${m.spotlightCitations[1]-m.spotlightCitations[0] >= 0 ? "+" : ""}${m.spotlightCitations[1]-m.spotlightCitations[0]} observed`)}${metric("Competitor domains",m.competitorDomains,"recurring in this panel","Context only",true)}${metric("Source gaps",m.sourceGaps[1],`${m.sourceGaps[0]} at baseline`,`${m.sourceGaps[1]-m.sourceGaps[0]} unresolved`,m.sourceGaps[1]>=m.sourceGaps[0])}</div></section>
    <section class="section"><div class="section-heading"><h2>Evidence captures</h2><span class="section-kicker">scenario-specific records</span></div>${evidenceMarkup(scenarioEvidence[selectedScenario])}</section>
    <section class="section"><div class="section-heading"><h2>Attention queue</h2><span class="section-kicker">controlled work vs external blockers</span></div><div class="grid grid-2">${d.gaps.map(g=>`<article class="card"><span class="tag ${g.status==='blocked'||g.status==='client'?'warn':''}">${g.status}</span><h3>${g.title}</h3><p>${g.detail}</p></article>`).join("")}</div></section>
    ${disclosure()}</div>`;
}

function ledger() {
  const d=scenarios.flat;
  return `<div class="shell">${hero(d,"What your $197 paid for this month.","External AI visibility may move slowly or fluctuate. This audit-style ledger records every controlled action, source reference, outcome, and unresolved dependency.","Work completed this month")}
    <section class="grid grid-3">
      ${metric("Completed actions","6","verified system activities","Evidence attached")}
      ${metric("Controlled improvement","1","bounded gap-led change","Within monthly scope")}
      ${metric("Blocked exception","1","client-owned factual conflict","Publishing stopped",true)}
    </section>
    <section class="section timeline">${activities.map(a=>`<article class="timeline-item ${a.status==='Blocked'?'blocked':''}"><div class="timeline-meta"><span>${a.date}</span><span>${a.status}</span></div><h3>${a.title}</h3><p>${a.detail}</p><span class="tag">${a.type}</span> <span class="tag hash">${a.hash}</span></article>`).join("")}</section>
    <div class="callout"><strong>Value without a vanity win:</strong> In this demo month the mention rate stayed flat. The fixed observation panel was still rerun, evidence preserved, one useful factual improvement completed, engagement measured, and a risky conflict blocked instead of guessed.</div>
    ${disclosure()}</div>`;
}

function spotlight() {
  return `<div class="shell"><section class="spotlight-blocked">PUBLISHING BLOCKED · MATERIAL FACT CONFLICT REQUIRES RESOLUTION</section><section class="spotlight-hero"><div class="spotlight-copy"><p class="eyebrow" style="color:#89cdb8">Local Business Spotlight · unpublished prototype</p><h1>Northstar Roofing Co.</h1><p>A concise reference draft for a synthetic Northwest Indiana roofing business. This page cannot be published until the service-area conflict is resolved.</p><div class="hero-actions"><button class="button button-primary" type="button" disabled>Website action unavailable</button><span class="tag warn">Verification incomplete</span></div></div><div class="roof-illustration" role="img" aria-label="Abstract illustration of a house roof"></div></section>
    <section class="section grid grid-2"><article class="card"><p class="eyebrow">Verified facts</p><h2>What customers can confirm</h2><ul class="fact-list">${spotlightFacts.map(f=>`<li><small>${f.label}</small><strong>${f.value}</strong><div class="source-note">Evidence: ${f.source}</div></li>`).join("")}</ul></article><article class="card"><p class="eyebrow">Useful context</p><h2>Planning a roof repair</h2><p>A useful first conversation separates the visible symptom from the source of water entry. Ask what will be inspected, how the repair boundary will be documented, and which conditions could change the estimate.</p><h3>Primary services</h3><div>${["Roof replacement","Roof repair","Leak investigation","Storm inspection","Ventilation"].map(x=>`<span class="tag">${x}</span>`).join("")}</div><div class="callout" style="margin-top:24px"><strong>Prototype safeguard:</strong> A service-area conflict is unresolved. The system will not expand or invent the claimed area until the business approves a supported fact.</div></article></section>
    <section class="section grid grid-3">${metric("One canonical page","1","per client/location","No scaled location pages")}${metric("Material sources","5","synthetic evidence refs","Source log retained")}${metric("Open conflicts","1","publishing boundary","Human resolution required",true)}</section>
    ${disclosure()}</div>`;
}

const views={snapshot,dashboard,ledger,spotlight};
function render(){const key=(location.hash||"#snapshot").slice(1);const view=views[key]?key:"snapshot";links.forEach(l=>l.classList.toggle("active",l.dataset.viewLink===view));app.innerHTML=views[view]();const selector=document.querySelector("#scenario");if(selector)selector.addEventListener("change",e=>{selectedScenario=e.target.value;render();});app.focus();}
window.addEventListener("hashchange",render);
document.querySelector("#print-report").addEventListener("click",()=>window.print());
render();

