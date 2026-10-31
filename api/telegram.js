export const config = { runtime: 'edge' };

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const KHUSHI_CHAT_ID = '9166843110';

const SYSTEM = `You are KhushiClaude, Khushi B Lohia's personal AI assistant on Telegram.
She is a founder (CollabX.dev), intern at IntellifyAi, BTech CS student at SMIT graduating 2027.
Her stack: React, TypeScript, Node.js, Python/FastAPI, Postgres, Docker.
Her projects: Lumi/Halo (AI product), Friday/Jarvis (personal AI ops), Instagram vibe coding.

Rules:
- Reply in plain text only — no markdown symbols (no **, no ##, no backticks in prose)
- Keep replies under 250 words unless she explicitly asks for more
- Be direct and useful — she wants execution, not explanation
- If a task needs Claude Code (file edits, git, shell commands), say: "This needs Claude Code on your laptop"
- For drafts, ideas, research, validation, reel scripts, captions — just do it`;

async function sendMessage(text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: KHUSHI_CHAT_ID, text }),
  });
}

async function callClaude(userMessage) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://khushilohia.vercel.app',
      'X-Title': 'KhushiClaude Bot',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-haiku-4-5',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userMessage },
      ],
    }),
  });
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || 'No response.';
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('OK', { status: 200 });

  try {
    const body = await req.json();
    const msg = body?.message;
    if (!msg) return new Response('OK', { status: 200 });

    const text = msg?.text?.trim() || '';
    const chatId = String(msg?.chat?.id);

    if (chatId !== KHUSHI_CHAT_ID) return new Response('OK', { status: 200 });

    if (!text || text === '/start') {
      await sendMessage('Ready. Send me anything:\n\n• Draft a LinkedIn post about X\n• 3 reel ideas for vibe coding\n• Validate this idea: ...\n• Summarise: [paste text]\n• Write an Instagram caption\n• What should I build next for CollabX?');
      return new Response('OK', { status: 200 });
    }

    const reply = await callClaude(text);
    await sendMessage(reply);
  } catch (e) {
    await sendMessage('Something went wrong. Try again.');
  }

  return new Response('OK', { status: 200 });
}
