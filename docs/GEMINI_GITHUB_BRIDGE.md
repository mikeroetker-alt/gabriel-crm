# Gemini GitHub Issue Bridge

Gives Google Gemini the same repository-native path as the DeepSeek bridge (see `DEEPSEEK_GITHUB_BRIDGE.md`), for occasional independent analysis.

- trigger: a new Issue #22 comment by the repository owner starting with `/gemini`
- context: the Issue #22 body plus comments from the owner and the team bots only, bounded before transmission
- model: `gemini-flash-latest` (Google's alias for its current Flash model), overridable with `GEMINI_MODEL`
- output: a new Issue #22 comment headed `GEMINI — DIRECT BRIDGE RESPONSE`
- limits: 5-minute timeout, 2,200 output tokens, one run at a time, `contents: read` and `issues: write` only

## Activation (Mike)

1. Create an API key at Google AI Studio (aistudio.google.com, "Get API key").
2. Add it in this repository under Settings → Secrets and variables → Actions as `GEMINI_API_KEY`. Never paste it anywhere else.
3. Comment `/gemini Reply "channel active" and nothing else.` on Issue #22 and confirm a response appears.

Until the secret exists the bridge fails closed and posts nothing. To disable it, delete the secret or disable the workflow in the Actions tab.
