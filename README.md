# EasyClaw

EasyClaw is a Next.js onboarding wrapper for OpenClaw designed for non-technical users. It provides a guided QR-first setup flow for WhatsApp (plus Slack, Discord, Telegram, and more), and a lightweight dashboard for gateway status.

## Prerequisites

- Node.js 22+
- OpenClaw installed globally:

```bash
npm install -g openclaw@latest
```

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo Mode

Demo mode is enabled by default in onboarding:

- QR step auto-connects after 5 seconds
- No live OpenClaw gateway required
- Full wizard flow works end-to-end for demos

Disable demo mode in step 1 to use a real local gateway.

## Real Gateway Integration

EasyClaw backend routes:

- `GET /api/gateway/status` checks `localhost:18789/status`
- `POST /api/gateway/configure` writes `~/.openclaw/openclaw.json`
- `POST /api/gateway/spawn` runs `openclaw gateway --install-daemon`
- `GET /api/qr` attempts `openclaw channels login --channel whatsapp` and returns QR payload
- `POST /api/waitlist` appends waitlist emails to `/tmp/easyclaw-waitlist.jsonl`

## OpenClaw Config Template

See `openclaw.config.template.json` for an MVP schema example that matches WhatsApp config docs (`dmPolicy`, `allowFrom`, `groupPolicy`, `groupAllowFrom`).
