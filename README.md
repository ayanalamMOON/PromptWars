# PromptWars

[![CI](https://github.com/ayanalamMOON/PromptWars/actions/workflows/ci.yml/badge.svg)](https://github.com/ayanalamMOON/PromptWars/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/ayanalamMOON/PromptWars)](LICENSE)
[![Stars](https://img.shields.io/github/stars/ayanalamMOON/PromptWars?style=social)](https://github.com/ayanalamMOON/PromptWars)

PromptWars is a local-first AI prompt engineering tournament platform for live competitions, showcase demos, and judged prompt battles.

**Project website:** https://github.com/ayanalamMOON/PromptWars

## What’s inside

- **`prompt-wars/`** — the main Next.js tournament application
- **`PromptWars_App/`** — the standalone Windows app packaging workspace
- **`PromptWars_Windows_Standalone/`** — desktop runtime bundle and launcher assets
- **`Showcase_App/`** — a lightweight demo and presentation app
- **`PWDocs/`** — planning, architecture, and launch documentation

## Highlights

- Local LLM workflow tuned for constrained hardware like an RTX 4060 8GB
- Split generation and judging models for speed and consistency
- Master dashboard, participant views, admin controls, and spectator surfaces
- Tournament-ready flows for brackets, check-ins, matchmaking, and analytics
- Windows standalone packaging for offline and event-floor deployment

## Quick start

The primary app lives in `prompt-wars/`.

```bash
cd prompt-wars
npm install
npm run dev
```

If you also need the WebSocket server, install its dependencies inside `prompt-wars/ws-server/` and run it alongside the app.

## Environment

Configure the app in `prompt-wars/.env` or `prompt-wars/.env.local` with the Ollama endpoint and model names used for generation and judging.

## Build and test

```bash
npm run build
npm run test:run
```

## Architecture snapshot

- **Frontend:** Next.js App Router + React + Tailwind CSS
- **AI runtime:** Ollama-powered local models
- **State:** session-backed battle data and tournament flows
- **Deployment:** browser-based app plus optional standalone Windows bundle

## Documentation

- [Feature roadmap](PWDocs/PromptWars_Feature_Depth_Execution_Roadmap.md)
- [Platform management brief](PWDocs/PromptWars_Platform_Management_Brief.tex)

## License

Released under the MIT License. See [LICENSE](LICENSE).