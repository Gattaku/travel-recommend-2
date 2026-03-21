import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/src/lib/supabase/server';
import type { Destination, PackingItem } from '@/src/types';

// Default packing list for family trips
function getDefaultPackingList(): PackingItem[] {
  return [
    { item: '旅行保険証・保険証', checked: false },
    { item: '常備薬・酔い止め', checked: false },
    { item: '子供の着替え（日数分＋1）', checked: false },
    { item: '大人の着替え（日数分）', checked: false },
    { item: '歯ブラシ・歯磨き粉', checked: false },
    { item: 'シャンプー・ボディソープ', checked: false },
    { item: 'タオル', checked: false },
    { item: '充電器・モバイルバッテリー', checked: false },
    { item: 'カメラ・メモリカード', checked: false },
    { item: '現金・クレジットカード', checked: false },
    { item: '日焼け止め', checked: false },
    { item: '雨具', checked: false },
  ];
}

// ---------------------------------------------------------------------------
// POST /api/itinerary — しおり雛形を生成
// ---------------------------------------------------------------------------

const CreateSchema = z.object({
  savedProposalId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
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

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'savedProposalId が必要です' }, { status: 400 });
  }

  const { savedProposalId } = parsed.data;

  // Fetch the saved proposal
  const { data: sp, error: spError } = await supabase
    .from('saved_proposals')
    .select('*')
    .eq('id', savedProposalId)
    .eq('user_id', user.id)
    .single();

  if (spError || !sp) {
    return NextResponse.json({ error: '保存済み提案が見つかりません' }, { status: 404 });
  }

  const destination = sp.destination as Destination;
  const title = `${destination.name} 家族旅行`;
  const packingList = getDefaultPackingList();

  const { data, error } = await supabase
    .from('itineraries')
    .insert({
      user_id: user.id,
      saved_proposal_id: savedProposalId,
      title,
      travel_dates: { start: null, end: null },
      schedule: [],
      accommodation: {},
      packing_list: packingList,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('[POST /api/itinerary] DB error:', error?.message);
    return NextResponse.json({ error: 'しおりの作成に失敗しました' }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: data.id,
      title: data.title,
      travelDates: data.travel_dates,
      schedule: data.schedule,
      accommodation: data.accommodation,
      packingList: data.packing_list,
    },
    { status: 201 },
  );
}
