import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { propose, ProposeError } from '@/src/lib/claude/propose';
import { createClient } from '@/src/lib/supabase/server';

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const FamilyProfileSchema = z.object({
  adultCount: z.number().int().min(1).max(10),
  childrenAges: z.array(z.number().int().min(0).max(17)).default([]),
});

const TripConditionSchema = z.object({
  season: z.enum(['spring', 'summer', 'autumn', 'winter']),
  budget: z.number().min(0),
  style: z.enum(['nature', 'culture', 'resort', 'onsen', 'city']),
  area: z.enum(['domestic', 'overseas']),
});

const HearingAnswerSchema = z.object({
  questionId: z.string(),
  selectedOptions: z.array(z.string()),
  freeText: z.string().nullable(),
  skipped: z.boolean(),
});

const RequestSchema = z.object({
  familyProfile: FamilyProfileSchema,
  condition: TripConditionSchema,
  hearingAnswers: z.array(HearingAnswerSchema).optional(),
});

// ---------------------------------------------------------------------------
// POST /api/propose
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // Auth check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  // Parse request
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'リクエストボディが不正です' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((e) => e.path.join('.'));
    return NextResponse.json(
      { error: '条件が不足しています', fields },
      { status: 400 },
    );
  }

  const { familyProfile, condition, hearingAnswers } = parsed.data;

  // Generate proposals
  let result;
  try {
    result = await propose(familyProfile, condition, hearingAnswers);
  } catch (err: unknown) {
    if (err instanceof ProposeError) {
      if (err.code === 'TIMEOUT') {
        return NextResponse.json(
          { error: '提案の生成に時間がかかっています。再度お試しください。' },
          { status: 504 },
        );
      }
      if (err.code === 'VALIDATION_ERROR') {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }
    console.error('[POST /api/propose] unexpected error:', err);
    return NextResponse.json(
      { error: '提案の生成に失敗しました' },
      { status: 500 },
    );
  }

  // Persist to trip_proposals table
  const { error: dbError } = await supabase.from('trip_proposals').insert({
    id: result.proposalId,
    user_id: user.id,
    condition,
    destinations: result.destinations,
  });

  if (dbError) {
    console.error('[POST /api/propose] DB insert error:', dbError.message);
    // Non-fatal: return result even if DB write fails
  }

  return NextResponse.json(result, { status: 200 });
}
