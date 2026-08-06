import type { DictionaryEntry } from '@/lib/ai/state';

export function buildRemappingPrompt(
  parsedInput: string,
  dictionary: DictionaryEntry[],
  previousSuggestions: string[],
  rejectionContext: string | null
): string {
  return `<task>
The user reviewed emotion suggestions and none felt right. Generate 2-4 NEW emotion suggestions.
</task>

<user_body_data>
${parsedInput}
</user_body_data>

<previous_suggestions_rejected>
The user already saw and rejected these emotions:
${previousSuggestions.map((s) => `- ${s}`).join('\n')}
${rejectionContext ? `\nUser feedback: "${rejectionContext}"` : ''}

DO NOT suggest any of these emotions again. Explore different emotional categories.
</previous_suggestions_rejected>

${dictionary.length > 0 ? `<personal_dictionary>\nKnown patterns:\n${dictionary.map((d) => `- "${d.emotion}": ${d.bodyPatterns.map((p) => p.zone).join(', ')}`).join('\n')}\n</personal_dictionary>` : ''}

<instructions>
1. Write a new validation message acknowledging their rejection without judgment. Example: "Let's look at this from a different angle. Your body signals can mean different things."

2. Suggest 2-4 DIFFERENT emotions/states from the rejected ones. Explore:
   - More nuanced states (e.g. if "anxiety" was rejected, try "sensory overstimulation", "anticipation", or "restlessness")
   - Mixed states (e.g. "burnt out", "social exhaustion", "conflicted")

3. For each suggestion provide:
   - "emotion": Name of the emotion/state
   - "confidence": Score 0.0-1.0
   - "category": Short category classification
   - "explanation": 2-3 sentence student-friendly explanation of what this problem is
   - "possibleCauses": List of 2-3 realistic triggers/causes
   - "bodyConnection": Connection to their specific body sensations
</instructions>

<output_format>
{
  "validation": "New validation message acknowledging the rejection positively.",
  "suggestions": [
    {
      "emotion": "Social Fatigue",
      "confidence": 0.75,
      "category": "Interpersonal Energy",
      "explanation": "Social fatigue happens when spending time around people or masking your feelings drains your energy reserves, making your body feel sluggish or strained.",
      "possibleCauses": [
        "Group work or crowded group settings",
        "Constant talking and active listening",
        "Not getting quiet time to recharge"
      ],
      "bodyConnection": "Your body is telling you that your social battery is running low."
    }
  ]
}
</output_format>

Respond with ONLY the JSON. No other text.`;
}
