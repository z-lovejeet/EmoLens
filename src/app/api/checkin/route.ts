import { NextResponse } from 'next/server';
import { emotionGraph } from '@/lib/ai/graph';
import { checkRateLimit, getClientIdentifier } from '@/lib/ai/rateLimit';
import type { BodyZoneInput, DictionaryEntry } from '@/lib/ai/state';

interface CheckinRequest {
  bodyData: BodyZoneInput[];
  context?: string;
  threadId?: string;
  userId?: string;
  dictionary?: DictionaryEntry[];
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    if (!checkRateLimit(clientId, 'checkin')) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body: CheckinRequest = await request.json();

    // Validate required fields
    if (!body.bodyData || !Array.isArray(body.bodyData) || body.bodyData.length === 0) {
      return NextResponse.json(
        { error: 'Body data is required and must be a non-empty array.' },
        { status: 400 }
      );
    }

    // Generate thread ID if not provided
    const threadId = body.threadId || crypto.randomUUID();

    // Invoke the graph (Phase 1: parseBody -> mapEmotion -> END)
    const result = await emotionGraph.invoke(
      {
        bodyData: body.bodyData,
        context: body.context ?? null,
        userId: body.userId ?? null,
        threadId,
        userDictionary: body.dictionary ?? [],
      },
      {
        configurable: { thread_id: threadId },
      }
    );

    // Crisis detected — return immediately with crisis message
    if (result.crisisDetected) {
      return NextResponse.json({
        crisis: true,
        validationMessage: result.validationMessage,
        threadId,
      });
    }

    // Error state
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Success — return suggestions
    return NextResponse.json({
      suggestions: result.emotionSuggestions,
      validation: result.validationMessage,
      threadId,
      usedFallback: result.usedFallback,
    });
  } catch (error) {
    console.error('[/api/checkin] Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
