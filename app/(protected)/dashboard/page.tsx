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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            保存済みの旅行先
          </h1>
          <p className="mt-1 text-sm text-[var(--color-neutral-700)]">
            {saved.length} 件保存中
          </p>
        </div>
        <Link
          href="/propose"
          className="px-4 py-2 bg-[var(--color-primary-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-700)] transition-colors"
        >
          旅行先を提案する
        </Link>
      </header>

      {saved.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-xl">
          <p className="text-[var(--color-neutral-700)] mb-4">
            まだ保存した旅行先がありません
          </p>
          <Link
            href="/propose"
            className="px-6 py-3 bg-[var(--color-primary-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-700)] transition-colors"
          >
            旅行先を探してみる
          </Link>
        </div>
      )}

      {decided.length > 0 && (
        <section aria-label="決定済みの旅行先">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">
            決定済み
          </h2>
          <SavedList saved={decided} />
        </section>
      )}

      {notDecided.length > 0 && (
        <section aria-label="検討中の旅行先">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">
            検討中
          </h2>
          <SavedList saved={notDecided} />
        </section>
      )}
    </div>
  );
}
