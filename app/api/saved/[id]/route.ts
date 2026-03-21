import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/src/lib/supabase/server';

type RouteContext = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// GET /api/saved/:id — 単体取得
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
    .from('saved_proposals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: '見つかりませんでした' }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// ---------------------------------------------------------------------------
// PATCH /api/saved/:id — メモ更新・決定フラグ変更
// ---------------------------------------------------------------------------

const PatchSchema = z.object({
  memo: z.string().optional(),
  isDecided: z.boolean().optional(),
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
  if (parsed.data.memo !== undefined) updates.memo = parsed.data.memo;
  if (parsed.data.isDecided !== undefined) updates.is_decided = parsed.data.isDecided;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: '更新内容がありません' }, { status: 400 });
  }

  const { error } = await supabase
    .from('saved_proposals')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[PATCH /api/saved/:id] DB error:', error.message);
    return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
  }

  return NextResponse.json({ id, updated: true }, { status: 200 });
}

// ---------------------------------------------------------------------------
// DELETE /api/saved/:id — 削除
// ---------------------------------------------------------------------------

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { error } = await supabase
    .from('saved_proposals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[DELETE /api/saved/:id] DB error:', error.message);
    return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
