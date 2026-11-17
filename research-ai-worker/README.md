# Dabit Bista Research AI Assistant

This is a review-stage implementation. It is NOT live until the pull request is merged and a Cloudflare Worker is deployed.

## Architecture
- GitHub Pages hosts the floating accessible chat widget (research-ai.js and research-ai.css).
- Cloudflare Worker (research-ai-worker/) keeps the OpenAI API key private and retrieves relevant curated public-source snippets.
- Source links are shown with responses. Working papers are not presented as published findings.
- No visitor conversations are deliberately persisted.

## Setup (required before merging)
1. Create an OpenAI API key in your own OpenAI API account and configure a low project budget.
2. Create a free Cloudflare account and install Node.js 20+.
3. In a terminal: `cd research-ai-worker && npm install && npx wrangler login`.
4. Run `npx wrangler secret put OPENAI_API_KEY` and paste the key in the secure terminal prompt. **Never commit keys.**
5. Run `npx wrangler deploy` and copy the resulting `https://...workers.dev` URL.
6. In `research-ai.js`, replace `const ENDPOINT='';` with `const ENDPOINT='https://YOUR-WORKER.workers.dev/chat';`.
7. Test `/health` and a chat request from the website before merging this pull request.

## Research content
Update `research-ai-worker/src/knowledge.json` with carefully verified findings and DOI links. The initial dataset is limited to public descriptions from the website; it does NOT claim paper-level quantitative findings. Redeploy the Worker after changing the knowledge base.

## Security and operational notes
The API key stays in a Cloudflare secret. CORS checks restrict browser origins but are not authentication or sufficient abuse protection. **Before public launch**, add Cloudflare rate limiting / Turnstile and a spending cap; consider Cloudflare WAF rules. Avoid sending private or unpublished confidential material to the API. Do not merge with a blank ENDPOINT; the UI will explain it is not configured.