// app/api/chat+api.ts
import { perplexityStream } from '@/lib/ai/perplexity';
import { CHAT_SYSTEM } from '@/lib/ai/prompts';

interface HistoryMessage { role: string; content: string }

export async function POST(request: Request): Promise<Response> {
  const { message, history = [] } = await request.json() as {
    message: string;
    history: HistoryMessage[];
  };

  const messages = [
    { role: 'system', content: CHAT_SYSTEM },
    ...history.slice(-10),
    { role: 'user', content: message },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await perplexityStream('sonar', messages, (token) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'stream error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
