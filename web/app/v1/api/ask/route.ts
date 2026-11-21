import { handleAskRequest } from '@core/server/routes/ask';

export async function POST(request: Request): Promise<Response> {
  return handleAskRequest(request);
}
