export const scenarios = {
  positive: {
    label: "Month 2 · positive movement",
    client: "Northstar Roofing Co.", market: "Crown Point, Indiana", period: "August 2026",
    captured: "August 28, 2026", responses: 120,
    metrics: { mention: [[20,120],[29,120]], recommendation: [[11,120],[16,120]], share: [[11,100],[16,100]], queries: [[4,10],[7,10]], sources: [3,5], spotlightCitations: [0,4], competitorDomains: 8, sourceGaps: [6,3], conflicts: [3,1], views: 86, clicks: 12 },
    trend: { mention: [17, 18, 21, 24], recommendation: [9, 8, 11, 13] },
    competitors: [{name:"Smith Roofing",value:32,role:"competitor"},{name:"Jones Exteriors",value:24,role:"competitor"},{name:"Northstar Roofing",value:16,role:"client"},{name:"Others",value:28,role:"other"}],
    gaps: [
      {title:"Service-area conflict resolved",detail:"Spotlight now matches the approved Lake and Porter County service area.",status:"resolved"},
      {title:"Emergency repair wording unclear",detail:"Client website uses three different descriptions; client-owned correction requested.",status:"client"}
    ]
  },
  flat: {
    label: "Month 3 · little external movement",
    client: "Northstar Roofing Co.", market: "Crown Point, Indiana", period: "September 2026",
    captured: "September 28, 2026", responses: 120,
    metrics: { mention: [[29,120],[29,120]], recommendation: [[16,120],[15,120]], share: [[16,100],[16,100]], queries: [[7,10],[7,10]], sources: [5,5], spotlightCitations: [4,4], competitorDomains: 8, sourceGaps: [3,3], conflicts: [1,1], views: 121, clicks: 19 },
    trend: { mention: [21, 24, 24, 24], recommendation: [11, 13, 13, 12] },
    competitors: [{name:"Smith Roofing",value:31,role:"competitor"},{name:"Jones Exteriors",value:25,role:"competitor"},{name:"Northstar Roofing",value:16,role:"client"},{name:"Others",value:28,role:"other"}],
    gaps: [
      {title:"No material AI movement observed",detail:"The fixed panel was rerun. Variation remains inside the prior observed range.",status:"observed"},
      {title:"Roof-repair explanation improved",detail:"One source-supported module was added to the controlled Spotlight asset.",status:"resolved"}
    ]
  },
  blocked: {
    label: "Exception · factual conflict",
    client: "Northstar Roofing Co.", market: "Crown Point, Indiana", period: "Exception review",
    captured: "September 30, 2026", responses: 0,
    metrics: { mention: [[29,120],[29,120]], recommendation: [[16,120],[16,120]], share: [[16,100],[16,100]], queries: [[7,10],[7,10]], sources: [5,5], spotlightCitations: [4,4], competitorDomains: 8, sourceGaps: [3,4], conflicts: [1,2], views: 0, clicks: 0 },
    trend: { mention: [17, 21, 24, 24], recommendation: [9, 11, 13, 13] },
    competitors: [{name:"Smith Roofing",value:31,role:"competitor"},{name:"Jones Exteriors",value:25,role:"competitor"},{name:"Northstar Roofing",value:16,role:"client"},{name:"Others",value:28,role:"other"}],
    gaps: [
      {title:"Publishing blocked: service area conflict",detail:"Official website says 30 miles; intake attestation says 50 miles. No value was chosen automatically.",status:"blocked"},
      {title:"Provider unavailable",detail:"One observation surface returned no authorized data. Prior observations remain frozen.",status:"provider"}
    ]
  }
};

export const surfaces = [
  {name:"ChatGPT",state:"Observed",note:"4 of 10 prompt families"},
  {name:"Google AI",state:"Observed",note:"3 of 10 prompt families"},
  {name:"Perplexity",state:"Observed",note:"5 linked sources captured"},
  {name:"Copilot",state:"Not observed",note:"No client mention in sample"}
];

