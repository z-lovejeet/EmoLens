import { z } from 'zod';

export const emotionOutputSchema = z.object({
  validation: z.string().min(10).max(500),
  suggestions: z.array(
    z.object({
      emotion: z.string().min(2).max(50),
      confidence: z.number().min(0).max(1),
      category: z.string().optional(),
      explanation: z.string().min(10).max(500),
      possibleCauses: z.array(z.string()).optional(),
      bodyConnection: z.string().min(10).max(400),
    })
  ).min(2).max(4),
});

export const copingOutputSchema = z.object({
  strategies: z.array(
    z.object({
      name: z.string().min(2).max(50),
      icon: z.string().min(2).max(30),
      category: z.enum(['breathing', 'movement', 'sensory', 'grounding', 'cognitive']),
      shortDescription: z.string().min(10).max(200),
      fullInstructions: z.string().min(20).max(600),
      matchReason: z.string().min(10).max(300),
    })
  ).min(3).max(5),
});

export const cardOutputSchema = z.object({
  emotion: z.string(),
  intensityLevel: z.enum(['mild', 'moderate', 'strong']),
  whatHelpsMe: z.array(z.string().min(5).max(150)).min(2).max(5),
  validationMessage: z.string().min(10).max(300),
});

/**
 * Filters diagnostic/prescriptive language from AI output.
 * Ensures EmoLens never sounds like a therapist.
 */
export function filterUnsafeContent(text: string): string {
  const diagnosticPatterns = [
    /you (are|have|suffer from) (feeling |experiencing )?(\w+)/gi,
    /diagnosed with/gi,
    /your (condition|disorder|illness)/gi,
  ];

  let filtered = text;
  for (const pattern of diagnosticPatterns) {
    filtered = filtered.replace(pattern, (match) => {
      return match
        .replace(/you are/gi, 'this might be')
        .replace(/you have/gi, 'you might be experiencing');
    });
  }

  return filtered;
}

/**
 * Attempts to parse JSON from LLM output, handling markdown code fences.
 */
export function parseLLMJson<T>(content: string): T | null {
  try {
    // Strip markdown code fences if present
    let cleaned = content.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}
