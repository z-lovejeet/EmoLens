import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { cardLLM, primaryLLM } from '../llm';
import { cardOutputSchema, parseLLMJson } from '../validation';
import { buildStaticCard } from '../fallback';
import { CARD_SYSTEM_PROMPT, buildCardPrompt } from '@/lib/prompts/cardGeneration';
import type { BodyZoneInput, CopingStrategy } from '../state';

/**
 * Node 5: generateCard
 * Generates a communication card for sharing with teachers/parents.
 * Primary: Groq (fast structured output) | Fallback: Gemini | Last resort: static
 */
export async function generateCardNode(state: {
  selectedEmotion: string | null;
  bodyData: BodyZoneInput[];
  copingStrategies: CopingStrategy[];
  sensoryPreferences: string[];
}) {
  const { selectedEmotion, bodyData, copingStrategies, sensoryPreferences } = state;

  if (!selectedEmotion) {
    return { communicationCard: buildStaticCard('unknown', sensoryPreferences) };
  }

  const prompt = buildCardPrompt(selectedEmotion, bodyData, copingStrategies, sensoryPreferences);
  const messages = [
    new SystemMessage(CARD_SYSTEM_PROMPT),
    new HumanMessage(prompt),
  ];

  let content: string;

  try {
    // Primary: Groq (fast for structured output)
    const result = await cardLLM.invoke(messages);
    content = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
  } catch {
    try {
      // Fallback: Gemini
      const result = await primaryLLM.invoke(messages);
      content = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
    } catch {
      return { communicationCard: buildStaticCard(selectedEmotion, sensoryPreferences) };
    }
  }

  const parsed = parseLLMJson<Record<string, unknown>>(content);

  if (!parsed) {
    return { communicationCard: buildStaticCard(selectedEmotion, sensoryPreferences) };
  }

  const validated = cardOutputSchema.safeParse(parsed);

  if (!validated.success) {
    return { communicationCard: buildStaticCard(selectedEmotion, sensoryPreferences) };
  }

  return {
    communicationCard: {
      ...validated.data,
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
    },
  };
}
