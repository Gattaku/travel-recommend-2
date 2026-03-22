/**
 * Typed Supabase client helper
 *
 * Since Supabase generated types are not yet available (requires `supabase gen types`
 * against a running project), we use a manually typed wrapper to avoid `never` errors.
 *
 * TODO: Replace with generated types via `npx supabase gen types typescript --local > src/types/supabase.ts`
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseClient = any;

export function asTyped(client: unknown): SupabaseClient {
  return client;
}
