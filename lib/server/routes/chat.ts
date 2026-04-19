import { perplexityStream } from '../../ai/perplexity';
import { CHAT_SYSTEM, GUIDE_SYSTEM_PROMPTS } from '../../ai/prompts';

interface HistoryMessage {
  role: string;
  content: string;
}

export async function handleChatRequest(request: Request): Promise<Response> {
  const { message, history = [], persona } = await request.json() as {
    message: string;
    history: HistoryMessage[];
    persona?: string;
  };

  const systemPrompt = (persona && GUIDE_SYSTEM_PROMPTS[persona])
    ? GUIDE_SYSTEM_PROMPTS[persona]
    : CHAT_SYSTEM;

  const messages = [
    { role: 'system', content: systemPrompt },
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
