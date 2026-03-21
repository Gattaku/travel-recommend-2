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
        className="text-center py-12 text-[var(--color-neutral-700)]"
      >
        <p className="text-lg">条件に合う旅行先が見つかりませんでした。</p>
        <p className="text-sm mt-2">条件を緩めてみてください。</p>
      </div>
    );
  }

  return (
    <section aria-label="旅行先候補一覧">
      <h2 className="text-base font-semibold text-[var(--color-neutral-700)] mb-4">
        {destinations.length} 件の旅行先候補
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
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
