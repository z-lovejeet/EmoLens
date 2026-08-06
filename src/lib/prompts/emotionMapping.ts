import type { DictionaryEntry } from '@/lib/ai/state';

export function buildInitialMappingPrompt(
  parsedInput: string,
  dictionary: DictionaryEntry[]
): string {
  const dictionaryContext =
    dictionary.length > 0
      ? `\n<personal_dictionary>\nThis user has previously identified these emotion-body patterns:\n${dictionary
          .map(
            (d) =>
              `- "${d.emotion}" (identified ${d.frequency} times): typically felt in ${d.bodyPatterns
                .map((p) => `${p.zone} (${p.sensations.join(', ')})`)
                .join('; ')}`
          )
          .join('\n')}\nUse these patterns to inform your suggestions. If the current body data closely matches a known pattern, suggest that emotion with higher confidence.\n</personal_dictionary>`
      : '';

  return `<task>
Map the following body sensation data to 2-4 possible emotions. Return your response as valid JSON.
</task>

<user_body_data>
${parsedInput}
</user_body_data>
${dictionaryContext}

<instructions>
1. First, write a brief validation message (1-2 sentences) acknowledging what their body is experiencing. Use body-first language. Do NOT mention any emotion names in the validation.

2. Then suggest 2-4 emotions/experiences that commonly correlate with these physical sensations. For each:
   - "emotion": Name the emotion/state (use clear student-friendly vocabulary, e.g., "Overstimulation", "Anxiety", "Frustration", "Physical Exhaustion")
   - "confidence": Rate your confidence (0.0-1.0) based on how strongly the body data matches
   - "category": Short category classification (e.g., "Sensory Processing", "Nervous System Stress", "Emotional Overload", "Social Fatigue")
   - "explanation": Provide a detailed, clear explanation (2-3 sentences) written for a 10-18 year old explaining EXACTLY what this state/problem is and what difficulty it creates.
   - "possibleCauses": List 2-3 concrete, realistic causes or triggers that commonly bring on this state (e.g., ["Bright lights or loud environments", "Unexpected changes in daily routine", "Holding back stress all day"])
   - "bodyConnection": Describe how this state connects to THEIR specific physical body sensations.

3. Order suggestions by confidence (highest first).
4. Ensure variety — cover different categories (sensory, emotional, physical).
</instructions>

<output_format>
{
  "validation": "Your body is telling you something important right now about your physical signals.",
  "suggestions": [
    {
      "emotion": "Overstimulation",
      "confidence": 0.85,
      "category": "Sensory Processing",
      "explanation": "Overstimulation happens when your brain receives more input from your surroundings (lights, sounds, movement) than it can process smoothly. It can make concentrating or feeling calm very hard.",
      "possibleCauses": [
        "Loud or chaotic environments like busy hallways",
        "Fluorescent lighting or continuous screen time",
        "Having to listen and process information for a long stretch without a break"
      ],
      "bodyConnection": "Your tight chest and foggy head are your body's way of signaling that your sensory system needs a quiet reset."
    }
  ]
}
</output_format>

Respond with ONLY the JSON. No other text.`;
}
