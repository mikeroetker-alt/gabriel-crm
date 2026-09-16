import fs from 'node:fs';

const DEFAULT_ISSUE_NUMBER = 22;
const DEFAULT_MODEL = 'deepseek-flash';
const DEFAULT_MAX_CONTEXT_CHARS = 48000;

export function shouldHandleComment({ issueNumber, commentBody, targetIssue = DEFAULT_ISSUE_NUMBER }) {
  if (Number(issueNumber) !== Number(targetIssue)) return false;
  return /^\s*\/deepseek(?:\s|$)/i.test(String(commentBody || ''));
}

export function normalizeRequest(commentBody) {
  return String(commentBody || '').replace(/^\s*\/deepseek\s*/i, '').trim();
}

export function buildIssueContext({ issue, comments, requestBody, maxChars = DEFAULT_MAX_CONTEXT_CHARS }) {
  const ordered = Array.isArray(comments) ? comments : [];
  const rendered = ordered.map((comment) => {
    const author = comment?.user?.login || 'unknown';
    const body = String(comment?.body || '').trim();
    return `COMMENT BY ${author}:\n${body}`;
  });

  const header = [
    `REPOSITORY ISSUE #${issue?.number ?? DEFAULT_ISSUE_NUMBER}`,
    `TITLE: ${issue?.title || ''}`,
    `STATE: ${issue?.state || ''}`,
    `BODY:\n${String(issue?.body || '').trim()}`,
    '',
    'DISCUSSION:'
  ].join('\n');

  let context = `${header}\n${rendered.join('\n\n')}\n\nCURRENT /deepseek REQUEST:\n${requestBody}`;
  if (context.length <= maxChars) return context;

  const tailBudget = Math.max(4000, maxChars - header.length - requestBody.length - 200);
  const discussionTail = rendered.join('\n\n').slice(-tailBudget);
  context = `${header}\n[Earlier discussion truncated for context limit]\n${discussionTail}\n\nCURRENT /deepseek REQUEST:\n${requestBody}`;
  return context.slice(-maxChars);
}

export function extractDeepSeekText(payload) {
  const text = payload?.choices?.[0]?.message?.content;
  if (!text || !String(text).trim()) {
    throw new Error('DeepSeek returned no assistant content.');
  }
  return String(text).trim();
}

async function githubJson(fetchImpl, url, token, options = {}) {
  const response = await fetchImpl(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 1000)}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function fetchAllIssueComments(fetchImpl, repo, issueNumber, token) {
  const comments = [];
  for (let page = 1; page <= 5; page += 1) {
    const batch = await githubJson(
      fetchImpl,
      `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments?per_page=100&page=${page}`,
      token
    );
    comments.push(...batch);
    if (batch.length < 100) break;
  }
  return comments;
}

export async function runBridge({
  fetchImpl = fetch,
  event,
  env = process.env
}) {
  const repo = env.GITHUB_REPOSITORY;
  const githubToken = env.GITHUB_TOKEN;
  const deepseekApiKey = env.DEEPSEEK_API_KEY;
  const model = env.DEEPSEEK_MODEL || DEFAULT_MODEL;
  const targetIssue = Number(env.DEEPSEEK_TARGET_ISSUE || DEFAULT_ISSUE_NUMBER);

  if (!repo) throw new Error('GITHUB_REPOSITORY is required.');
  if (!githubToken) throw new Error('GITHUB_TOKEN is required.');
  if (!deepseekApiKey) throw new Error('DEEPSEEK_API_KEY GitHub Actions secret is required.');

  const issueNumber = event?.issue?.number;
  const commentBody = event?.comment?.body || '';
  if (!shouldHandleComment({ issueNumber, commentBody, targetIssue })) {
    return { handled: false, reason: 'not-a-deepseek-request' };
  }

  const requestBody = normalizeRequest(commentBody);
  if (!requestBody) {
    throw new Error('The /deepseek command requires a request after the command.');
  }

  const issue = await githubJson(
    fetchImpl,
    `https://api.github.com/repos/${repo}/issues/${issueNumber}`,
    githubToken
  );
  const comments = await fetchAllIssueComments(fetchImpl, repo, issueNumber, githubToken);
  const issueContext = buildIssueContext({ issue, comments, requestBody });

  const systemPrompt = [
    'You are DeepSeek participating directly in the Gabriel Impact Group multi-agent GitHub coordination bridge.',
    'Mike Roetker is the final authority and approval gate. Manus is project lead. Codex is technical implementation/review/testing. ChatGPT is coordination/review support.',
    'Treat the supplied GitHub Issue #22 content as the canonical project discussion for this response.',
    'Answer the current /deepseek request directly and independently. Do not claim to have taken repository actions; the bridge only posts your text response.',
    'If asked for a binding project vote, begin with exactly DEEPSEEK VOTE: A, DEEPSEEK VOTE: B, or DEEPSEEK VOTE: ABSTAIN as appropriate, then answer every requested field.',
    'Do not expose, request, or reproduce secrets. Do not invent facts that are absent from the supplied issue context.',
    'Keep responses decision-useful and concise.'
  ].join(' ');

  const deepseekResponse = await fetchImpl('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${deepseekApiKey}`
    },
    body: JSON.stringify({
      model,
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
    `Generated directly from the live Issue #${issueNumber} context via the repository DeepSeek bridge${sourceCommentUrl ? ` in response to ${sourceCommentUrl}` : ''}.`
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
    model,
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
