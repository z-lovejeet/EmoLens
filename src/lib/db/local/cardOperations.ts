import { getLocalDB } from './schema';

export async function saveCardLocal(card: {
  id: string;
  checkin_id: string | null;
  emotion: string;
  intensity_level: 'mild' | 'moderate' | 'strong';
  what_helps_me: string[];
  validation_message: string | null;
  created_at: string;
  synced: boolean;
  synced_at: string | null;
}): Promise<void> {
  const db = await getLocalDB();
  await db.put('cards', card);
}

export async function getCardLocal(id: string) {
  const db = await getLocalDB();
  return db.get('cards', id) ?? null;
}

export async function getAllCardsLocal() {
  const db = await getLocalDB();
  return db.getAllFromIndex('cards', 'by-date');
}

export async function deleteCardLocal(id: string): Promise<void> {
  const db = await getLocalDB();
  await db.delete('cards', id);
}
