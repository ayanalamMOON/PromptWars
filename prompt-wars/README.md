# Prompt Wars: The Arena

Real-time tournament platform for **GLITCH Tech Fest 2026** — a head-to-head AI prompt engineering competition.

## Quick Start

### Prerequisites

- Node.js 20.x LTS
- npm 10.x
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/prompt-wars.git
cd prompt-wars

# 2. Install dependencies
npm install

# 3. Setup WebSocket server
cd ws-server && npm install && cd ..

# 4. Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys and connection strings

# 5. Run development servers
npm run dev:web    # Next.js on http://localhost:3000
npm run dev:ws     # WebSocket server on http://localhost:4000
```

### Environment Variables

See `.env.example` for all required variables. Key ones:

| Variable             | Description                        |
| -------------------- | ---------------------------------- |
| `MONGODB_URI`        | MongoDB Atlas connection string    |
| `REDIS_URL`          | Upstash Redis URL (ioredis format) |
| `GROQ_API_KEY`       | Groq API key for Battle AI         |
| `GOOGLE_AI_API_KEY`  | Google Gemini API key for Judge AI |
| `OPENROUTER_API_KEY` | OpenRouter key for fallback judge  |
| `SESSION_SECRET`     | 32-char secret for iron-session    |
| `ADMIN_PASSWORD`     | Game Master password               |

### Testing

```bash
npm test          # Run tests in watch mode
npm run test:run  # Run tests once
```

## Architecture

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes + Mongoose + Zod
- **Real-time:** Socket.IO (standalone server on Railway)
- **Database:** MongoDB Atlas (M10 Dedicated)
- **Cache:** Upstash Redis
- **AI:** Groq (Battle) + Gemini (Judge) + OpenRouter (Fallback)

## Deployment

- **Frontend:** Vercel Pro
- **WebSocket Server:** Railway Pro
- **DNS/CDN:** Cloudflare Pro
