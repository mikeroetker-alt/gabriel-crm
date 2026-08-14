function assertNonEmptyString(value, path) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${path} must be a non-empty string`);
  }
}

function assertContactIdentity(contact, pathPrefix, stageField = "stage") {
  if (!contact || typeof contact !== "object" || Array.isArray(contact)) {
    throw new TypeError(`${pathPrefix} must be an object`);
  }
  assertNonEmptyString(contact.id, `${pathPrefix}.id`);
  assertNonEmptyString(contact.pipeline, `${pathPrefix}.pipeline`);
  assertNonEmptyString(contact[stageField], `${pathPrefix}.${stageField}`);
}

export function validateContactsEnvelope(envelope) {
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
    throw new TypeError("response must be an object");
  }
  if (!Array.isArray(envelope.contacts)) {
    throw new TypeError("response.contacts must be an array");
  }
  if (!Number.isSafeInteger(envelope.total) || envelope.total < envelope.contacts.length) {
    throw new RangeError("response.total must be an integer no smaller than contacts.length");
  }

  const ids = new Set();
  for (const [index, contact] of envelope.contacts.entries()) {
    assertContactIdentity(contact, `response.contacts[${index}]`);
    if (ids.has(contact.id)) throw new Error(`duplicate contact id: ${contact.id}`);
    ids.add(contact.id);
  }

  if (envelope.page !== undefined) {
    if (!envelope.page || typeof envelope.page !== "object" || Array.isArray(envelope.page)) {
      throw new TypeError("response.page must be an object when present");
    }
    if (!Number.isSafeInteger(envelope.page.limit) || envelope.page.limit < 1) {
      throw new RangeError("response.page.limit must be a positive integer");
    }
    if (envelope.contacts.length > envelope.page.limit) {
      throw new RangeError("response.contacts exceeds response.page.limit");
    }
    if (envelope.page.nextCursor !== undefined && envelope.page.nextCursor !== null) {
      assertNonEmptyString(envelope.page.nextCursor, "response.page.nextCursor");
    }
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

export function translateTrpcContactsResponse(payload) {
  const json = payload?.result?.data?.json;
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new TypeError("tRPC response.result.data.json must be an object");
  }
  if (!Array.isArray(json.contacts)) {
    throw new TypeError("tRPC response.result.data.json.contacts must be an array");
  }
  if (!Number.isSafeInteger(json.total) || json.total < json.contacts.length) {
    throw new RangeError("tRPC response total must be an integer no smaller than contacts.length");
  }

  const contacts = json.contacts.map((contact, index) => {
    const path = `tRPC response.result.data.json.contacts[${index}]`;
    assertContactIdentity(contact, path, "status");
    return {
      id: contact.id,
      pipeline: contact.pipeline,
      stage: contact.status
    };
  });

  return validateContactsEnvelope({ contacts, total: json.total });
}

export class OutreachAIContactsAdapter {
  constructor({ baseUrl, fetchImpl = globalThis.fetch } = {}) {
    assertNonEmptyString(baseUrl, "baseUrl");
    if (typeof fetchImpl !== "function") throw new TypeError("fetchImpl must be a function");
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.fetchImpl = fetchImpl;
  }

  async listContacts(options = {}) {
    if (!options || typeof options !== "object" || Array.isArray(options)) {
      throw new TypeError("options must be an object");
    }
    if (Object.keys(options).length > 0) {
      throw new Error("pagination and filter options are not enabled until the live tRPC input contract is verified");
    }

    const url = new URL(`${this.baseUrl}/api/trpc/contacts.list`);
    const response = await this.fetchImpl(url, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    if (!response || typeof response.ok !== "boolean" || typeof response.json !== "function") {
      throw new TypeError("fetchImpl returned an invalid response");
    }
    if (!response.ok) throw new Error(`OutreachAI read failed with HTTP ${response.status}`);
    return translateTrpcContactsResponse(await response.json());
  }
}
