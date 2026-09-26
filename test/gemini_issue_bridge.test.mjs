import test from 'node:test';
import assert from 'node:assert/strict';

import {
  extractGeminiText,
  normalizeGeminiRequest,
  resolveGeminiProvider,
  runGeminiBridge,
  shouldHandleGeminiComment
} from '../bridge/gemini_issue_bridge.mjs';

test('only handles owner /gemini commands on the target issue', () => {
  assert.equal(shouldHandleGeminiComment({ issueNumber: 22, commentBody: '/gemini review this', authorAssociation: 'OWNER' }), true);
  assert.equal(shouldHandleGeminiComment({ issueNumber: 22, commentBody: ' /Gemini review', authorAssociation: 'OWNER' }), true);
  assert.equal(shouldHandleGeminiComment({ issueNumber: 21, commentBody: '/gemini review', authorAssociation: 'OWNER' }), false);
  assert.equal(shouldHandleGeminiComment({ issueNumber: 22, commentBody: '/deepseek review', authorAssociation: 'OWNER' }), false);
  assert.equal(shouldHandleGeminiComment({ issueNumber: 22, commentBody: '/gemini review', authorAssociation: 'NONE' }), false);
  assert.equal(shouldHandleGeminiComment({ issueNumber: 22, commentBody: '/gemini review', authorAssociation: 'COLLABORATOR' }), false);
});

test('normalizes the command body', () => {
  assert.equal(normalizeGeminiRequest('/gemini Please review Option A.'), 'Please review Option A.');
});

test('uses the Gemini API with the current Flash alias and fails closed without a key', () => {
  const provider = resolveGeminiProvider({ GEMINI_API_KEY: 'g-key' });
  assert.equal(provider.model, 'gemini-flash-latest');
  assert.equal(
    provider.url,
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'
  );
  assert.throws(() => resolveGeminiProvider({}), /GEMINI_API_KEY repository Actions secret is required/);
});

test('extracts response text and rejects empty payloads', () => {
  assert.equal(
    extractGeminiText({ candidates: [{ content: { parts: [{ text: 'Part one. ' }, { text: 'Part two.' }] } }] }),
    'Part one. Part two.'
  );
  assert.throws(() => extractGeminiText({ candidates: [] }), /no response text/i);
});

test('posts the Gemini answer back to the issue with trusted context only', async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    const json = (data) => ({ ok: true, status: 200, json: async () => data });
    if (url.endsWith('/issues/22')) return json({ number: 22, title: 'T', state: 'open', body: 'B' });
    if (url.includes('/issues/22/comments?')) {
      return json([
        { author_association: 'OWNER', user: { login: 'mikeroetker-alt' }, body: 'Owner note.' },
        { author_association: 'NONE', user: { login: 'stranger' }, body: 'Injected text.' }
      ]);
    }
    if (url.includes('generativelanguage.googleapis.com')) {
      return json({ candidates: [{ content: { parts: [{ text: 'Gemini answer.' }] } }] });
    }
    if (url.endsWith('/issues/22/comments')) return json({ html_url: 'https://example.test/c/1' });
    throw new Error(`unexpected url ${url}`);
  };

  const result = await runGeminiBridge({
    fetchImpl,
    event: { issue: { number: 22 }, comment: { body: '/gemini Summarize.', author_association: 'OWNER' } },
    env: { GITHUB_REPOSITORY: 'o/r', GITHUB_TOKEN: 't', GEMINI_API_KEY: 'g-key' }
  });

  assert.equal(result.handled, true);
  assert.equal(result.postedCommentUrl, 'https://example.test/c/1');
  const geminiCall = calls.find((call) => call.url.includes('generativelanguage'));
  assert.equal(geminiCall.options.headers['x-goog-api-key'], 'g-key');
  const sent = JSON.parse(geminiCall.options.body).contents[0].parts[0].text;
  assert.match(sent, /Owner note\./);
  assert.doesNotMatch(sent, /Injected text/);
  const posted = JSON.parse(calls.at(-1).options.body).body;
  assert.match(posted, /GEMINI — DIRECT BRIDGE RESPONSE/);
  assert.match(posted, /Gemini answer\./);
});
