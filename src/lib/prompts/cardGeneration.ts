import type { BodyZoneInput, CopingStrategy } from '@/lib/ai/state';

export const CARD_SYSTEM_PROMPT = `You generate communication cards for neurodivergent youth. These cards are shown to teachers, parents, or friends to communicate emotional state without needing to explain verbally.

RULES:
1. Cards must be readable by anyone — no jargon, no assumptions.
2. "What helps me" items must be specific and actionable. Not "be patient" but "Give me 5 minutes of quiet before asking questions."
3. Tone: calm, clear, matter-of-fact. Not dramatic, not minimizing.
4. Maximum 5 "what helps me" items. Prioritize by importance.
5. Include a brief reassurance line for the card reader.
6. Return ONLY valid JSON.`;

export function buildCardPrompt(
  emotion: string,
  bodyData: BodyZoneInput[],
  copingStrategies: CopingStrategy[],
  sensoryPreferences: string[]
): string {
  return `<task>
Generate a communication card for a user experiencing "${emotion}".
This card will be shown to another person (teacher, parent, friend) on the user's phone screen.
</task>

<context>
Body sensations: ${bodyData.map((z) => `${z.zone} (${z.sensations.map((s) => s.type).join(', ')})`).join('; ')}
Sensory preferences: ${sensoryPreferences.join(', ') || 'not specified'}
Effective coping strategies: ${copingStrategies.map((s) => s.name).join(', ')}
</context>

<output_format>
{
  "emotion": "${emotion}",
  "intensityLevel": "mild|moderate|strong",
  "whatHelpsMe": [
    "Specific, actionable item 1",
    "Specific, actionable item 2",
    "Specific, actionable item 3"
  ],
  "validationMessage": "A brief reassuring line for the person reading this card."
}
</output_format>

Respond with ONLY the JSON. No other text.`;
}
