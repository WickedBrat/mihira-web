const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again later.';

/**
 * Logs the full error server-side (message + stack) and returns a
 * sanitized, generic error response — upstream error text (e.g. Gemini
 * API errors) must never reach the client.
 */
export function serverErrorResponse(tag: string, err: unknown, status = 502): Response {
  console.error(`[${tag}]`, err);
  return Response.json({ error: GENERIC_ERROR_MESSAGE }, { status });
}
