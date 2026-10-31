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
- Webhook: `https://artifacts-taupe-zeta.vercel.app/api/telegram`
- Model: `anthropic/claude-haiku-4-5` via OpenRouter (fallback when laptop is off)

### Telegram Bot — Laptop Mode (done)
- Daemon: `~/.claude/telegram-daemon.js`
- LaunchAgent: `~/Library/LaunchAgents/com.khushi.claude-telegram.plist` (installed)
- Auto-starts on login, restores webhook on Ctrl+C / clean exit
- Logs: `/tmp/claude-telegram.log`
- **Requires:** `~/.claude/secrets.env` with `export TELEGRAM_BOT_TOKEN=xxx`
- Start manually: `source ~/.claude/secrets.env && node ~/.claude/telegram-daemon.js`
- Load agent: `launchctl load ~/Library/LaunchAgents/com.khushi.claude-telegram.plist`

### Skills installed (done)
- `founder-skill` — validate ideas: JTBD, TAM, moat, unfair advantage, MVP, go/no-go
- `reel-kits` — topic → hook, 30s script, B-roll cues, caption, hashtags, post time

### Superpowers skills (from github.com/obra/superpowers — install pending)
All 13 skills below are in `/tmp/superpowers/skills/`. Install with:
```bash
cp -r /tmp/superpowers/skills/* ~/.claude/skills/
```
Or cherry-pick. Most relevant for Khushi's workflow:

| Skill | When it fires |
|-------|--------------|
| `brainstorming` | Before any creative work — features, products, plans |
| `writing-plans` | Before multi-step implementation, after spec |
| `executing-plans` | Running a plan inline (no subagent) |
| `dispatching-parallel-agents` | 2+ independent tasks at once |
| `subagent-driven-development` | Parallel implementation via agents |
| `test-driven-development` | Before writing implementation code |
| `systematic-debugging` | Any bug or unexpected behavior |
| `verification-before-completion` | Before claiming done / committing |
| `requesting-code-review` | After major features, before merge |
| `receiving-code-review` | When review feedback arrives |
| `finishing-a-development-branch` | After tests pass, before merge |
| `using-git-worktrees` | Feature isolation / parallel work |
| `writing-skills` | When creating or editing skills |
| `using-superpowers` | Session start — loads skill routing |
| `diagnosing-superpowers` | When a session went wrong |

Also in repo: `hooks/hooks.json` (pre-built Claude Code hooks), `hooks/session-start/` (startup hook).

---

## Critical: still needs doing

1. **Regenerate OpenRouter key** — old key was pasted in chat transcript. Update Vercel env var.
2. **Create `~/.claude/secrets.env`**:
   ```bash
   echo 'export TELEGRAM_BOT_TOKEN=your_token_here' > ~/.claude/secrets.env
   ```
