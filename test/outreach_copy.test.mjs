import test from "node:test";
import assert from "node:assert/strict";
import { renderInitialSnapshotMessage, renderSnapshotFollowup, renderServiceInvitation } from "../pilot/outreach-copy.mjs";

const fixture = {
  businessName: "Example HVAC",
  decisionMaker: "Taylor",
  senderName: "Mike",
  snapshotUrl: "https://staging.example/snapshot/123",
  unsubscribeUrl: "https://staging.example/unsubscribe/123",
};

test("all staged outreach messages carry the private snapshot and opt-out links", () => {
  for (const render of [renderInitialSnapshotMessage, renderSnapshotFollowup, renderServiceInvitation]) {
    const message = render(fixture);
    assert.match(message.subject, /Example HVAC/);
    assert.match(message.text, /private snapshot/i);
    assert.match(message.text, /https:\/\/staging\.example\/snapshot\/123/);
    assert.match(message.text, /Stop future email: https:\/\/staging\.example\/unsubscribe\/123/);
  }
});

test("initial message discloses sampling and avoids an outcome promise", () => {
  const { text } = renderInitialSnapshotMessage(fixture);
  assert.match(text, /sampled measurement, not a universal ranking/i);
  assert.match(text, /does not promise leads or placement/i);
});

test("service invitation states the proposed price and limits", () => {
  const { text } = renderServiceInvitation(fixture);
  assert.match(text, /proposed \$197\/month service/i);
  assert.match(text, /cannot guarantee mentions, rankings, citations, leads, traffic, or revenue/i);
});

test("rendering fails closed when delivery fields are absent", () => {
  assert.throws(() => renderInitialSnapshotMessage({ ...fixture, unsubscribeUrl: "" }), /unsubscribeUrl/);
});

