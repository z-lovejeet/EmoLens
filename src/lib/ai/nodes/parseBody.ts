import type { BodyZoneInput } from '../state';

const CRISIS_KEYWORDS = [
  'hurt myself', 'self-harm', "don't want to live",
  'end it', 'kill myself', 'suicide', 'cutting',
  'want to die', 'no point', 'better off dead',
];

const CRISIS_MESSAGE = `Your body is telling you something really important right now, and I want to make sure you get the right support.

If you're in crisis or thinking about hurting yourself, please reach out:

988 Suicide & Crisis Lifeline — Call or text 988 (available 24/7)
Crisis Text Line — Text HOME to 741741

You deserve support right now. These are free, confidential, and available any time.`;

/**
 * Deterministic crisis detection — no LLM needed.
 * Checks context text for crisis keywords and body data for extreme distress patterns.
 */
function detectCrisis(
  bodyData: BodyZoneInput[],
  context: string | null
): boolean {
  // Check context for crisis keywords
  if (context) {
    const lower = context.toLowerCase();
    if (CRISIS_KEYWORDS.some((kw) => lower.includes(kw))) {
      return true;
    }
  }

  // High-intensity distress pattern:
  // 3+ zones at intensity >= 5 AND 2+ numb/frozen/hollow sensations
  const maxIntensityZones = bodyData.filter((zone) =>
    zone.sensations.some((s) => s.intensity >= 5)
  );
  const numbSensations = bodyData
    .flatMap((z) => z.sensations)
    .filter((s) => ['numb', 'frozen', 'hollow'].includes(s.type.toLowerCase()));

  if (maxIntensityZones.length >= 3 && numbSensations.length >= 2) {
    return true;
  }

  return false;
}

/**
 * Formats body data into a human-readable string for the AI prompt.
 */
function formatBodyDataForPrompt(bodyData: BodyZoneInput[]): string {
  return bodyData
    .map((zone) => {
      const sensationList = zone.sensations
        .map((s) => `${s.type} (intensity: ${s.intensity}/5)`)
        .join(', ');
      return `- ${zone.zone}: ${sensationList}`;
    })
    .join('\n');
}

/**
 * Node 1: parseBody
 * Validates input, detects crisis, and formats body data for the AI prompt.
 * Pure computation — no LLM calls.
 */
export async function parseBodyNode(
  state: { bodyData: BodyZoneInput[]; context: string | null }
) {
  const { bodyData, context } = state;

  if (!bodyData || bodyData.length === 0) {
    return { error: 'No body data provided' };
  }

  const crisisDetected = detectCrisis(bodyData, context);

  if (crisisDetected) {
    return {
      crisisDetected: true,
      validationMessage: CRISIS_MESSAGE,
    };
  }

  const parsedInput = formatBodyDataForPrompt(bodyData);

  return {
    parsedInput,
    crisisDetected: false,
  };
}
