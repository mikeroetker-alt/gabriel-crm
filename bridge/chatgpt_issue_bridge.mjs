import fs from 'node:fs';

import {
  TEAM_ROLES,
  buildIssueContext,
  fetchAllIssueComments,
  githubJson,
  isOwnerComment
} from './issue_bridge_common.mjs';

const DEFAULT_ISSUE_NUMBER = 22;
// Override with the OPENAI_MODEL repository variable; no code change needed.
const DEFAULT_MODEL = 'gpt-6-sol';

export function shouldHandleChatGptComment({ issueNumber, commentBody, authorAssociation, targetIssue = DEFAULT_ISSUE_NUMBER }) {
  if (Number(issueNumber) !== Number(targetIssue)) return false;
  if (!isOwnerComment(authorAssociation)) return false;
  return /^\s*\/chatgpt(?:\s|$)/i.test(String(commentBody || ''));
}

export function normalizeChatGptRequest(commentBody) {
  return String(commentBody || '').replace(/^\s*\/chatgpt\s*/i, '').trim();
}

export function resolveChatGptProvider(env = {}) {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY repository Actions secret is required for the ChatGPT bridge.');
  }
  return {
    provider: 'openai-api',
    url: 'https://api.openai.com/v1/chat/completions',
    token: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL || DEFAULT_MODEL
  };
}

export function extractChatGptText(payload) {
  const text = payload?.choices?.[0]?.message?.content;
  if (!text || !String(text).trim()) {
    throw new Error('ChatGPT returned no response text.');
  }
  return String(text).trim();
}

export async function runChatGptBridge({
  fetchImpl = fetch,
  event,
  env = process.env
}) {
  const repo = env.GITHUB_REPOSITORY;
  const githubToken = env.GITHUB_TOKEN;
  const targetIssue = Number(env.OPENAI_TARGET_ISSUE || DEFAULT_ISSUE_NUMBER);

  if (!repo) throw new Error('GITHUB_REPOSITORY is required.');
  if (!githubToken) throw new Error('GITHUB_TOKEN is required.');

  const issueNumber = event?.issue?.number;
  const commentBody = event?.comment?.body || '';
  const authorAssociation = event?.comment?.author_association;
  if (!shouldHandleChatGptComment({ issueNumber, commentBody, authorAssociation, targetIssue })) {
    return { handled: false, reason: 'not-an-owner-chatgpt-request' };
  }

  const requestBody = normalizeChatGptRequest(commentBody);
  if (!requestBody) {
    throw new Error('The /chatgpt command requires a request after the command.');
  }

  const provider = resolveChatGptProvider(env);
  const issue = await githubJson(
    fetchImpl,
    `https://api.github.com/repos/${repo}/issues/${issueNumber}`,
    githubToken
  );
  const comments = await fetchAllIssueComments(fetchImpl, repo, issueNumber, githubToken);
  const issueContext = buildIssueContext({ issue, comments, requestBody, command: '/chatgpt' });

  const systemPrompt = [
    'You are ChatGPT (OpenAI) participating in the Gabriel Impact Group multi-agent GitHub coordination bridge.',
    TEAM_ROLES,
    `Treat the supplied GitHub Issue #${issueNumber} content as the project discussion for this response. It contains only comments from the repository owner and the team bots.`,
    'Answer the current /chatgpt request directly and independently. Do not claim to have taken repository actions; the bridge only posts your text response.',
    'Do not expose, request, or reproduce secrets. Do not invent facts that are absent from the supplied issue context.',
    'Keep responses decision-useful and concise.'
  ].join(' ');

  const openaiResponse = await fetchImpl(provider.url, {
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
      max_completion_tokens: 2200
    })
  });

  if (!openaiResponse.ok) {
    const body = await openaiResponse.text();
    throw new Error(`OpenAI API ${openaiResponse.status}: ${body.slice(0, 1200)}`);
  }

  const answer = extractChatGptText(await openaiResponse.json());
  const sourceCommentUrl = event?.comment?.html_url || '';
  const postedBody = [
    '## CHATGPT — DIRECT BRIDGE RESPONSE',
    '',
    answer,
    '',
    '---',
    `Generated from the live Issue #${issueNumber} context via the repository ChatGPT bridge using ${provider.model}${sourceCommentUrl ? ` in response to ${sourceCommentUrl}` : ''}.`
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
  const result = await runChatGptBridge({ event });
  console.log(JSON.stringify(result));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
  });
}
