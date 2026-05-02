import { handleMuhuratWisdomRequest } from '../../../../../../mobile/lib/server/routes/muhurat';

export async function POST(request: Request): Promise<Response> {
  return handleMuhuratWisdomRequest(request);
}
