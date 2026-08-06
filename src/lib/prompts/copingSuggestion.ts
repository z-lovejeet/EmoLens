import type { BodyZoneInput } from '@/lib/ai/state';

export const COPING_SYSTEM_PROMPT = `You are EmoLens's coping strategy generator. You suggest evidence-based coping techniques personalized to the user's emotion, body sensations, and sensory preferences.

RULES:
1. All strategies must be doable independently by a 10-18 year old. No strategies requiring another person, equipment, or specific location.
2. Include a mix of categories: breathing, movement, sensory, grounding, cognitive.
3. Respect sensory preferences. If the user prefers quiet, don't suggest "talk to someone." If they prefer movement, prioritize physical strategies.
4. Instructions must be specific and actionable. Not "try deep breathing" but "Breathe in through your nose for 4 counts. Hold for 4 counts. Breathe out through your mouth for 6 counts. Repeat 3 times."
5. Never suggest suppressing the emotion. All strategies are about managing, not eliminating.
6. Return ONLY valid JSON.`;

export function buildCopingPrompt(
  emotion: string,
  bodyData: BodyZoneInput[],
  sensoryPreferences: string[],
  dictionaryContext: { effectiveCoping: string[]; ineffectiveCoping: string[] } | null
): string {
  const prefsText =
    sensoryPreferences.length > 0
      ? `\n<sensory_preferences>\nUser prefers: ${sensoryPreferences.join(', ')}\nPrioritize strategies that align with these preferences.\n</sensory_preferences>`
      : '';

  const historyText = dictionaryContext
    ? `\n<coping_history>\nPreviously helpful for this emotion: ${dictionaryContext.effectiveCoping.join(', ') || 'none yet'}\nPreviously NOT helpful: ${dictionaryContext.ineffectiveCoping.join(', ') || 'none yet'}\nPrioritize helpful strategies. Deprioritize (but don't exclude) unhelpful ones.\n</coping_history>`
    : '';

  return `<task>
Generate 3-5 personalized coping strategies for a user experiencing "${emotion}".
</task>

<body_context>
The user is feeling this in their body:
${bodyData.map((z) => `- ${z.zone}: ${z.sensations.map((s) => `${s.type} (${s.intensity}/5)`).join(', ')}`).join('\n')}
</body_context>
${prefsText}
${historyText}

<output_format>
{
  "strategies": [
    {
      "name": "Strategy Name",
      "icon": "lucide-icon-name",
      "category": "breathing|movement|sensory|grounding|cognitive",
      "shortDescription": "One sentence summary.",
      "fullInstructions": "Step 1: ... Step 2: ... Step 3: ...",
      "matchReason": "Why this strategy specifically helps with this emotion and these body sensations."
    }
  ]
}
</output_format>

Respond with ONLY the JSON. No other text.`;
}
