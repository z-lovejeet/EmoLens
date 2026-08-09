import { NextResponse } from 'next/server';
import { emotionGraph } from '@/lib/ai/graph';
import { checkRateLimit, getClientIdentifier } from '@/lib/ai/rateLimit';
import type { BodyZoneInput } from '@/lib/ai/state';

interface SelectionRequest {
  threadId: string;
  selectedEmotion: string;
  bodyData?: BodyZoneInput[];
  userId?: string;
  sensoryPreferences?: string[];
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    if (!checkRateLimit(clientId, 'select')) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body: SelectionRequest = await request.json();

    // Validate required fields
    if (!body.threadId || !body.selectedEmotion) {
      return NextResponse.json(
        { error: 'threadId and selectedEmotion are required.' },
        { status: 400 }
      );
    }

    // Invoke the graph for Phase 2: updateDictionary -> suggestCoping -> generateCard -> END
    // Pass bodyData explicitly for serverless compatibility (MemorySaver is in-memory only)
    const result = await emotionGraph.invoke(
      {
        selectedEmotion: body.selectedEmotion,
        bodyData: body.bodyData ?? [],
        sensoryPreferences: body.sensoryPreferences ?? [],
      },
      {
        configurable: { thread_id: body.threadId },
      }
    );

    // Error state
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      dictionaryUpdate: result.dictionaryUpdate,
      copingStrategies: result.copingStrategies,
      communicationCard: result.communicationCard,
    });
  } catch (error) {
    console.error('[/api/checkin/select] Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
