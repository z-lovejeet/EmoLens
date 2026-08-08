import { create } from 'zustand';
import { getDictionaryLocal } from '@/lib/db/local/operations';

export interface DictionaryLocalEntry {
  id: string;
  emotion: string;
  body_patterns: { zone: string; sensations: string[]; avgIntensity: number }[];
  frequency: number;
  effective_coping: string[];
  ineffective_coping: string[];
  first_identified: string;
  last_identified: string;
  updated_at: string;
}

interface DictionaryState {
  entries: DictionaryLocalEntry[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;

  loadFromLocal: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useDictionaryStore = create<DictionaryState>((set, get) => ({
  entries: [],
  isLoaded: false,
  isLoading: false,
  error: null,

  loadFromLocal: async () => {
    if (get().isLoaded) return;
    set({ isLoading: true, error: null });
    try {
      const raw = await getDictionaryLocal();
      const sorted = [...raw].sort((a, b) => b.frequency - a.frequency);
      set({
        entries: sorted.map((e) => ({
          id: e.id,
          emotion: e.emotion,
          body_patterns: e.body_patterns,
          frequency: e.frequency,
          effective_coping: e.effective_coping,
          ineffective_coping: e.ineffective_coping,
          first_identified: e.first_identified,
          last_identified: e.last_identified,
          updated_at: e.updated_at,
        })),
        isLoaded: true,
        isLoading: false,
      });
    } catch (err) {
      console.error('[dictionaryStore] Failed to load:', err);
      set({ error: 'Failed to load dictionary', isLoading: false });
    }
  },

  refresh: async () => {
    set({ isLoaded: false });
    await get().loadFromLocal();
  },
}));
