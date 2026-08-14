import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  CONTACTS_PAGE_SIZE_MAX,
  OutreachAIContactsAdapter,
  validateContactsEnvelope
} from "../bridge/outreachai_adapter.mjs";

const fixture = JSON.parse(await readFile(new URL("../bridge/fixtures/contacts-page.synthetic.json", import.meta.url)));

test("the sanitized fixture satisfies the contacts contract", () => {
  assert.equal(validateContactsEnvelope(fixture), fixture);
});

test("the adapter constructs only a GET request to the configured endpoint", async () => {
  let request;
  const adapter = new OutreachAIContactsAdapter({
    baseUrl: "https://example.invalid/",
    fetchImpl: async (url, init) => {
      request = { url, init };
      return { ok: true, status: 200, json: async () => fixture };
    }
  });
  await adapter.listContacts({ limit: 100, cursor: "fixture-cursor-page-1" });
  assert.equal(request.init.method, "GET");
  assert.equal(request.url.origin, "https://example.invalid");
  assert.equal(request.url.pathname, "/api/contacts");
  assert.equal(request.url.searchParams.get("cursor"), "fixture-cursor-page-1");
});

test("stable contact IDs are required and unique", () => {
  const duplicate = structuredClone(fixture);
  duplicate.contacts[1].id = duplicate.contacts[0].id;
  assert.throws(() => validateContactsEnvelope(duplicate), /duplicate contact id/);
});

test("contact pipeline and stage must be non-empty strings", () => {
  const invalidPipeline = structuredClone(fixture);
  invalidPipeline.contacts[0].pipeline = null;
  assert.throws(() => validateContactsEnvelope(invalidPipeline), /pipeline/);

  const invalidStage = structuredClone(fixture);
  invalidStage.contacts[0].stage = 42;
  assert.throws(() => validateContactsEnvelope(invalidStage), /stage/);
});

test("cursor metadata is either null or a non-empty string", () => {
  const invalid = structuredClone(fixture);
  invalid.page.nextCursor = "";
  assert.throws(() => validateContactsEnvelope(invalid), /nextCursor/);
});

test("aggregate pipeline counts must equal the response total", () => {
  const invalid = structuredClone(fixture);
  invalid.countsByPipeline.HVAC += 1;
  assert.throws(() => validateContactsEnvelope(invalid), /sum to response.total/);
});

test("page sizes are bounded before any request is made", async () => {
  let requested = false;
  const adapter = new OutreachAIContactsAdapter({
    baseUrl: "https://example.invalid",
    fetchImpl: async () => { requested = true; }
  });
  await assert.rejects(adapter.listContacts({ limit: CONTACTS_PAGE_SIZE_MAX + 1 }), /limit/);
  assert.equal(requested, false);
});
