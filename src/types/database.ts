// TypeScript types for EmoLens data models
// Reference: 07_data_schema.md Section 3

export interface Profile {
  id: string;
  display_name: string | null;
  preferences: UserPreferences;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  sensoryPreferences: string[];
}

export interface Checkin {
  id: string;
  user_id: string;
  body_data: BodyZoneData[];
  context: string | null;
  ai_suggestions: EmotionSuggestion[] | null;
  selected_emotion: string | null;
  thread_id: string | null;
  created_at: string;
}

export interface BodyZoneData {
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

export interface DictionaryEntry {
  id: string;
  user_id: string;
  emotion: string;
  body_patterns: BodyPattern[];
  frequency: number;
  effective_coping: string[];
  ineffective_coping: string[];
  first_identified: string;
  last_identified: string;
  created_at: string;
  updated_at: string;
}

export interface BodyPattern {
  zone: string;
  sensations: string[];
  avgIntensity: number;
}

export interface CopingLogEntry {
  id: string;
  user_id: string;
  checkin_id: string | null;
  strategy_name: string;
  category: CopingCategory;
  was_helpful: boolean | null;
  created_at: string;
}

export type CopingCategory =
  | 'breathing'
  | 'movement'
  | 'sensory'
  | 'grounding'
  | 'cognitive';

export interface CommunicationCard {
  id: string;
  user_id: string;
  checkin_id: string | null;
  emotion: string;
  intensity_level: 'mild' | 'moderate' | 'strong';
  what_helps_me: string[];
  validation_message: string | null;
  is_shareable: boolean;
  created_at: string;
}
