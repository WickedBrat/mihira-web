import { handleNaradRequest } from '../../../../../mobile/lib/server/routes/narad';

export async function POST(): Promise<Response> {
  return handleNaradRequest();
}
