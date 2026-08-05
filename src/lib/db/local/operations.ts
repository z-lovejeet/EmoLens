import { getLocalDB, type EmoLensDB } from './schema';

// ── Check-in operations ──

export async function saveCheckinLocal(
  checkin: Omit<EmoLensDB['checkins']['value'], 'synced' | 'synced_at'>
) {
  const db = await getLocalDB();
  await db.put('checkins', {
    ...checkin,
    synced: false,
    synced_at: null,
  });
}

export async function getCheckinLocal(id: string) {
  const db = await getLocalDB();
  return db.get('checkins', id);
}

export async function getRecentCheckinsLocal(limit: number = 20) {
  const db = await getLocalDB();
  const all = await db.getAllFromIndex('checkins', 'by-date');
  return all.reverse().slice(0, limit);
}

export async function getUnsyncedCheckinsLocal() {
  const db = await getLocalDB();
  const all = await db.getAll('checkins');
  return all.filter((c) => !c.synced);
}

export async function markCheckinSynced(id: string) {
  const db = await getLocalDB();
  const checkin = await db.get('checkins', id);
  if (checkin) {
    await db.put('checkins', {
      ...checkin,
      synced: true,
      synced_at: new Date().toISOString(),
    });
  }
}

// ── Dictionary operations ──

export async function getDictionaryLocal() {
  const db = await getLocalDB();
  return db.getAll('dictionary');
}

export async function getDictionaryEntryByEmotion(emotion: string) {
  const db = await getLocalDB();
  return db.getFromIndex('dictionary', 'by-emotion', emotion);
}

export async function upsertDictionaryLocal(
  entry: EmoLensDB['dictionary']['value']
) {
  const db = await getLocalDB();
  const existing = await db.getFromIndex('dictionary', 'by-emotion', entry.emotion);

  if (existing) {
    // Merge: union body_patterns, sum frequency, union coping lists
    const mergedPatterns = [...existing.body_patterns];
    for (const p of entry.body_patterns) {
      const ex = mergedPatterns.find((mp) => mp.zone === p.zone);
      if (ex) {
        const allSensations = new Set([...ex.sensations, ...p.sensations]);
        ex.sensations = Array.from(allSensations);
        ex.avgIntensity = (ex.avgIntensity + p.avgIntensity) / 2;
      } else {
        mergedPatterns.push({ ...p });
      }
    }

    await db.put('dictionary', {
      ...existing,
      body_patterns: mergedPatterns,
      frequency: existing.frequency + entry.frequency,
      effective_coping: Array.from(
        new Set([...existing.effective_coping, ...entry.effective_coping])
      ),
      ineffective_coping: Array.from(
        new Set([...existing.ineffective_coping, ...entry.ineffective_coping])
      ),
      last_identified:
        existing.last_identified > entry.last_identified
          ? existing.last_identified
          : entry.last_identified,
      synced: false,
      synced_at: null,
      updated_at: new Date().toISOString(),
    });
  } else {
    await db.put('dictionary', {
      ...entry,
      synced: false,
      synced_at: null,
    });
  }
}

// ── Coping log operations ──

export async function saveCopingLocal(
  entry: Omit<EmoLensDB['copingLog']['value'], 'synced' | 'synced_at'>
) {
  const db = await getLocalDB();
  await db.put('copingLog', {
    ...entry,
    synced: false,
    synced_at: null,
  });
}

export async function getCopingByCheckinLocal(checkinId: string) {
  const db = await getLocalDB();
  return db.getAllFromIndex('copingLog', 'by-checkin', checkinId);
}

// ── Card operations ──

export async function saveCardLocal(
  card: Omit<EmoLensDB['cards']['value'], 'synced' | 'synced_at'>
) {
  const db = await getLocalDB();
  await db.put('cards', {
    ...card,
    synced: false,
    synced_at: null,
  });
}

export async function getCardLocal(id: string) {
  const db = await getLocalDB();
  return db.get('cards', id);
}

export async function getRecentCardsLocal(limit: number = 20) {
  const db = await getLocalDB();
  const all = await db.getAllFromIndex('cards', 'by-date');
  return all.reverse().slice(0, limit);
}

// ── Sync metadata ──

export async function getSyncMeta(key: string) {
  const db = await getLocalDB();
  return db.get('syncMeta', key);
}

export async function setSyncMeta(key: string, value: string) {
  const db = await getLocalDB();
  await db.put('syncMeta', {
    key,
    value,
    updated_at: new Date().toISOString(),
  });
}

// ── Clear all data ──

export async function clearAllLocalData() {
  const db = await getLocalDB();
  const tx = db.transaction(
    ['checkins', 'dictionary', 'copingLog', 'cards', 'syncMeta'],
    'readwrite'
  );
  await Promise.all([
    tx.objectStore('checkins').clear(),
    tx.objectStore('dictionary').clear(),
    tx.objectStore('copingLog').clear(),
    tx.objectStore('cards').clear(),
    tx.objectStore('syncMeta').clear(),
    tx.done,
  ]);
}
