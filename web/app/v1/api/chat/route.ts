import { handleChatRequest } from '@core/server/routes/chat';

export async function POST(request: Request): Promise<Response> {
  return handleChatRequest(request);
}