3. **Load the LaunchAgent**:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.khushi.claude-telegram.plist
   ```
4. **Install superpowers skills**:
   ```bash
   cp -r /tmp/superpowers/skills/* ~/.claude/skills/
   cp /tmp/superpowers/hooks/hooks.json ~/.claude/  # optional, review first
   ```
5. **Test Telegram** — message @KhushiClaudeBot. If daemon is running: full Claude. If not: Haiku.

---

## What to build next (in order)

### 1. LinkedIn poster skill
Via Safari skill (already installed) — skim trending posts, draft in Khushi's voice, post.
`~/.claude/skills/linkedin-poster/SKILL.md`

### 2. reel-animator + anatomy
Pairs with `reel-kits`. Animate reel scripts via Remotion.

### 3. Vercel token in env
Add `VERCEL_TOKEN` to `~/.claude/secrets.env` (get from vercel.com/account/tokens).
Enables: `vercel --prod --token $VERCEL_TOKEN` without clicking dashboards.

### 4. cmem.ai (optional)
`/mem-setup` for automatic session memory capture. File-based memory is sufficient for now.

---

## Architecture: Telegram Bot

```
Khushi's phone
    │
    ▼
Telegram servers
    │
    ├── Laptop ON → daemon polling → claude -p on MacBook (full Claude Code)
    │                                web search, files, shell, all tools
    │
    └── Laptop OFF → Vercel webhook → OpenRouter Haiku → fast text reply
```

Daemon starts → `deleteWebhook` → polling mode  
Daemon stops cleanly → `setWebhook` → Vercel takes over  
LaunchAgent: restarts on crash, KeepAlive=true

---

## Telegram Bot — What It Actually Does (Guide)

### How it works under the hood

When you message @KhushiClaudeBot and your laptop is on:
1. The daemon (Node.js process) receives your message via Telegram polling
2. It calls `claude -p "your message"` as a subprocess — this is Claude Code CLI running non-interactively
3. Claude processes it and prints the reply to stdout
4. The daemon sends that reply back to Telegram
5. Your message + reply are saved to `~/.claude/telegram-history.json` (last 6 exchanges)

When your laptop is off: Vercel webhook handles it with Haiku via OpenRouter — text only, no history, no tools.

### What it CAN do (laptop mode)
- Web search and fetch URLs
- Read files on your laptop (e.g. "read my package.json")
- Remember last 6 exchanges per session (use /clear to reset)
- Research, summarise, draft, validate ideas
- Answer questions with real-time web info

### What it CANNOT do
- **Use skills** (founder-skill, reel-kits, etc.) — skills only run inside interactive Claude Code sessions on your laptop
- **Create artifacts or docs** — only interactive sessions can open Claude Docs
- **Use the Safari skill** — that requires a browser + interactive session
- **Edit files or run shell commands** — Bash tool removed to prevent macOS permission prompts
- **Maintain history across daemon restarts** — history file persists but is per-machine

### The permission prompts problem

Two completely different types:

**1. macOS privacy dialogs** ("node wants to access Safari/Photos")
These are one-time macOS prompts. Fix: `System Settings → Privacy & Security → Automation` — grant Terminal (or whichever app runs node) access. Done once, never again.

**2. Claude Code tool approval dialogs**
These appear when Claude wants to run a command. Fix: removed Bash from allowed tools, so Claude only has WebSearch/WebFetch/Read — those don't trigger interactive prompts.

### To use skills — use Claude Code directly
Open your terminal or the Claude Code app and type:
- `/founder-skill validate this idea: ...`
- `/reel-kits vibe coding with TypeScript`
- Any other installed skill

Telegram bot is for on-the-go text queries. Claude Code is for skill invocation and file work.

### Commands in Telegram
- `/clear` — reset conversation history
- `/start` — status message
- Anything else — goes to Claude

---

## Key file locations

| What | Where |
|------|--------|
| Global memory | `~/.claude/projects/-Users-khushiblohia/memory/MEMORY.md` |
| CLAUDE.md | `~/.claude/CLAUDE.md` |
| Settings | `~/.claude/settings.json` |
| Skills | `~/.claude/skills/` |
| Telegram daemon | `~/.claude/telegram-daemon.js` |
| LaunchAgent | `~/Library/LaunchAgents/com.khushi.claude-telegram.plist` |
| Secrets | `~/.claude/secrets.env` (create this, never commit) |
| Artifacts repo | `/tmp/artifacts/` |
| Superpowers repo | `/tmp/superpowers/` |

## Key URLs

| What | URL |
|------|-----|
| Artifact hub | https://artifacts-taupe-zeta.vercel.app |
| GitHub repo | https://github.com/khushilohia/artifacts |
| Superpowers | https://github.com/obra/superpowers |
| Telegram bot | t.me/KhushiClaudeBot |
| n8n | https://n8n.myintellify.ai |

## Active projects (priority)
1. Claude setup — LaunchAgent + secrets.env + superpowers install remaining
2. Inova CX @ IntellifyAi — day job, ongoing
3. CollabX (collabx.dev) — live, side project
4. Lumi / Halo — next product (run /founder-skill first)
5. Friday / Jarvis — Telegram daemon is piece one ✓
