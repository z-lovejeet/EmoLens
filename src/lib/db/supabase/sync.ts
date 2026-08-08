import { createSupabaseBrowser } from './client';
import { upsertDictionaryLocal } from '@/lib/db/local/operations';
import { saveCardLocal } from '@/lib/db/local/cardOperations';
import type { EmoLensDB } from '@/lib/db/local/schema';

export async function saveDictionaryAndCardDual(
  dictionaryEntry: EmoLensDB['dictionary']['value'],
  cardEntry: {
    id: string;
    checkin_id: string | null;
    emotion: string;
    intensity_level: 'mild' | 'moderate' | 'strong';
    what_helps_me: string[];
    validation_message: string | null;
    created_at: string;
    synced: boolean;
    synced_at: string | null;
  }
) {
  // 1. Save locally to IndexedDB
  await upsertDictionaryLocal(dictionaryEntry);
  await saveCardLocal(cardEntry);

  // 2. Attempt saving to Supabase if client/session available
  try {
    const supabase = createSupabaseBrowser();
    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user?.id) {
      const userId = userData.user.id;

      // Upsert to emotion_dictionary
      await supabase.from('emotion_dictionary').upsert({
        user_id: userId,
        emotion: dictionaryEntry.emotion,
        body_patterns: dictionaryEntry.body_patterns,
        frequency: dictionaryEntry.frequency,
        effective_coping: dictionaryEntry.effective_coping,
        ineffective_coping: dictionaryEntry.ineffective_coping,
        first_identified: dictionaryEntry.first_identified,
        last_identified: dictionaryEntry.last_identified,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,emotion' });

      // Insert to communication_cards
      await supabase.from('communication_cards').insert({
        id: cardEntry.id,
        user_id: userId,
        checkin_id: cardEntry.checkin_id,
        emotion: cardEntry.emotion,
        intensity_level: cardEntry.intensity_level,
        what_helps_me: cardEntry.what_helps_me,
        validation_message: cardEntry.validation_message,
        is_shareable: true,
        created_at: cardEntry.created_at,
      });
    }
  } catch (err) {
    console.log('[SupabaseSync] Saved locally (Supabase optional or offline):', err);
  }
}
