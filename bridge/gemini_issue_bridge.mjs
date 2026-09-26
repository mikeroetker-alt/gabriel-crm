import fs from 'node:fs';

import {
  TEAM_ROLES,
  buildIssueContext,
  fetchAllIssueComments,
  githubJson,
  isOwnerComment
} from './issue_bridge_common.mjs';

const DEFAULT_ISSUE_NUMBER = 22;
// Google's alias for its current Flash model, so upgrades need no code change.
const DEFAULT_MODEL = 'gemini-flash-latest';
// Newer AI Studio keys start with "AQ." and are rejected by the Gemini API
// (ACCESS_TOKEN_TYPE_UNSUPPORTED). Vertex AI express mode accepts them.
const DEFAULT_VERTEX_MODEL = 'gemini-3.5-flash';
const VERTEX_EXPRESS_BASE = 'https://aiplatform.googleapis.com/v1/publishers/google/models';

export function shouldHandleGeminiComment({ issueNumber, commentBody, authorAssociation, targetIssue = DEFAULT_ISSUE_NUMBER }) {
  if (Number(issueNumber) !== Number(targetIssue)) return false;
  if (!isOwnerComment(authorAssociation)) return false;
  return /^\s*\/gemini(?:\s|$)/i.test(String(commentBody || ''));
}

export function normalizeGeminiRequest(commentBody) {
  return String(commentBody || '').replace(/^\s*\/gemini\s*/i, '').trim();
}

export function resolveGeminiProvider(env = {}) {
  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY repository Actions secret is required for the Gemini bridge.');
  }
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  const vertexModel = env.GEMINI_VERTEX_MODEL || DEFAULT_VERTEX_MODEL;
  return {
    provider: 'gemini-api',
    url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    token: env.GEMINI_API_KEY,
    model,
    vertexUrl: `${VERTEX_EXPRESS_BASE}/${vertexModel}:generateContent`,
    vertexModel
  };
}

export function isUnsupportedAuthKeyError(status, bodyText) {
  return status === 401 && /ACCESS_TOKEN_TYPE_UNSUPPORTED/.test(String(bodyText || ''));
}

export function extractGeminiText(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts) ? parts.map((part) => part?.text || '').join('') : '';
  if (!text.trim()) {
    throw new Error('Gemini returned no response text.');
  }
  return text.trim();
}

export async function runGeminiBridge({
  fetchImpl = fetch,
  event,
  env = process.env
}) {
  const repo = env.GITHUB_REPOSITORY;
  const githubToken = env.GITHUB_TOKEN;
  const targetIssue = Number(env.GEMINI_TARGET_ISSUE || DEFAULT_ISSUE_NUMBER);

  if (!repo) throw new Error('GITHUB_REPOSITORY is required.');
  if (!githubToken) throw new Error('GITHUB_TOKEN is required.');

  const issueNumber = event?.issue?.number;
  const commentBody = event?.comment?.body || '';
  const authorAssociation = event?.comment?.author_association;
  if (!shouldHandleGeminiComment({ issueNumber, commentBody, authorAssociation, targetIssue })) {
    return { handled: false, reason: 'not-an-owner-gemini-request' };
  }

  const requestBody = normalizeGeminiRequest(commentBody);
  if (!requestBody) {
    throw new Error('The /gemini command requires a request after the command.');
  }

  const provider = resolveGeminiProvider(env);
  const issue = await githubJson(
    fetchImpl,
    `https://api.github.com/repos/${repo}/issues/${issueNumber}`,
    githubToken
  );
  const comments = await fetchAllIssueComments(fetchImpl, repo, issueNumber, githubToken);
  const issueContext = buildIssueContext({ issue, comments, requestBody, command: '/gemini' });

  const systemPrompt = [
    'You are Google Gemini participating in the Gabriel Impact Group multi-agent GitHub coordination bridge.',
    TEAM_ROLES,
    `Treat the supplied GitHub Issue #${issueNumber} content as the project discussion for this response. It contains only comments from the repository owner and the team bots.`,
    'Answer the current /gemini request directly and independently. Do not claim to have taken repository actions; the bridge only posts your text response.',
    'Do not expose, request, or reproduce secrets. Do not invent facts that are absent from the supplied issue context.',
    'Keep responses decision-useful and concise.'
  ].join(' ');

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: issueContext }] }],
    generationConfig: { maxOutputTokens: 2200 }
  });
  const post = (url) => fetchImpl(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': provider.token
    },
    body: payload
  });

  let geminiResponse = await post(provider.url);
  let usedModel = provider.model;
  if (!geminiResponse.ok) {
    const body = await geminiResponse.text();
    if (!isUnsupportedAuthKeyError(geminiResponse.status, body)) {
      throw new Error(`Gemini API ${geminiResponse.status}: ${body.slice(0, 1200)}`);
    }
    geminiResponse = await post(provider.vertexUrl);
    usedModel = `${provider.vertexModel} (Vertex AI express)`;
    if (!geminiResponse.ok) {
      const vertexBody = await geminiResponse.text();
      throw new Error(`Gemini Vertex express ${geminiResponse.status}: ${vertexBody.slice(0, 1200)}`);
    }
  }

  const answer = extractGeminiText(await geminiResponse.json());
  const sourceCommentUrl = event?.comment?.html_url || '';
  const postedBody = [
    '## GEMINI — DIRECT BRIDGE RESPONSE',
    '',
    answer,
    '',
    '---',
    `Generated from the live Issue #${issueNumber} context via the repository Gemini bridge using ${usedModel}${sourceCommentUrl ? ` in response to ${sourceCommentUrl}` : ''}.`
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
    model: usedModel,
    postedCommentUrl: posted?.html_url || null
  };
}

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error('GITHUB_EVENT_PATH is required.');
  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const result = await runGeminiBridge({ event });
  console.log(JSON.stringify(result));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
  });
}
