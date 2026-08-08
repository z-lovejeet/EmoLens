import { NextRequest, NextResponse } from 'next/server';

// Coping feedback is stored client-side in IndexedDB.
// This endpoint serves as a placeholder for future Supabase sync.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { strategyName, category, wasHelpful, checkinId, emotion } = body;

    if (!strategyName || typeof wasHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'strategyName and wasHelpful are required' },
        { status: 400 }
      );
    }

    // TODO: When Supabase auth is wired, insert into coping_log table
    // and update emotion_dictionary effective/ineffective arrays.

    return NextResponse.json({
      success: true,
      logged: { strategyName, category, wasHelpful, checkinId, emotion },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Coping feedback is managed client-side via IndexedDB. Use POST to log feedback.',
  });
}
