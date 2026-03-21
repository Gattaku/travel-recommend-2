import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchHotels, RakutenApiError } from '@/src/lib/rakuten/hotels';
import { createClient } from '@/src/lib/supabase/server';

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const QuerySchema = z.object({
  largeClassCode: z.string().min(1),
  checkinDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkoutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adultNum: z.coerce.number().int().min(1).max(10),
  upClassNum: z.coerce.number().int().min(0).optional(),
  maxCharge: z.coerce.number().int().min(0).optional(),
  hits: z.coerce.number().int().min(1).max(30).optional(),
});

// ---------------------------------------------------------------------------
// GET /api/hotels
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  // Auth check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  // Parse query params
  const rawParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = QuerySchema.safeParse(rawParams);

  if (!parsed.success) {
    const fields = parsed.error.issues.map((e) => e.path.join('.'));
    return NextResponse.json(
      { error: 'パラメータが不正です', fields },
      { status: 400 },
    );
  }

  try {
    const result = await searchHotels(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof RakutenApiError) {
      if (err.code === 'NO_RESULTS') {
        return NextResponse.json({ hotels: [], totalCount: 0 }, { status: 200 });
      }
      if (err.code === 'AUTH_ERROR') {
        console.error('[GET /api/hotels] Auth error:', err.message);
        return NextResponse.json({ error: 'ホテル検索が利用できません' }, { status: 503 });
      }
    }
    console.error('[GET /api/hotels] unexpected error:', err);
    return NextResponse.json(
      { error: 'ホテル検索に失敗しました' },
      { status: 500 },
    );
  }
}
