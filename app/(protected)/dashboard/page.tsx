import Link from 'next/link';
import { createClient } from '@/src/lib/supabase/server';
import { SavedList } from '@/src/components/saved/SavedList';
import type { SavedProposal } from '@/src/types';

export const revalidate = 0; // Always fetch fresh data

async function getSavedProposals(userId: string): Promise<SavedProposal[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const { data, error } = await supabase
    .from('saved_proposals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[dashboard] getSavedProposals error:', error.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    proposalId: row.proposal_id,
    destination: row.destination as SavedProposal['destination'],
    memo: row.memo,
    isDecided: row.is_decided,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export default async function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const saved = user ? await getSavedProposals(user.id) : [];

  const decided = saved.filter((s) => s.isDecided);
  const notDecided = saved.filter((s) => !s.isDecided);

  return (
    <div className="space-y-8">
      {saved.length === 0 ? (
        /* Welcome section for first-time users */
        <section className="relative overflow-hidden rounded-[var(--radius-2xl)] bg-gradient-to-br from-[var(--color-primary-500)] via-[var(--color-primary-600)] to-[#764ba2] p-8 sm:p-12 text-white">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" fill="currentColor">
              <circle cx="100" cy="100" r="80" />
              <circle cx="160" cy="40" r="30" />
              <circle cx="40" cy="160" r="20" />
            </svg>
          </div>

          <div className="relative z-10 max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              家族旅行を計画しましょう！
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
              AIがぴったりの旅行先を提案します。
              まずは条件を入力してみましょう。
            </p>
            <Link
              href="/propose"
              className="btn-accent inline-block px-8 py-3.5 text-base"
            >
              旅行先を探す →
            </Link>
          </div>
        </section>
      ) : (
        /* Dashboard header for returning users */
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              マイリスト
            </h1>
            <div className="mt-2 flex gap-3 text-sm">
              <span className="px-2.5 py-1 rounded-full bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] font-medium">
                {notDecided.length} 件検討中
              </span>
              {decided.length > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[var(--color-success-50)] text-[var(--color-success-700)] font-medium">
                  {decided.length} 件決定済み
                </span>
              )}
            </div>
          </div>
          <Link
            href="/propose"
            className="btn-primary px-6 py-2.5 text-sm"
          >
            旅行先を探す
          </Link>
        </header>
      )}

      {decided.length > 0 && (
        <section aria-label="決定済みの旅行先">
          <h2 className="text-base font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            決定済み
          </h2>
          <SavedList saved={decided} />
        </section>
      )}

      {notDecided.length > 0 && (
        <section aria-label="検討中の旅行先">
          <h2 className="text-base font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary-400)]" />
            検討中
          </h2>
          <SavedList saved={notDecided} />
        </section>
      )}
    </div>
  );
}
