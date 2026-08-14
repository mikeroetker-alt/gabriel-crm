import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  OutreachAIContactsAdapter,
  translateTrpcContactsResponse,
  validateContactsEnvelope
} from "../bridge/outreachai_adapter.mjs";

const fixture = JSON.parse(await readFile(new URL("../bridge/fixtures/contacts-page.synthetic.json", import.meta.url)));
const trpcFixture = JSON.parse(await readFile(new URL("../bridge/fixtures/contacts-list-trpc.synthetic.json", import.meta.url)));

test("the legacy synthetic normalized fixture still satisfies the internal contacts contract", () => {
  assert.equal(validateContactsEnvelope(fixture), fixture);
});

test("tRPC contacts.list translates status to internal stage without inventing pagination or aggregates", () => {
  const translated = translateTrpcContactsResponse(trpcFixture);
  assert.deepEqual(translated, {
    contacts: [
      { id: "fixture-trpc-001", pipeline: "HVAC", stage: "New Lead" },
      { id: "fixture-trpc-002", pipeline: "Bank", stage: "Qualified" }
    ],
    total: 1508
  });
  assert.equal("page" in translated, false);
  assert.equal("countsByPipeline" in translated, false);
});

test("the adapter uses only GET on the verified contacts.list tRPC route", async () => {
  let request;
  const adapter = new OutreachAIContactsAdapter({
    baseUrl: "https://example.invalid/",
    fetchImpl: async (url, init) => {
      request = { url, init };
      return { ok: true, status: 200, json: async () => trpcFixture };
    }
  });
  const translated = await adapter.listContacts();
  assert.equal(request.init.method, "GET");
  assert.equal(request.url.origin, "https://example.invalid");
  assert.equal(request.url.pathname, "/api/trpc/contacts.list");
  assert.equal(request.url.search, "");
  assert.equal(translated.total, 1508);
});

test("unverified pagination and filter options are rejected before any request", async () => {
  let requested = false;
  const adapter = new OutreachAIContactsAdapter({
    baseUrl: "https://example.invalid",
    fetchImpl: async () => { requested = true; }
  });
  await assert.rejects(adapter.listContacts({ limit: 100 }), /not enabled/);
  assert.equal(requested, false);
});

test("stable normalized contact IDs are required and unique", () => {
  const duplicate = structuredClone(fixture);
  duplicate.contacts[1].id = duplicate.contacts[0].id;
  assert.throws(() => validateContactsEnvelope(duplicate), /duplicate contact id/);
});

test("normalized pipeline and stage must be non-empty strings", () => {
  const invalidPipeline = structuredClone(fixture);
  invalidPipeline.contacts[0].pipeline = null;
  assert.throws(() => validateContactsEnvelope(invalidPipeline), /pipeline/);

  const invalidStage = structuredClone(fixture);
  invalidStage.contacts[0].stage = 42;
  assert.throws(() => validateContactsEnvelope(invalidStage), /stage/);
});

test("tRPC contacts require id, pipeline, and status strings", () => {
  const invalidStatus = structuredClone(trpcFixture);
  invalidStatus.result.data.json.contacts[0].status = null;
  assert.throws(() => translateTrpcContactsResponse(invalidStatus), /status/);

  const invalidPipeline = structuredClone(trpcFixture);
  invalidPipeline.result.data.json.contacts[0].pipeline = 42;
  assert.throws(() => translateTrpcContactsResponse(invalidPipeline), /pipeline/);
});

test("malformed tRPC envelopes are rejected", () => {
  assert.throws(() => translateTrpcContactsResponse({}), /result\.data\.json/);

  const invalidContacts = structuredClone(trpcFixture);
  invalidContacts.result.data.json.contacts = {};
  assert.throws(() => translateTrpcContactsResponse(invalidContacts), /contacts must be an array/);
});

test("optional legacy cursor metadata must be null or a non-empty string", () => {
  const invalid = structuredClone(fixture);
  invalid.page.nextCursor = "";
  assert.throws(() => validateContactsEnvelope(invalid), /nextCursor/);
});

test("optional legacy aggregate pipeline counts must equal the response total", () => {
  const invalid = structuredClone(fixture);
  invalid.countsByPipeline.HVAC += 1;
  assert.throws(() => validateContactsEnvelope(invalid), /sum to response.total/);
});
