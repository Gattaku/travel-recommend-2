import type { SavedProposal } from '@/src/types';
import { SavedCard } from './SavedCard';

interface SavedListProps {
  saved: SavedProposal[];
  emptyMessage?: string;
}

export function SavedList({
  saved,
  emptyMessage = 'まだ保存した旅行先がありません',
}: SavedListProps) {
  if (saved.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="text-center py-12 text-[var(--color-neutral-700)]"
      >
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
      {saved.map((s) => (
        <li key={s.id} role="listitem">
          <SavedCard saved={s} />
        </li>
      ))}
    </ul>
  );
}
