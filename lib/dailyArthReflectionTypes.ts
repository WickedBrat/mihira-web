export interface DailyArthReflection {
  summary: string;
  explanation: string;
  dailyPractice: string[];
  reflectionPrompts: string[];
  mantra: string;
}

export function isDailyArthReflection(value: unknown): value is DailyArthReflection {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;

  const candidate = value as Partial<DailyArthReflection>;
  return (
    typeof candidate.summary === 'string' &&
    typeof candidate.explanation === 'string' &&
    Array.isArray(candidate.dailyPractice) &&
    candidate.dailyPractice.every((item) => typeof item === 'string') &&
    Array.isArray(candidate.reflectionPrompts) &&
    candidate.reflectionPrompts.every((item) => typeof item === 'string') &&
    typeof candidate.mantra === 'string'
  );
}
