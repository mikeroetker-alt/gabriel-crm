import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOtterlyExport, createEvidenceManifest } from '../pilot/otterly-import.mjs';

const raw = { response_id: 'synthetic-run-1', prompt: 'Which fictional firms exist?',
  engine: 'chatgpt', timestamp: '2026-09-11T12:00:00Z', response_text: 'Synthetic answer.', citations: [] };
const normalized = () => normalizeOtterlyExport([raw], { mainBrand: 'Demo' })[0];
const reviewed = () => ({ ...normalized(), reviewStatus: 'approved', runState: 'completed',
  effectiveLocation: 'us', modelVersion: 'synthetic-version' });

test('repeated provider observations cannot increase sample size by changing row index or payload', () => {
  const first = normalized();
  assert.throws(() => createEvidenceManifest([first, { ...first, sourceRow: 1 }]), /Duplicate/);
  assert.throws(() => createEvidenceManifest([first, { ...first, sourceRow: 2, rawHash: 'a'.repeat(64) }]), /Duplicate/);
});

test('different provider runs remain distinct even when answer text is identical', () => {
  const first = normalized();
  const second = normalizeOtterlyExport([{ ...raw, response_id: 'synthetic-run-2' }], { mainBrand: 'Demo' })[0];
  assert.equal(createEvidenceManifest([first, second]).observationCount, 2);
});

test('review approval cannot turn failed, pending or unknown runs into headline evidence', () => {
  for (const runState of ['failed', 'pending', 'unavailable-in-export', undefined, null, '']) {
    assert.equal(createEvidenceManifest([{ ...reviewed(), runState }]).readyForHeadlineReporting, false);
  }
});

test('headline evidence requires response and nonblank capture metadata', () => {
  assert.equal(createEvidenceManifest([reviewed()]).readyForHeadlineReporting, true);
  for (const key of ['response', 'effectiveLocation', 'modelVersion']) {
    for (const value of [null, undefined, '', '   ', true]) {
      assert.equal(createEvidenceManifest([{ ...reviewed(), [key]: value }]).readyForHeadlineReporting, false);
    }
  }
});

test('malformed identity or hash is rejected instead of counted', () => {
  for (const row of [null, {}, { ...normalized(), providerResponseRef: '' }, { ...normalized(), rawHash: 'not-a-hash' }]) {
    assert.throws(() => createEvidenceManifest([row]), TypeError);
  }
});
