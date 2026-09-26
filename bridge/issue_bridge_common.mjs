// Shared helpers for the GitHub issue bridges (DeepSeek, Gemini).

export const DEFAULT_MAX_CONTEXT_CHARS = 48000;

// Every team member posts through the owner account or one of these bots.
export const TRUSTED_BOT_LOGINS = ['github-actions[bot]', 'claude[bot]'];

export const TEAM_ROLES =
  'Mike Roetker is the owner, final authority and approval gate. Claude is project lead. Manus is co-lead and main execution partner. Codex is technical implementation, review and testing. DeepSeek and Gemini give independent analysis on request.';

export function isOwnerComment(authorAssociation) {
  return authorAssociation === 'OWNER';
}

export function isTrustedAuthor(comment) {
  if (isOwnerComment(comment?.author_association)) return true;
  return TRUSTED_BOT_LOGINS.includes(comment?.user?.login);
}

export function buildIssueContext({
  issue,
  comments,
  requestBody,
  command = '/deepseek',
  maxChars = DEFAULT_MAX_CONTEXT_CHARS
}) {
  const all = Array.isArray(comments) ? comments : [];
  const trusted = all.filter(isTrustedAuthor);
  const excluded = all.length - trusted.length;
  const rendered = trusted.map((comment) => {
    const author = comment?.user?.login || 'unknown';
    const body = String(comment?.body || '').trim();
    return `COMMENT BY ${author}:\n${body}`;
  });

  const header = [
    `REPOSITORY ISSUE #${issue?.number ?? ''}`,
    `TITLE: ${issue?.title || ''}`,
    `STATE: ${issue?.state || ''}`,
    `BODY:\n${String(issue?.body || '').trim()}`,
    '',
    excluded > 0
      ? `DISCUSSION (${excluded} comment(s) from untrusted authors excluded):`
      : 'DISCUSSION:'
  ].join('\n');

  const requestLabel = `CURRENT ${command} REQUEST:`;
  let context = `${header}\n${rendered.join('\n\n')}\n\n${requestLabel}\n${requestBody}`;
  if (context.length <= maxChars) return context;

  const tailBudget = Math.max(4000, maxChars - header.length - requestBody.length - 200);
  const discussionTail = rendered.join('\n\n').slice(-tailBudget);
  context = `${header}\n[Earlier discussion truncated for context limit]\n${discussionTail}\n\n${requestLabel}\n${requestBody}`;
  return context.slice(-maxChars);
}

export async function githubJson(fetchImpl, url, token, options = {}) {
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

export async function fetchAllIssueComments(fetchImpl, repo, issueNumber, token) {
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
