import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildIssueContext,
  extractDeepSeekText,
  normalizeRequest,
  shouldHandleComment
} from '../bridge/deepseek_issue_bridge.mjs';

test('only handles /deepseek commands on the canonical issue', () => {
  assert.equal(shouldHandleComment({ issueNumber: 22, commentBody: '/deepseek vote now' }), true);
  assert.equal(shouldHandleComment({ issueNumber: 22, commentBody: '  /DeepSeek vote now' }), true);
  assert.equal(shouldHandleComment({ issueNumber: 21, commentBody: '/deepseek vote now' }), false);
  assert.equal(shouldHandleComment({ issueNumber: 22, commentBody: 'DEEPSEEK VOTE: A' }), false);
});

test('normalizes the command body', () => {
  assert.equal(normalizeRequest('/deepseek Please review Option A.'), 'Please review Option A.');
  assert.equal(normalizeRequest(' /DeepSeek\nVote on this.'), 'Vote on this.');
});

test('builds bounded issue context including live discussion and current request', () => {
  const context = buildIssueContext({
    issue: { number: 22, title: 'Decision', state: 'open', body: 'Canonical body' },
    comments: [
      { user: { login: 'manus' }, body: 'Option A proposed.' },
      { user: { login: 'codex' }, body: 'CODEX VOTE: A' }
    ],
    requestBody: 'Cast the DeepSeek vote.',
    maxChars: 5000
  });

  assert.match(context, /REPOSITORY ISSUE #22/);
  assert.match(context, /COMMENT BY manus/);
  assert.match(context, /CODEX VOTE: A/);
  assert.match(context, /CURRENT \/deepseek REQUEST:\nCast the DeepSeek vote\./);
});

test('truncates oversized context without losing the current request', () => {
  const huge = 'x'.repeat(20000);
  const context = buildIssueContext({
    issue: { number: 22, title: 'Decision', state: 'open', body: huge },
    comments: [{ user: { login: 'a' }, body: huge }],
    requestBody: 'Important final request',
    maxChars: 5000
  });

  assert.ok(context.length <= 5000);
  assert.match(context, /Important final request/);
});

test('extracts assistant content and rejects empty payloads', () => {
  assert.equal(
    extractDeepSeekText({ choices: [{ message: { content: 'DEEPSEEK VOTE: A' } }] }),
    'DEEPSEEK VOTE: A'
  );
  assert.throws(() => extractDeepSeekText({ choices: [] }), /no assistant content/i);
});
