import { createHash } from "node:crypto";

const required = ["response_id", "prompt", "engine", "timestamp", "response_text"];

export function normalizeOtterlyExport(input, { mainBrand } = {}) {
  if (!Array.isArray(input)) throw new TypeError("Otterly export must be an array");
  if (typeof mainBrand !== "string" || !mainBrand.trim()) throw new TypeError("mainBrand is required");
  const brand = mainBrand.trim();
  return input.map((row, index) => {
    if (!row || typeof row !== "object" || required.some(key => typeof row[key] !== "string" || !row[key].trim())) {
      throw new TypeError(`Invalid Otterly row at index ${index}`);
    }
    const capturedAt = new Date(row.timestamp);
    if (Number.isNaN(capturedAt.valueOf())) throw new TypeError(`Invalid timestamp at index ${index}`);
    const citations = Array.isArray(row.citations) ? row.citations.map((entry, citationIndex) => {
      const url = typeof entry === "string" ? entry : entry?.link;
      if (typeof url !== "string" || !/^https?:\/\//.test(url)) {
        throw new TypeError(`Invalid citation at row ${index}, citation ${citationIndex}`);
      }
      return { url, title: typeof entry === "object" ? entry.title ?? null : null,
        rank: typeof entry === "object" ? entry.rank ?? null : null };
    }) : [];
    return {
      source: "otterly-manual-export", sourceRow: index, providerResponseRef: row.response_id,
      engine: row.engine, capturedAt: capturedAt.toISOString(), prompt: row.prompt,
      response: row.response_text, brandMentioned: row.brand_mentioned === true,
      mentionMode: row.prompt.toLocaleLowerCase().includes(brand.toLocaleLowerCase()) ? "prompted" : "unprompted",
      sentiment: row.brand_sentiment ?? null, citations,
      rawHash: createHash("sha256").update(JSON.stringify(row)).digest("hex"),
      runState: "unavailable-in-export", effectiveLocation: null, modelVersion: null,
      reviewStatus: "pending"
    };
  });
}

export function createEvidenceManifest(observations) {
  if (!Array.isArray(observations) || observations.length === 0) throw new TypeError("Observations required");
  const uniqueRows = new Set(observations.map(row => {
    if (!row || typeof row.providerResponseRef !== "string" || !row.providerResponseRef.trim()
      || typeof row.engine !== "string" || !row.engine.trim()
      || typeof row.rawHash !== "string" || !/^[a-f0-9]{64}$/.test(row.rawHash)) {
      throw new TypeError("Observation identity and raw hash required");
    }
    return JSON.stringify([row.source, row.engine, row.providerResponseRef]);
  }));
  if (uniqueRows.size !== observations.length) throw new Error("Duplicate observation row");
  return {
    schemaVersion: "1.0", observationCount: observations.length,
    engines: [...new Set(observations.map(row => row.engine))].sort(),
    promptedCount: observations.filter(row => row.mentionMode === "prompted").length,
    unpromptedCount: observations.filter(row => row.mentionMode === "unprompted").length,
    missingAuditMetadataCount: observations.filter(row => row.runState === "unavailable-in-export"
      || !row.effectiveLocation || !row.modelVersion).length,
    readyForHeadlineReporting: observations.every(row => row.reviewStatus === "approved")
      && observations.every(row => row.runState === "completed"
        && typeof row.response === "string" && row.response.trim()
        && typeof row.effectiveLocation === "string" && row.effectiveLocation.trim()
        && typeof row.modelVersion === "string" && row.modelVersion.trim()),
  };
}
