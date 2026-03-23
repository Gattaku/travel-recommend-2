import Link from 'next/link';
import type { SavedProposal } from '@/src/types';

interface SavedCardProps {
  saved: SavedProposal;
}

export function SavedCard({ saved }: SavedCardProps) {
  return (
    <Link
      href={`/saved/${saved.id}`}
      className="card block overflow-hidden group"
      aria-label={`保存済み: ${saved.destination.name}`}
    >
      <div className={`h-1 ${saved.isDecided ? 'bg-emerald-400' : 'bg-[var(--color-primary-400)]'}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-[var(--foreground)] text-sm group-hover:text-[var(--color-primary-600)] transition-colors">
            {saved.destination.name}
          </h3>
          {saved.isDecided && (
            <span className="shrink-0 text-xs bg-[var(--color-success-50)] text-[var(--color-success-700)] px-2.5 py-0.5 rounded-full border border-green-200 font-medium">
              決定済み
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-neutral-600)] line-clamp-2 mb-2 leading-relaxed">
          {saved.destination.overview}
        </p>
        <p className="text-xs text-[var(--color-accent-600)] font-semibold mb-2">
          {saved.destination.estimatedBudget}
        </p>
        {saved.memo && (
          <p className="text-xs text-[var(--color-neutral-500)] line-clamp-1">
            📝 {saved.memo}
          </p>
        )}
      </div>
    </Link>
  );
}
