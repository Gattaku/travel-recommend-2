import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/src/lib/supabase/server';
import type { SavedProposal, Destination } from '@/src/types';

// ---------------------------------------------------------------------------
// GET /api/saved — 保存済み一覧を取得
// ---------------------------------------------------------------------------

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('saved_proposals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[GET /api/saved] DB error:', error.message);
    return NextResponse.json({ error: '取得に失敗しました' }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saved: SavedProposal[] = (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    proposalId: row.proposal_id,
    destination: row.destination as Destination,
    memo: row.memo,
    isDecided: row.is_decided,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return NextResponse.json({ saved }, { status: 200 });
}

// ---------------------------------------------------------------------------
// POST /api/saved — 提案を保存
// ---------------------------------------------------------------------------

const DestinationSchema = z.object({
  name: z.string().min(1),
  overview: z.string(),
  highlights: z.array(z.string()),
  estimatedBudget: z.string(),
  tips: z.string(),
});

const SaveRequestSchema = z.object({
  proposalId: z.string().uuid(),
  destination: DestinationSchema,
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

  const parsed = SaveRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((e) => e.path.join('.'));
    return NextResponse.json({ error: 'データが不正です', fields }, { status: 400 });
  }

  const { proposalId, destination } = parsed.data;

  // Duplicate check
  const { data: existing } = await supabase
    .from('saved_proposals')
    .select('id')
    .eq('user_id', user.id)
    .eq('destination->>name', destination.name)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: 'この旅行先はすでに保存されています', id: existing.id },
      { status: 409 },
    );
  }

  const { data, error } = await supabase
    .from('saved_proposals')
    .insert({
      user_id: user.id,
      proposal_id: proposalId,
      destination,
      memo: '',
      is_decided: false,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('[POST /api/saved] DB error:', error?.message);
    return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
