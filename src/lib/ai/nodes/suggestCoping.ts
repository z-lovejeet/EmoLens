import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { copingPrimaryLLM, fastLLM } from '../llm';
import { copingOutputSchema, parseLLMJson } from '../validation';
import { getStaticCopingStrategies } from '../fallback';
import { COPING_SYSTEM_PROMPT, buildCopingPrompt } from '@/lib/prompts/copingSuggestion';
import type { BodyZoneInput, DictionaryEntry } from '../state';

/**
 * Extracts coping history from the dictionary for a specific emotion.
 */
function getDictionaryContext(
  dictionary: DictionaryEntry[],
  emotion: string
): { effectiveCoping: string[]; ineffectiveCoping: string[] } | null {
  const entry = dictionary.find((e) => e.emotion === emotion);
  if (!entry) return null;
  return {
    effectiveCoping: entry.effectiveCoping,
    ineffectiveCoping: entry.ineffectiveCoping,
  };
}

/**
 * Node 4: suggestCoping
 * Generates 3-5 personalized coping strategies.
 * Uses parallel LLM calls (Gemini primary, Groq fallback).
 */
export async function suggestCopingNode(state: {
  selectedEmotion: string | null;
  bodyData: BodyZoneInput[];
  sensoryPreferences: string[];
  userDictionary: DictionaryEntry[];
}) {
  const { selectedEmotion, bodyData, sensoryPreferences, userDictionary } = state;

  if (!selectedEmotion) {
    return { copingStrategies: getStaticCopingStrategies('general') };
  }

  const dictionaryContext = getDictionaryContext(userDictionary, selectedEmotion);
  const prompt = buildCopingPrompt(selectedEmotion, bodyData, sensoryPreferences, dictionaryContext);

  const messages = [
    new SystemMessage(COPING_SYSTEM_PROMPT),
    new HumanMessage(prompt),
  ];

  // Parallel LLM calls — take the first successful one
  const [geminiResult, groqResult] = await Promise.allSettled([
    copingPrimaryLLM.invoke(messages),
    fastLLM.invoke(messages),
  ]);

  const result =
    geminiResult.status === 'fulfilled'
      ? geminiResult.value
      : groqResult.status === 'fulfilled'
        ? groqResult.value
        : null;

  if (!result) {
    return { copingStrategies: getStaticCopingStrategies(selectedEmotion) };
  }

  const content = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
  const parsed = parseLLMJson<{ strategies: unknown[] }>(content);

  if (!parsed) {
    return { copingStrategies: getStaticCopingStrategies(selectedEmotion) };
  }

  const validated = copingOutputSchema.safeParse(parsed);

  return {
    copingStrategies: validated.success
      ? validated.data.strategies
      : getStaticCopingStrategies(selectedEmotion),
  };
}
