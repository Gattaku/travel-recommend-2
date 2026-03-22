'use client';

import { useState } from 'react';
import type { Destination } from '@/src/types';

interface ProposalCardProps {
  destination: Destination;
  proposalId: string;
  onSave?: (destination: Destination, proposalId: string) => Promise<void>;
}

export function ProposalCard({ destination, proposalId, onSave }: ProposalCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave() {
    if (!onSave || isSaved) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(destination, proposalId);
      setIsSaved(true);
    } catch {
      setSaveError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article
      data-testid="proposal-card"
      className="border border-[var(--border)] rounded-xl p-5 bg-[var(--surface)] hover:shadow-md transition-shadow"
      aria-label={`旅行先候補: ${destination.name}`}
    >
      <header className="mb-3">
        <h3
          data-testid="destination-name"
          className="text-lg font-bold text-[var(--foreground)]"
        >
          {destination.name}
        </h3>
        <p
          data-testid="destination-budget"
          className="text-sm text-[var(--color-primary-600)] font-medium mt-1"
        >
          費用目安: {destination.estimatedBudget}
        </p>
      </header>

      <p
        data-testid="destination-overview"
        className="text-sm text-[var(--color-neutral-700)] mb-3 leading-relaxed"
      >
        {destination.overview}
      </p>

      <div className="mb-3">
        <h4 className="text-xs font-semibold text-[var(--color-neutral-700)] uppercase tracking-wide mb-1">
          見どころ
        </h4>
        <ul className="flex flex-wrap gap-2">
          {destination.highlights.map((h) => (
            <li
              key={h}
              className="text-xs bg-[var(--color-primary-50)] text-[var(--color-primary-700)] px-2 py-0.5 rounded-full border border-[var(--color-primary-100)]"
            >
              {h}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-[var(--color-neutral-700)] italic mb-4">
        {destination.tips}
      </p>

      {saveError && (
        <p role="alert" className="text-xs text-red-600 mb-2">
          {saveError}
        </p>
      )}

      {onSave && (
        <button
          onClick={handleSave}
          disabled={isSaving || isSaved}
          aria-disabled={isSaving || isSaved}
          className="w-full py-2 text-sm font-medium border rounded-lg transition-colors
            disabled:cursor-not-allowed
            data-[saved]:bg-green-50 data-[saved]:text-green-700 data-[saved]:border-green-200
            enabled:border-[var(--color-primary-600)] enabled:text-[var(--color-primary-600)] enabled:hover:bg-[var(--color-primary-50)]
            disabled:border-[var(--border)] disabled:text-[var(--color-neutral-700)]"
          data-saved={isSaved ? '' : undefined}
        >
          {isSaved ? '保存済み' : isSaving ? '保存中...' : '保存する'}
        </button>
      )}
    </article>
  );
}
