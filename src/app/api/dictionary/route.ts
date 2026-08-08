import { NextResponse } from 'next/server';

// Dictionary entries are stored client-side in IndexedDB.
// This endpoint serves as a placeholder for future Supabase integration.
// The client reads directly from IndexedDB via the dictionaryStore.

export async function GET() {
  return NextResponse.json({
    message: 'Dictionary entries are managed client-side via IndexedDB. Use the dictionaryStore for access.',
    entries: [],
  });
}
