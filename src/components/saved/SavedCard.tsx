import Link from 'next/link';
import type { SavedProposal } from '@/src/types';

interface SavedCardProps {
  saved: SavedProposal;
}

export function SavedCard({ saved }: SavedCardProps) {
  return (
    <Link
      href={`/saved/${saved.id}`}
      className="block border border-[var(--border)] rounded-xl p-4 bg-[var(--surface)] hover:shadow-md transition-shadow"
      aria-label={`保存済み: ${saved.destination.name}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-[var(--foreground)] text-sm">
          {saved.destination.name}
        </h3>
        {saved.isDecided && (
          <span className="shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
            決定済み
          </span>
        )}
      </div>
      <p className="text-xs text-[var(--color-neutral-700)] line-clamp-2 mb-2">
        {saved.destination.overview}
      </p>
      <p className="text-xs text-[var(--color-primary-600)] font-medium mb-2">
        {saved.destination.estimatedBudget}
      </p>
      {saved.memo && (
        <p className="text-xs italic text-[var(--color-neutral-700)] line-clamp-1">
          メモ: {saved.memo}
        </p>
      )}
    </Link>
  );
}
