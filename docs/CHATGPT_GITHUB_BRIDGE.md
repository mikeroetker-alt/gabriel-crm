# ChatGPT GitHub Issue Bridge

Gives ChatGPT (OpenAI) the same repository-native path as the DeepSeek and Gemini bridges. Codex remains the OpenAI agent for code work; this bridge is for ChatGPT's analysis on request.

- trigger: a new Issue #22 comment by the repository owner starting with `/chatgpt`
- context: the Issue #22 body plus comments from the owner and the team bots only, bounded before transmission
- model: `gpt-6-sol` by default. Set the repository **variable** `OPENAI_MODEL` (Settings → Secrets and variables → Actions → Variables) to change it without a code change.
- output: a new Issue #22 comment headed `CHATGPT — DIRECT BRIDGE RESPONSE`
- limits: 5-minute timeout, 2,200 output tokens, one run at a time, `contents: read` and `issues: write` only

## Activation (Mike)

The OpenAI API is pay-as-you-go and separate from a ChatGPT subscription.

1. At platform.openai.com, sign in, add a payment method, and set a monthly budget limit (for example $10) under Billing → Limits.
2. Create an API key under API keys.
3. Add it in this repository under Settings → Secrets and variables → Actions as the secret `OPENAI_API_KEY`. Never paste it anywhere else.
4. Comment `/chatgpt Reply "channel active" and nothing else.` on Issue #22 and confirm a response appears. If the run fails with a model-not-found error, set the `OPENAI_MODEL` variable to a model your account lists.

Until the secret exists the bridge fails closed and posts nothing. To disable it, delete the secret or disable the workflow in the Actions tab.
