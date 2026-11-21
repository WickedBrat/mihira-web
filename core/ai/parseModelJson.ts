function stripMarkdownCodeFence(raw: string) {
  const trimmed = raw.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmed;
}

function extractFirstJsonObject(raw: string) {
  const start = raw.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = start; index < raw.length; index += 1) {
    const char = raw[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === '\\') {
        isEscaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      depth += 1;
      continue;
    }

    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return raw.slice(start, index + 1);
      }
    }
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseModelJson<T extends Record<string, unknown>>(
  raw: string,
  requiredKeys: string[]
): T {
  const normalized = stripMarkdownCodeFence(raw);
  const candidates = [normalized, extractFirstJsonObject(normalized)].filter(
    (candidate): candidate is string => Boolean(candidate)
  );

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (!isRecord(parsed)) continue;

      const hasAllRequiredKeys = requiredKeys.every((key) => key in parsed);
      if (!hasAllRequiredKeys) continue;

      return parsed as T;
    } catch {
      continue;
    }
  }

  throw new Error('AI response parse error');
}
