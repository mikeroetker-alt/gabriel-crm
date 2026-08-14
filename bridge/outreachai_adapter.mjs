const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 200;

function assertNonEmptyString(value, path) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${path} must be a non-empty string`);
  }
}

export function validateContactsEnvelope(envelope) {
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
    throw new TypeError("response must be an object");
  }
  if (!Array.isArray(envelope.contacts)) {
    throw new TypeError("response.contacts must be an array");
  }
  if (!envelope.page || typeof envelope.page !== "object") {
    throw new TypeError("response.page must be an object");
  }
  if (!Number.isSafeInteger(envelope.total) || envelope.total < envelope.contacts.length) {
    throw new RangeError("response.total must be an integer no smaller than contacts.length");
  }
  if (!Number.isSafeInteger(envelope.page.limit) || envelope.page.limit < 1 || envelope.page.limit > MAX_PAGE_SIZE) {
    throw new RangeError(`response.page.limit must be between 1 and ${MAX_PAGE_SIZE}`);
  }
  if (envelope.contacts.length > envelope.page.limit) {
    throw new RangeError("response.contacts exceeds response.page.limit");
  }
  if (envelope.page.nextCursor !== null) {
    assertNonEmptyString(envelope.page.nextCursor, "response.page.nextCursor");
  }

  const ids = new Set();
  for (const [index, contact] of envelope.contacts.entries()) {
    if (!contact || typeof contact !== "object" || Array.isArray(contact)) {
      throw new TypeError(`response.contacts[${index}] must be an object`);
    }
    assertNonEmptyString(contact.id, `response.contacts[${index}].id`);
    assertNonEmptyString(contact.pipeline, `response.contacts[${index}].pipeline`);
    assertNonEmptyString(contact.stage, `response.contacts[${index}].stage`);
    if (ids.has(contact.id)) throw new Error(`duplicate contact id: ${contact.id}`);
    ids.add(contact.id);
  }

  if (envelope.countsByPipeline !== undefined) {
    if (!envelope.countsByPipeline || typeof envelope.countsByPipeline !== "object" || Array.isArray(envelope.countsByPipeline)) {
      throw new TypeError("response.countsByPipeline must be an object");
    }
    const aggregate = Object.values(envelope.countsByPipeline).reduce((sum, count) => {
      if (!Number.isSafeInteger(count) || count < 0) {
        throw new RangeError("pipeline counts must be non-negative integers");
      }
      return sum + count;
    }, 0);
    if (aggregate !== envelope.total) throw new Error("pipeline counts must sum to response.total");
  }

  return envelope;
}

export class OutreachAIContactsAdapter {
  constructor({ baseUrl, fetchImpl = globalThis.fetch } = {}) {
    assertNonEmptyString(baseUrl, "baseUrl");
    if (typeof fetchImpl !== "function") throw new TypeError("fetchImpl must be a function");
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.fetchImpl = fetchImpl;
  }

  async listContacts({ limit = DEFAULT_PAGE_SIZE, cursor } = {}) {
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
      throw new RangeError(`limit must be between 1 and ${MAX_PAGE_SIZE}`);
    }
    if (cursor !== undefined) assertNonEmptyString(cursor, "cursor");

    const url = new URL(`${this.baseUrl}/api/contacts`);
    url.searchParams.set("limit", String(limit));
    if (cursor !== undefined) url.searchParams.set("cursor", cursor);

    const response = await this.fetchImpl(url, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    if (!response || typeof response.ok !== "boolean" || typeof response.json !== "function") {
      throw new TypeError("fetchImpl returned an invalid response");
    }
    if (!response.ok) throw new Error(`OutreachAI read failed with HTTP ${response.status}`);
    return validateContactsEnvelope(await response.json());
  }
}

export const CONTACTS_PAGE_SIZE_MAX = MAX_PAGE_SIZE;
