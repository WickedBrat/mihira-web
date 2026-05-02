import { handleAskRequest } from '../../../../../mobile/lib/server/routes/ask';

export async function POST(request: Request): Promise<Response> {
  return handleAskRequest(request);
}
