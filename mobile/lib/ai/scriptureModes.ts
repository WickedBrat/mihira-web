import type { AskResponseMode } from '@/features/ask/types';

export interface ScriptureModeConfig {
  responseMode: AskResponseMode;
  retrievalCount: number;
  finalSourceCount: number;
  followUpPromptCount: number;
  requireSourceDiversity: boolean;
  includeAlternateView: boolean;
  answerDepthLabel: 'brief' | 'expanded' | 'comparative';
}

export const SCRIPTURE_MODE_CONFIG: Record<AskResponseMode, ScriptureModeConfig> = {
  quick: {
    responseMode: 'quick',
    retrievalCount: 6,
    finalSourceCount: 3,
    followUpPromptCount: 3,
    requireSourceDiversity: false,
    includeAlternateView: false,
    answerDepthLabel: 'brief',
  },
  deep: {
    responseMode: 'deep',
    retrievalCount: 8,
    finalSourceCount: 5,
    followUpPromptCount: 4,
    requireSourceDiversity: true,
    includeAlternateView: false,
    answerDepthLabel: 'expanded',
  },
  compare: {
    responseMode: 'compare',
    retrievalCount: 10,
    finalSourceCount: 4,
    followUpPromptCount: 4,
    requireSourceDiversity: true,
    includeAlternateView: true,
    answerDepthLabel: 'comparative',
  },
};

export function getScriptureModeConfig(mode: AskResponseMode): ScriptureModeConfig {
  return SCRIPTURE_MODE_CONFIG[mode];
}
