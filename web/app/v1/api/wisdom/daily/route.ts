import { handleDailyWisdomRequest } from '../../../../../../mobile/lib/server/routes/daily';

export async function POST(request: Request): Promise<Response> {
  return handleDailyWisdomRequest(request);
}