export const scenarioSurfaces = {
  positive: surfaces,
  flat: [
    {name:"ChatGPT",state:"Observed",note:"4 of 10 prompt families"},
    {name:"Google AI",state:"Observed",note:"3 of 10 prompt families"},
    {name:"Perplexity",state:"Observed",note:"5 linked sources captured"},
    {name:"Copilot",state:"Not observed",note:"No client mention in sample"}
  ],
  blocked: [
    {name:"ChatGPT",state:"Frozen",note:"Prior window retained; no new run"},
    {name:"Google AI",state:"Unavailable",note:"Provider returned no authorized data"},
    {name:"Perplexity",state:"Frozen",note:"Prior evidence retained"},
    {name:"Copilot",state:"Not observed",note:"No client mention in prior sample"}
  ]
};

export const evidence = [
  {surface:"Perplexity",query:"Who should I hire for a roof replacement in Crown Point?",finding:"Northstar was included among several local options; two sources were linked.",tags:["mentioned","recommended","2 citations"]},
  {surface:"ChatGPT",query:"Recommended roofers near Crown Point, Indiana",finding:"Two recurring competitors appeared. Northstar was not observed in this captured response.",tags:["not observed","competitor evidence"]},
  {surface:"Google AI",query:"Who fixes leaking roofs in Crown Point?",finding:"Northstar appeared as an option, but the response described an unverified service-area detail.",tags:["mentioned","factual conflict"]}
];

export const scenarioEvidence = {
  positive: evidence,
  flat: [
    {surface:"Perplexity",query:"Who should I hire for a roof replacement in Crown Point?",finding:"Client presence matched the prior window; no material movement was observed.",tags:["mentioned","flat movement","2 citations"]},
    {surface:"ChatGPT",query:"Recommended roofers near Crown Point, Indiana",finding:"The same two competitors recurred. Northstar remained outside this captured response.",tags:["not observed","competitor evidence"]},
    {surface:"Google AI",query:"Who fixes leaking roofs in Crown Point?",finding:"The corrected factual module was available on the Spotlight; no causal claim is made.",tags:["controlled work","no causal claim"]}
  ],
  blocked: [
    {surface:"Google AI",query:"Observation provider request",finding:"No authorized response was returned. The system preserved prior evidence and created an exception.",tags:["provider unavailable","no zero imputation"]},
    {surface:"Fact verification",query:"What area does Northstar serve?",finding:"Two material source claims conflict. Spotlight publication remains blocked.",tags:["factual conflict","publishing blocked"]}
  ]
};

export const activities = [
  {date:"Sep 03 · 09:14",title:"Observation baseline frozen",detail:"Approved 10-family query panel and Crown Point market stored for repeatable comparison.",type:"observation",hash:"obs_5de7a1",status:"Complete"},
  {date:"Sep 03 · 09:22",title:"Business facts verified",detail:"Name, phone, website, five services, and service area reconciled against source placeholders.",type:"verification",hash:"facts_a930e4",status:"Complete"},
  {date:"Sep 04 · 11:08",title:"Spotlight technical hygiene validated",detail:"Canonical, crawl controls, sitemap entry, and conventional LocalBusiness markup checked.",type:"spotlight",hash:"page_7bd821",status:"Complete"},
  {date:"Sep 08 · 14:35",title:"Gap-led improvement published",detail:"Added one factual roof-repair explanation based on a recurring observed information gap.",type:"improvement",hash:"change_c5110f",status:"Complete"},
  {date:"Sep 12 · 10:03",title:"Client-owned conflict escalated",detail:"Two service-area claims conflict. Automated publishing stopped pending client resolution.",type:"exception",hash:"exc_b04d32",status:"Blocked"},
  {date:"Sep 28 · 16:10",title:"Monthly observation cycle completed",detail:"Same query families rerun; raw and normalized evidence preserved for comparison.",type:"observation",hash:"obs_810fa2",status:"Complete"},
  {date:"Sep 29 · 08:45",title:"Monthly evidence report generated",detail:"External observations, controlled work, and unresolved actions reported separately.",type:"report",hash:"report_0ad122",status:"Complete"}
];

export const spotlightFacts = [
  {label:"Business",value:"Northstar Roofing Co.",source:"Client attestation · DEMO-S01"},
  {label:"Service area",value:"Pending verification",source:"Material source conflict · DEMO-S02"},
  {label:"Website",value:"northstar-roofing.example",source:"Synthetic domain · DEMO-S03"},
  {label:"Phone",value:"(219) 555-0142",source:"Synthetic contact · DEMO-S04"},
  {label:"Primary services",value:"Roof replacement, roof repair, leak investigation, storm inspection, ventilation",source:"Demo service record · DEMO-S05"}
];

