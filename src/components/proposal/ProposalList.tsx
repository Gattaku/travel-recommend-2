import type { Destination } from '@/src/types';
import { ProposalCard } from './ProposalCard';

interface ProposalListProps {
  destinations: Destination[];
  proposalId: string;
  onSave?: (destination: Destination, proposalId: string) => Promise<void>;
}

export function ProposalList({ destinations, proposalId, onSave }: ProposalListProps) {
  if (destinations.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="text-center py-16 text-[var(--color-neutral-600)]"
      >
        <svg className="mx-auto w-12 h-12 mb-4 text-[var(--color-neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <p className="text-lg font-medium">条件に合う旅行先が見つかりませんでした</p>
        <p className="text-sm mt-2">条件を緩めてみてください。</p>
      </div>
    );
  }

  return (
    <section aria-label="旅行先候補一覧">
      <h2 className="text-base font-bold text-[var(--foreground)] mb-4">
        {destinations.length} 件の旅行先候補
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
        {destinations.map((dest) => (
          <li key={dest.name} role="listitem">
            <ProposalCard
              destination={dest}
              proposalId={proposalId}
              onSave={onSave}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
