import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { primaryLLM, fastLLM } from '../llm';
import { emotionOutputSchema, parseLLMJson, filterUnsafeContent } from '../validation';
import { getStaticFallbackSuggestions } from '../fallback';
import { SYSTEM_PROMPT } from '@/lib/prompts/system';
import { buildInitialMappingPrompt } from '@/lib/prompts/emotionMapping';
import { buildRemappingPrompt } from '@/lib/prompts/remapping';
import type { DictionaryEntry, EmotionSuggestion } from '../state';

/**
 * Node 2: mapEmotion
 * Maps body sensations to 2-4 emotion suggestions using dual LLM strategy.
 * Primary: Gemini | Fallback: Groq | Last resort: static data
 */
export async function mapEmotionNode(state: {
  parsedInput: string | null;
  userDictionary: DictionaryEntry[];
  mappingAttempt: number;
  previousSuggestions: string[];
  rejectionContext: string | null;
}) {
  const {
    parsedInput,
    userDictionary,
    mappingAttempt,
    previousSuggestions,
    rejectionContext,
  } = state;

  if (!parsedInput) {
    return { error: 'No parsed input available' };
  }

  const prompt =
    mappingAttempt === 0
      ? buildInitialMappingPrompt(parsedInput, userDictionary)
      : buildRemappingPrompt(parsedInput, userDictionary, previousSuggestions, rejectionContext);

  let resultContent: string;
  let usedFallback = false;

  try {
    // Primary: Gemini
    const result = await primaryLLM.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(prompt),
    ]);
    resultContent = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
  } catch {
    try {
      // Fallback: Groq
      const result = await fastLLM.invoke([
        new SystemMessage(SYSTEM_PROMPT),
        new HumanMessage(prompt),
      ]);
      resultContent = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
      usedFallback = true;
    } catch {
      // Last resort: static fallback
      return {
        emotionSuggestions: getStaticFallbackSuggestions(parsedInput),
        validationMessage:
          'Your body is sending clear signals. Here are some possibilities based on what you described.',
        mappingAttempt: mappingAttempt + 1,
        usedFallback: true,
      };
    }
  }

  // Parse and validate JSON output
  const parsed = parseLLMJson<{ validation: string; suggestions: EmotionSuggestion[] }>(resultContent);

  if (!parsed) {
    return {
      emotionSuggestions: getStaticFallbackSuggestions(parsedInput),
      validationMessage:
        'Your body is sending clear signals. Here are some possibilities based on what you described.',
      mappingAttempt: mappingAttempt + 1,
      usedFallback: true,
    };
  }

  const validated = emotionOutputSchema.safeParse(parsed);

  if (!validated.success) {
    return {
      emotionSuggestions: getStaticFallbackSuggestions(parsedInput),
      validationMessage:
        'Your body is sending clear signals. Here are some possibilities based on what you described.',
      mappingAttempt: mappingAttempt + 1,
      usedFallback: true,
    };
  }

  const newSuggestionNames = validated.data.suggestions.map((s) => s.emotion);

  return {
    emotionSuggestions: validated.data.suggestions,
    validationMessage: filterUnsafeContent(validated.data.validation),
    mappingAttempt: mappingAttempt + 1,
    previousSuggestions: newSuggestionNames,
    usedFallback,
  };
}
