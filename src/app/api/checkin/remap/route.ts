import { NextResponse } from 'next/server';
import { emotionGraph } from '@/lib/ai/graph';
import { checkRateLimit, getClientIdentifier } from '@/lib/ai/rateLimit';

interface RemapRequest {
  threadId: string;
  rejectionReason?: string;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    if (!checkRateLimit(clientId, 'remap')) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body: RemapRequest = await request.json();

    // Validate required fields
    if (!body.threadId) {
      return NextResponse.json(
        { error: 'threadId is required.' },
        { status: 400 }
      );
    }

    // Re-invoke the graph with rejection context
    // The mapEmotion node will check mappingAttempt > 0 and use remapping prompt
    const result = await emotionGraph.invoke(
      {
        rejectionContext: body.rejectionReason ?? null,
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
      suggestions: result.emotionSuggestions,
      validation: result.validationMessage,
      threadId: body.threadId,
      usedFallback: result.usedFallback,
    });
  } catch (error) {
    console.error('[/api/checkin/remap] Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
