# HANDOFF — Claude Setup Session

**Date:** Oct 31, 2026  
**Last updated:** Oct 31, 2026 (session 2)  
**Session goal:** Set up Claude Code properly — memory, skills, integrations, phone access

---

## What is complete

### Foundation (done)
- Memory system: `user.md`, `project.md`, `feedback.md` in `~/.claude/projects/-Users-khushiblohia/memory/`
- `~/.claude/CLAUDE.md` — global context injected every session
- Permissions cleanup — 10 new allow patterns added to `~/.claude/settings.json`
- `claude-setup` skill built — model routing guide (Opus/Sonnet/Haiku)
- Community skills marketplace installed (35+ skills via npx skills install)

### Artifact Hub (done)
- GitHub repo: https://github.com/khushilohia/artifacts.git
- Live at: https://artifacts-taupe-zeta.vercel.app
- `artifact-publisher` skill built at `~/.claude/skills/artifact-publisher/SKILL.md`
- Auto-deploys from GitHub push

### Telegram Bot — Cloud Mode (done)
- Bot: @KhushiClaudeBot (t.me/KhushiClaudeBot)
- Bot token: stored in Vercel env as `TELEGRAM_BOT_TOKEN`
- Khushi's chat ID: `9166843110`
- OpenRouter key: stored in Vercel env as `OPENROUTER_API_KEY` (**REGENERATE THIS KEY**)
- Webhook live: `https://artifacts-taupe-zeta.vercel.app/api/telegram`
- Model: `anthropic/claude-haiku-4-5` via OpenRouter (fallback when laptop is off)
- Function: `/tmp/artifacts/api/telegram.js`

### Telegram Bot — Laptop Mode (done, needs secrets setup)
- Daemon: `~/.claude/telegram-daemon.js`
- When running: switches to polling mode, routes messages to full `claude -p` on laptop
- Has web search, file access, shell — actual Claude, not Haiku
- LaunchAgent: `~/Library/LaunchAgents/com.khushi.claude-telegram.plist`
- Auto-starts on login, restores webhook on clean exit
- **Requires:** `~/.claude/secrets.env` with `TELEGRAM_BOT_TOKEN=xxx`

### Skills installed (done)
- `founder-skill` — validate ideas: JTBD, TAM, moat, unfair advantage, MVP, go/no-go verdict
- `reel-kits` — input topic → hook, 30s script, B-roll cues, caption, hashtags, post time

---

## Critical: still needs doing

1. **Regenerate OpenRouter key** at openrouter.ai/keys — old key was pasted in chat transcript. Update Vercel env var `OPENROUTER_API_KEY` with new key, then redeploy.
2. **Create `~/.claude/secrets.env`** with:
   ```
   export TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```
   Get the token from Vercel env vars dashboard (already stored there).
3. **Start the daemon** once secrets.env is set:
   ```bash
   source ~/.claude/secrets.env && node ~/.claude/telegram-daemon.js
   ```
4. **Load LaunchAgent** to auto-start daemon on login:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.khushi.claude-telegram.plist
   ```
5. **Test** — send a message to @KhushiClaudeBot. If laptop daemon is running: full Claude replies. If not: Haiku fallback.

---

## What to build next (in order)

### 1. LinkedIn poster skill (next)
Via Safari skill (already installed) — skim trending posts, draft in Khushi's voice, submit.
Skill: `~/.claude/skills/linkedin-poster/SKILL.md`

### 2. reel-animator + anatomy
Pairs with `reel-kits`. Animate reel scripts via Remotion or similar.

### 3. Vercel token in env
Need `VERCEL_TOKEN` in shell so CLI works headlessly: `vercel --prod --token $VERCEL_TOKEN`
Add to `~/.claude/secrets.env` once token is created at vercel.com/account/tokens.

### 4. cmem.ai / memory upgrade (optional)
`/mem-setup` for automatic session memory capture. File-based memory is sufficient for now.

---

## Architecture: Telegram Bot

```
Khushi's phone
    │
    ▼
Telegram servers
    │
    ├── Laptop ON → daemon polling → claude -p on MacBook → full Claude Code
    │                                (web search, files, shell)
    │
    └── Laptop OFF → Vercel webhook → OpenRouter Haiku → fast text reply
```

**How the switch works:**
- Daemon starts → calls `deleteWebhook` → owns the bot via polling
- Daemon stops cleanly (Ctrl+C) → calls `setWebhook` → Vercel takes over
- LaunchAgent restarts daemon on crash

---

## Key file locations

| What | Where |
|------|--------|
| Global memory index | `~/.claude/projects/-Users-khushiblohia/memory/MEMORY.md` |
| Global CLAUDE.md | `~/.claude/CLAUDE.md` |
| Settings | `~/.claude/settings.json` |
| Skills dir | `~/.claude/skills/` |
| Telegram daemon | `~/.claude/telegram-daemon.js` |
| Secrets (tokens) | `~/.claude/secrets.env` (create this, don't commit) |
| Artifacts repo | `/tmp/artifacts/` (clone from github.com/khushilohia/artifacts) |

## Key URLs

| What | URL |
|------|-----|
| Artifact hub | https://artifacts-taupe-zeta.vercel.app |
| GitHub repo | https://github.com/khushilohia/artifacts |
| Telegram bot | t.me/KhushiClaudeBot |
| n8n | https://n8n.myintellify.ai |

## Active projects (priority)
1. Claude setup — mostly done, secrets.env + LaunchAgent remaining
2. Inova CX @ IntellifyAi — day job, ongoing
3. CollabX (collabx.dev) — live, side project
4. Lumi / Halo — next product (use /founder-skill to validate first)
5. Friday / Jarvis — personal AI ops, Telegram daemon is the first piece ✓
