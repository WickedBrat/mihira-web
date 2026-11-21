import { handleDailyWisdomRequest } from '@core/server/routes/daily';

export async function POST(request: Request): Promise<Response> {
  return handleDailyWisdomRequest(request);
}
