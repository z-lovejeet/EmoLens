import type { BodyZoneInput, DictionaryEntry } from '../state';

/**
 * Merges new body data into an existing dictionary entry.
 * Uses running average for sensation intensities.
 */
function mergeIntoDictionary(
  existing: DictionaryEntry,
  bodyData: BodyZoneInput[]
): DictionaryEntry {
  const updatedPatterns = [...existing.bodyPatterns];

  for (const zone of bodyData) {
    const existingPattern = updatedPatterns.find((p) => p.zone === zone.zone);

    if (existingPattern) {
      // Merge sensations
      const newSensations = zone.sensations.map((s) => s.type);
      const allSensations = [...new Set([...existingPattern.sensations, ...newSensations])];

      // Running average of intensity
      const newAvg = zone.sensations.reduce((sum, s) => sum + s.intensity, 0) / zone.sensations.length;
      const avgIntensity = (existingPattern.avgIntensity * existing.frequency + newAvg) / (existing.frequency + 1);

      existingPattern.sensations = allSensations;
      existingPattern.avgIntensity = Math.round(avgIntensity * 10) / 10;
    } else {
      updatedPatterns.push({
        zone: zone.zone,
        sensations: zone.sensations.map((s) => s.type),
        avgIntensity:
          zone.sensations.reduce((sum, s) => sum + s.intensity, 0) / zone.sensations.length,
      });
    }
  }

  return {
    ...existing,
    bodyPatterns: updatedPatterns,
    frequency: existing.frequency + 1,
  };
}

/**
 * Creates a new dictionary entry from body data.
 */
function createNewEntry(
  emotion: string,
  bodyData: BodyZoneInput[]
): DictionaryEntry {
  return {
    emotion,
    bodyPatterns: bodyData.map((zone) => ({
      zone: zone.zone,
      sensations: zone.sensations.map((s) => s.type),
      avgIntensity:
        zone.sensations.reduce((sum, s) => sum + s.intensity, 0) / zone.sensations.length,
    })),
    frequency: 1,
    effectiveCoping: [],
    ineffectiveCoping: [],
  };
}

/**
 * Node 3: updateDictionary
 * Updates the user's personal emotion dictionary with the selected emotion.
 * Pure computation — no LLM calls.
 */
export async function updateDictionaryNode(state: {
  selectedEmotion: string | null;
  bodyData: BodyZoneInput[];
  userDictionary: DictionaryEntry[];
}) {
  const { selectedEmotion, bodyData, userDictionary } = state;

  if (!selectedEmotion) {
    return { error: 'No emotion selected' };
  }

  const existing = userDictionary.find((e) => e.emotion === selectedEmotion);

  const updatedEntry = existing
    ? mergeIntoDictionary(existing, bodyData)
    : createNewEntry(selectedEmotion, bodyData);

  return { dictionaryUpdate: updatedEntry };
}
