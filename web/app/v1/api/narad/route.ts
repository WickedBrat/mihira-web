import { handleNaradRequest } from '@core/server/routes/narad';

export async function POST(): Promise<Response> {
  return handleNaradRequest();
}
