import { handleDailyArthReflectionRequest } from '../../../../../mobile/lib/server/routes/dailyArthReflection';

export async function POST(request: Request): Promise<Response> {
  return handleDailyArthReflectionRequest(request);
}
