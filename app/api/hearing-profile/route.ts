import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/src/lib/supabase/server';

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const PreferencesSchema = z.object({
  hobbies: z.array(z.string()).default([]),
  travelPriorities: z.array(z.string()).default([]),
  childInterests: z.array(z.string()).default([]),
  transportPreference: z.string().nullable().default(null),
  foodPreferences: z.array(z.string()).default([]),
  customNotes: z.string().nullable().default(null),
});

const PutRequestSchema = z.object({
  preferences: PreferencesSchema,
});

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAuthUser(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ---------------------------------------------------------------------------
// GET /api/hearing-profile
// ---------------------------------------------------------------------------

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const user = await getAuthUser(supabase);

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('hearing_profiles')
    .select('id, preferences, updated_at')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'hearing profile not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    preferences: data.preferences,
    updatedAt: data.updated_at,
  });
}

// ---------------------------------------------------------------------------
// PUT /api/hearing-profile (upsert)
// ---------------------------------------------------------------------------

export async function PUT(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const user = await getAuthUser(supabase);

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
  }

  const parsed = PutRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((e) => e.path.join('.'));
    return NextResponse.json({ error: 'validation error', fields }, { status: 400 });
  }

  const { preferences } = parsed.data;

  // Upsert: INSERT ON CONFLICT UPDATE
  const { data, error } = await supabase
    .from('hearing_profiles')
    .upsert(
      {
        user_id: user.id,
        preferences,
      },
      { onConflict: 'user_id' },
    )
    .select('id, preferences, updated_at')
    .single();

  if (error) {
    console.error('[PUT /api/hearing-profile] DB error:', error.message);
    return NextResponse.json({ error: 'failed to save profile' }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    preferences: data.preferences,
    updatedAt: data.updated_at,
  });
}

// ---------------------------------------------------------------------------
// DELETE /api/hearing-profile
// ---------------------------------------------------------------------------

export async function DELETE() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const user = await getAuthUser(supabase);

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { error, count } = await supabase
    .from('hearing_profiles')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('[DELETE /api/hearing-profile] DB error:', error.message);
    return NextResponse.json({ error: 'failed to delete profile' }, { status: 500 });
  }

  if (count === 0) {
    return NextResponse.json({ error: 'hearing profile not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
