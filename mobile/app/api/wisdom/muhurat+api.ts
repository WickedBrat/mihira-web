import { handleMuhuratWisdomRequest } from '@/lib/server/routes/muhurat';

export async function POST(request: Request): Promise<Response> {
  return handleMuhuratWisdomRequest(request);
}
