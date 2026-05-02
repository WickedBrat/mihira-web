import { handleDailyWisdomRequest } from '@/lib/server/routes/daily';

export async function POST(request: Request): Promise<Response> {
  return handleDailyWisdomRequest(request);
}
