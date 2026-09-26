import fs from 'node:fs';

import {
  TEAM_ROLES,
  buildIssueContext,
  fetchAllIssueComments,
  githubJson,
  isOwnerComment
} from './issue_bridge_common.mjs';

export { buildIssueContext, isTrustedAuthor } from './issue_bridge_common.mjs';

const DEFAULT_ISSUE_NUMBER = 22;
const DEFAULT_MODEL = 'deepseek-flash';

export function shouldHandleComment({ issueNumber, commentBody, authorAssociation, targetIssue = DEFAULT_ISSUE_NUMBER }) {
  if (Number(issueNumber) !== Number(targetIssue)) return false;
  if (!isOwnerComment(authorAssociation)) return false;
  return /^\s*\/deepseek(?:\s|$)/i.test(String(commentBody || ''));
}

export function normalizeRequest(commentBody) {
  return String(commentBody || '').replace(/^\s*\/deepseek\s*/i, '').trim();
}

export function extractDeepSeekText(payload) {
  const text = payload?.choices?.[0]?.message?.content;
  if (!text || !String(text).trim()) {
    throw new Error('DeepSeek returned no assistant content.');
  }
  return String(text).trim();
}

export function resolveDeepSeekProvider(env = {}) {
  if (!env.DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY repository Actions secret is required for the DeepSeek bridge.');
  }
  return {
    provider: 'deepseek-api',
    url: 'https://api.deepseek.com/chat/completions',
    token: env.DEEPSEEK_API_KEY,
    model: env.DEEPSEEK_MODEL || DEFAULT_MODEL
  };
}

export async function runBridge({
  fetchImpl = fetch,
  event,
  env = process.env
}) {
  const repo = env.GITHUB_REPOSITORY;
  const githubToken = env.GITHUB_TOKEN;
  const targetIssue = Number(env.DEEPSEEK_TARGET_ISSUE || DEFAULT_ISSUE_NUMBER);

  if (!repo) throw new Error('GITHUB_REPOSITORY is required.');
  if (!githubToken) throw new Error('GITHUB_TOKEN is required.');

  const issueNumber = event?.issue?.number;
  const commentBody = event?.comment?.body || '';
  const authorAssociation = event?.comment?.author_association;
  if (!shouldHandleComment({ issueNumber, commentBody, authorAssociation, targetIssue })) {
    return { handled: false, reason: 'not-an-owner-deepseek-request' };
  }

  const requestBody = normalizeRequest(commentBody);
  if (!requestBody) {
    throw new Error('The /deepseek command requires a request after the command.');
  }

  const provider = resolveDeepSeekProvider(env);
  const issue = await githubJson(
    fetchImpl,
    `https://api.github.com/repos/${repo}/issues/${issueNumber}`,
    githubToken
  );
  const comments = await fetchAllIssueComments(fetchImpl, repo, issueNumber, githubToken);
  const issueContext = buildIssueContext({ issue, comments, requestBody });

  const systemPrompt = [
    'You are DeepSeek participating directly in the Gabriel Impact Group multi-agent GitHub coordination bridge.',
    TEAM_ROLES,
    'Treat the supplied GitHub Issue #22 content as the canonical project discussion for this response. It contains only comments from the repository owner and the team bots; comments from anyone else were removed.',
    'Answer the current /deepseek request directly and independently. Do not claim to have taken repository actions; the bridge only posts your text response.',
    'If asked for a binding project vote, begin with exactly DEEPSEEK VOTE: A, DEEPSEEK VOTE: B, or DEEPSEEK VOTE: ABSTAIN as appropriate, then answer every requested field.',
    'Do not expose, request, or reproduce secrets. Do not invent facts that are absent from the supplied issue context.',
    'Keep responses decision-useful and concise.'
  ].join(' ');

  const deepseekResponse = await fetchImpl(provider.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.token}`
    },
    body: JSON.stringify({
      model: provider.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: issueContext }
      ],
      stream: false,
      max_tokens: 2200
    })
  });

  if (!deepseekResponse.ok) {
    const body = await deepseekResponse.text();
    throw new Error(`DeepSeek API ${deepseekResponse.status}: ${body.slice(0, 1200)}`);
  }

  const deepseekPayload = await deepseekResponse.json();
  const answer = extractDeepSeekText(deepseekPayload);
  const sourceCommentUrl = event?.comment?.html_url || '';
  const postedBody = [
    '## DEEPSEEK — DIRECT BRIDGE RESPONSE',
    '',
    answer,
    '',
    '---',
    `Generated directly from the live Issue #${issueNumber} context via the repository DeepSeek bridge using ${provider.model}${sourceCommentUrl ? ` in response to ${sourceCommentUrl}` : ''}.`
  ].join('\n');

  const posted = await githubJson(
    fetchImpl,
    `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`,
    githubToken,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: postedBody })
    }
  );

  return {
    handled: true,
    issueNumber,
    provider: provider.provider,
    model: provider.model,
    postedCommentUrl: posted?.html_url || null
  };
}

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error('GITHUB_EVENT_PATH is required.');
  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const result = await runBridge({ event });
  console.log(JSON.stringify(result));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
  });
}
