# Eachoflux V2

Advanced Jarvis-style UI for Eachoflux.

## Features
- Animated AI core/orb
- Voice input
- Voice output with browser speech synthesis
- Local conversation memory
- Quick command cards
- Settings panel
- AI/local connection status
- Responsive iPhone/desktop UI
- Cloudflare Pages Function for server-side OpenAI API calls

## Cloudflare deployment
Upload the project to GitHub and connect the repository to Cloudflare Pages.

Then add an encrypted secret:
`OPENAI_API_KEY`

Optional variable:
`OPENAI_MODEL`

Do not put an API key in `index.html`.

Cloudflare automatically exposes `functions/api/chat.js` at `/api/chat`.
