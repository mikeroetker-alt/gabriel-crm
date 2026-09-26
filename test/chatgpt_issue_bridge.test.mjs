import test from 'node:test';
import assert from 'node:assert/strict';

import {
  extractChatGptText,
  normalizeChatGptRequest,
  resolveChatGptProvider,
  runChatGptBridge,
  shouldHandleChatGptComment
} from '../bridge/chatgpt_issue_bridge.mjs';

test('only handles owner /chatgpt commands on the target issue', () => {
  assert.equal(shouldHandleChatGptComment({ issueNumber: 22, commentBody: '/chatgpt review this', authorAssociation: 'OWNER' }), true);
  assert.equal(shouldHandleChatGptComment({ issueNumber: 22, commentBody: ' /ChatGPT review', authorAssociation: 'OWNER' }), true);
  assert.equal(shouldHandleChatGptComment({ issueNumber: 21, commentBody: '/chatgpt review', authorAssociation: 'OWNER' }), false);
  assert.equal(shouldHandleChatGptComment({ issueNumber: 22, commentBody: '/gemini review', authorAssociation: 'OWNER' }), false);
  assert.equal(shouldHandleChatGptComment({ issueNumber: 22, commentBody: '/chatgpt review', authorAssociation: 'NONE' }), false);
  assert.equal(shouldHandleChatGptComment({ issueNumber: 22, commentBody: '/chatgpt review', authorAssociation: 'COLLABORATOR' }), false);
});

test('normalizes the command body', () => {
  assert.equal(normalizeChatGptRequest('/chatgpt Please review Option A.'), 'Please review Option A.');
});

test('uses the OpenAI API, honours the model override and fails closed without a key', () => {
  const provider = resolveChatGptProvider({ OPENAI_API_KEY: 'o-key' });
  assert.equal(provider.url, 'https://api.openai.com/v1/chat/completions');
  assert.equal(provider.model, 'gpt-6-sol');
  assert.equal(resolveChatGptProvider({ OPENAI_API_KEY: 'o-key', OPENAI_MODEL: 'other-model' }).model, 'other-model');
  assert.equal(resolveChatGptProvider({ OPENAI_API_KEY: 'o-key', OPENAI_MODEL: '' }).model, 'gpt-6-sol');
  assert.throws(() => resolveChatGptProvider({}), /OPENAI_API_KEY repository Actions secret is required/);
});

test('extracts response text and rejects empty payloads', () => {
  assert.equal(extractChatGptText({ choices: [{ message: { content: 'Answer.' } }] }), 'Answer.');
  assert.throws(() => extractChatGptText({ choices: [] }), /no response text/i);
});

test('posts the ChatGPT answer back to the issue with trusted context only', async () => {
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
    if (url === 'https://api.openai.com/v1/chat/completions') {
      return json({ choices: [{ message: { content: 'ChatGPT answer.' } }] });
    }
    if (url.endsWith('/issues/22/comments')) return json({ html_url: 'https://example.test/c/2' });
    throw new Error(`unexpected url ${url}`);
  };

  const result = await runChatGptBridge({
    fetchImpl,
    event: { issue: { number: 22 }, comment: { body: '/chatgpt Summarize.', author_association: 'OWNER' } },
    env: { GITHUB_REPOSITORY: 'o/r', GITHUB_TOKEN: 't', OPENAI_API_KEY: 'o-key' }
  });

  assert.equal(result.handled, true);
  const call = calls.find((c) => c.url.includes('api.openai.com'));
  assert.equal(call.options.headers.Authorization, 'Bearer o-key');
  const body = JSON.parse(call.options.body);
  assert.equal(body.max_completion_tokens, 2200);
  assert.match(body.messages[1].content, /Owner note\./);
  assert.doesNotMatch(body.messages[1].content, /Injected text/);
  const posted = JSON.parse(calls.at(-1).options.body).body;
  assert.match(posted, /CHATGPT — DIRECT BRIDGE RESPONSE/);
  assert.match(posted, /ChatGPT answer\./);
});
