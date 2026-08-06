import { Annotation } from '@langchain/langgraph';

// === Type Definitions ===

export interface BodyZoneInput {
  zone: string;
  sensations: {
    type: string;
    intensity: number;
  }[];
}

export interface EmotionSuggestion {
  emotion: string;
  confidence: number;
  category?: string;
  explanation: string;
  possibleCauses?: string[];
  bodyConnection: string;
}

export interface CopingStrategy {
  name: string;
  icon: string;
  category: 'breathing' | 'movement' | 'sensory' | 'grounding' | 'cognitive';
  shortDescription: string;
  fullInstructions: string;
  matchReason: string;
}

export interface CardData {
  id: string;
  emotion: string;
  intensityLevel: 'mild' | 'moderate' | 'strong';
  whatHelpsMe: string[];
  validationMessage: string;
  generatedAt: string;
}

export interface DictionaryEntry {
  emotion: string;
  bodyPatterns: {
    zone: string;
    sensations: string[];
    avgIntensity: number;
  }[];
  frequency: number;
  effectiveCoping: string[];
  ineffectiveCoping: string[];
}

// === LangGraph State Annotation ===

export const EmotionGraphState = Annotation.Root({
  // Input
  bodyData: Annotation<BodyZoneInput[]>,
  context: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  userId: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  threadId: Annotation<string>,

  // Dictionary Context
  userDictionary: Annotation<DictionaryEntry[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
  sensoryPreferences: Annotation<string[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),

  // AI Processing
  parsedInput: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  emotionSuggestions: Annotation<EmotionSuggestion[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
  mappingAttempt: Annotation<number>({
    reducer: (_, y) => y,
    default: () => 0,
  }),
  rejectionContext: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  previousSuggestions: Annotation<string[]>({
    reducer: (x, y) => [...x, ...y],
    default: () => [],
  }),

  // User Selection
  selectedEmotion: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),

  // Output
  validationMessage: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  copingStrategies: Annotation<CopingStrategy[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
  communicationCard: Annotation<CardData | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  dictionaryUpdate: Annotation<DictionaryEntry | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),

  // Error State
  error: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  usedFallback: Annotation<boolean>({
    reducer: (_, y) => y,
    default: () => false,
  }),

  // Crisis
  crisisDetected: Annotation<boolean>({
    reducer: (_, y) => y,
    default: () => false,
  }),
});
