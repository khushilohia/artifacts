# HANDOFF — Claude Setup Session
**Date:** Oct 31, 2026  
**Session goal:** Set up Claude Code properly — memory, skills, integrations, phone access

---

## What was completed this session

### Foundation (all done)
- Memory system: `user.md`, `project.md`, `feedback.md` in `~/.claude/projects/-Users-khushiblohia/memory/`
- `~/.claude/CLAUDE.md` — global context injected every session
- Permissions cleanup — 10 new allow patterns added to `~/.claude/settings.json`
- `claude-setup` skill built — model routing guide (Opus/Sonnet/Haiku)
- Community skills marketplace installed (35+ skills via npx skills install)

### Artifact Hub (done)
- GitHub repo: https://github.com/khushilohia/artifacts.git
- Live at: https://artifacts-taupe-zeta.vercel.app
- 3 artifacts listed: Claude Setup Board, Friday Mission Brief, Friday Ops Board
- `artifact-publisher` skill built at `~/.claude/skills/artifact-publisher/SKILL.md`
- Auto-deploys from GitHub push

### Telegram Bot (done)
- Bot: @KhushiClaudeBot (t.me/KhushiClaudeBot)
- Bot token: stored in Vercel env as `TELEGRAM_BOT_TOKEN`
- Khushi's chat ID: `9166843110`
- OpenRouter key: stored in Vercel env as `OPENROUTER_API_KEY` (REGENERATE THIS KEY)
- Webhook live: `https://artifacts-taupe-zeta.vercel.app/api/telegram`
- Model: `anthropic/claude-haiku-4-5` via OpenRouter
- Function: `/tmp/artifacts/api/telegram.js` (also in GitHub repo)

---

## Critical: do before next session

1. **Regenerate OpenRouter key** at openrouter.ai/keys — old key was pasted in chat transcript. Update Vercel env var `OPENROUTER_API_KEY` with new key, then redeploy.
2. **Add Vercel token** to environment so CLI works without asking Khushi:
   - Go to vercel.com/account/tokens → create token
   - Run: `! export VERCEL_TOKEN=your_token` or add to shell profile
3. **Test Telegram bot** — send any message to @KhushiClaudeBot and confirm Claude replies

---

## What to build next (in order)

### 1. founder-skill
Custom skill at `~/.claude/skills/founder-skill/SKILL.md`
- Validate ideas: JTBD, TAM, moat, unfair advantage, MVP scope, go/no-go
- Should work for Lumi, Halo, CollabX pivots, anything new
- Trigger: `/founder-skill` or "validate this idea: ..."

### 2. reel-kits
Custom skill at `~/.claude/skills/reel-kits/SKILL.md`  
- Input: a topic or build
- Output: hook, 30-sec script, B-roll cues, caption, hashtags, post time
- Pairs with `reel-animator` (build after) and `anatomy` (animations)

### 3. Vercel token setup (needed before any more infra work)
Khushi gave feedback: use Vercel CLI, don't ask her to click dashboards.
Need `VERCEL_TOKEN` in env to automate: `vercel --prod --token $VERCEL_TOKEN`

### 4. LinkedIn poster skill
Via Safari skill (already installed) — skim trending posts, draft in Khushi's voice, submit

### 5. cmem.ai setup (optional)
`/mem-setup` to pair @KhushiClaudeBot... wait, pair claude-mem with cmem.ai for automatic session memory capture. Currently using file-based memory which is sufficient.

---

## Key file locations

| What | Where |
|------|--------|
| Global memory index | `~/.claude/projects/-Users-khushiblohia/memory/MEMORY.md` |
| Global CLAUDE.md | `~/.claude/CLAUDE.md` |
| Settings | `~/.claude/settings.json` |
| Skills dir | `~/.claude/skills/` |
| Artifacts repo | `/tmp/artifacts/` (clone from github.com/khushilohia/artifacts) |
| Telegram function | `/tmp/artifacts/api/telegram.js` |

## Key URLs

| What | URL |
|------|-----|
| Artifact hub | https://artifacts-taupe-zeta.vercel.app |
| GitHub repo | https://github.com/khushilohia/artifacts |
| Telegram bot | t.me/KhushiClaudeBot |
| n8n (not used) | https://n8n.myintellify.ai |

## Active projects (priority)
1. Claude setup — this session, mostly done
2. Inova CX @ IntellifyAi — day job, ongoing
3. CollabX (collabx.dev) — live, side project
4. Lumi / Halo — next product to build (needs founder-skill first)
5. Friday / Jarvis — personal AI ops, Telegram bot is the first piece
