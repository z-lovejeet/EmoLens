import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { BodyZoneData, EmotionSuggestion, BodyPattern, CopingCategory } from '@/types/database';

export interface EmoLensDB extends DBSchema {
  checkins: {
    key: string;
    value: {
      id: string;
      body_data: BodyZoneData[];
      context: string | null;
      ai_suggestions: EmotionSuggestion[] | null;
      selected_emotion: string | null;
      thread_id: string | null;
      created_at: string;
      synced: boolean;
      synced_at: string | null;
    };
    indexes: {
      'by-date': string;
      'by-synced': string;
      'by-emotion': string;
    };
  };

  dictionary: {
    key: string;
    value: {
      id: string;
      emotion: string;
      body_patterns: BodyPattern[];
      frequency: number;
      effective_coping: string[];
      ineffective_coping: string[];
      first_identified: string;
      last_identified: string;
      synced: boolean;
      synced_at: string | null;
      updated_at: string;
    };
    indexes: {
      'by-emotion': string;
      'by-synced': string;
    };
  };

  copingLog: {
    key: string;
    value: {
      id: string;
      checkin_id: string | null;
      strategy_name: string;
      category: CopingCategory;
      was_helpful: boolean | null;
      created_at: string;
      synced: boolean;
      synced_at: string | null;
    };
    indexes: {
      'by-checkin': string;
      'by-synced': string;
    };
  };

  cards: {
    key: string;
    value: {
      id: string;
      checkin_id: string | null;
      emotion: string;
      intensity_level: 'mild' | 'moderate' | 'strong';
      what_helps_me: string[];
      validation_message: string | null;
      created_at: string;
      synced: boolean;
      synced_at: string | null;
    };
    indexes: {
      'by-date': string;
      'by-synced': string;
    };
  };

  syncMeta: {
    key: string;
    value: {
      key: string;
      value: string;
      updated_at: string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<EmoLensDB>> | null = null;

export function getLocalDB(): Promise<IDBPDatabase<EmoLensDB>> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only available in the browser');
  }
  
  if (!dbPromise) {
    dbPromise = openDB<EmoLensDB>('emolens-local', 1, {
      upgrade(db) {
        // Checkins store
        const checkinStore = db.createObjectStore('checkins', { keyPath: 'id' });
        checkinStore.createIndex('by-date', 'created_at');
        checkinStore.createIndex('by-synced', 'synced');
        checkinStore.createIndex('by-emotion', 'selected_emotion');

        // Dictionary store
        const dictStore = db.createObjectStore('dictionary', { keyPath: 'id' });
        dictStore.createIndex('by-emotion', 'emotion', { unique: true });
        dictStore.createIndex('by-synced', 'synced');

        // Coping log store
        const copingStore = db.createObjectStore('copingLog', { keyPath: 'id' });
        copingStore.createIndex('by-checkin', 'checkin_id');
        copingStore.createIndex('by-synced', 'synced');

        // Cards store
        const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
        cardStore.createIndex('by-date', 'created_at');
        cardStore.createIndex('by-synced', 'synced');

        // Sync metadata store
        db.createObjectStore('syncMeta', { keyPath: 'key' });
      },
    });
  }

  return dbPromise;
}
