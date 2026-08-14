import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let dbStatus = 'unreachable';

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/communication_cards?select=id&limit=1`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: 'no-store',
      });

      if (res.ok) {
        dbStatus = 'active';
      }
    } catch (e) {
      console.error('[keep-alive] Error pinging Supabase:', e);
    }
  }

  return NextResponse.json({
    status: 'ok',
    app: 'EmoLens',
    supabase: dbStatus,
    timestamp: new Date().toISOString(),
  });
}
