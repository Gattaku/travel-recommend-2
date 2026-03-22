import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/src/lib/supabase/server';

type RouteContext = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// GET /api/itinerary/:id
// ---------------------------------------------------------------------------

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'しおりが見つかりません' }, { status: 404 });
  }

  return NextResponse.json(
    {
      id: data.id,
      title: data.title,
      travelDates: data.travel_dates,
      schedule: data.schedule,
      accommodation: data.accommodation,
      packingList: data.packing_list,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
    { status: 200 },
  );
}

// ---------------------------------------------------------------------------
// PATCH /api/itinerary/:id
// ---------------------------------------------------------------------------

const SpotSchema = z.object({
  name: z.string(),
  memo: z.string().default(''),
});

const ScheduleDaySchema = z.object({
  date: z.string(),
  spots: z.array(SpotSchema).default([]),
});

const AccommodationSchema = z
  .object({
    name: z.string().optional(),
    address: z.string().optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
  })
  .optional();

const PackingItemSchema = z.object({
  item: z.string(),
  checked: z.boolean().default(false),
});

const PatchSchema = z.object({
  title: z.string().min(1).optional(),
  travelDates: z
    .object({ start: z.string().nullable(), end: z.string().nullable() })
    .optional(),
  schedule: z.array(ScheduleDaySchema).optional(),
  accommodation: AccommodationSchema,
  packingList: z.array(PackingItemSchema).optional(),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'リクエストボディが不正です' }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'データが不正です' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.title !== undefined) updates.title = d.title;
  if (d.travelDates !== undefined) updates.travel_dates = d.travelDates;
  if (d.schedule !== undefined) updates.schedule = d.schedule;
  if (d.accommodation !== undefined) updates.accommodation = d.accommodation;
  if (d.packingList !== undefined) updates.packing_list = d.packingList;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: '更新内容がありません' }, { status: 400 });
  }

  const { error } = await supabase
    .from('itineraries')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[PATCH /api/itinerary/:id] DB error:', error.message);
    return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
  }

  return NextResponse.json({ id, updated: true }, { status: 200 });
}
