export async function handleNaradRequest(): Promise<Response> {
  return Response.json(
    {
      error: 'Narad API is deprecated. Use /api/ask for scripture-grounded guidance.',
    },
    { status: 410 },
  );
}
