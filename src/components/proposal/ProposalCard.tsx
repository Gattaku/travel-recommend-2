'use client';

import { useState } from 'react';
import type { Destination } from '@/src/types';

interface ProposalCardProps {
  destination: Destination;
  proposalId: string;
  onSave?: (destination: Destination, proposalId: string) => Promise<void>;
}

const STYLE_COLORS: Record<string, { bar: string; badge: string }> = {
  自然: { bar: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  温泉: { bar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  リゾート: { bar: 'bg-sky-400', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
  文化: { bar: 'bg-violet-400', badge: 'bg-violet-50 text-violet-700 border-violet-200' },
  都市: { bar: 'bg-slate-400', badge: 'bg-slate-50 text-slate-700 border-slate-200' },
};

function detectStyle(destination: Destination): { bar: string; badge: string } {
  const text = `${destination.name} ${destination.overview}`;
  for (const [keyword, colors] of Object.entries(STYLE_COLORS)) {
    if (text.includes(keyword)) return colors;
  }
  return { bar: 'bg-[var(--color-primary-400)]', badge: 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-[var(--color-primary-200)]' };
}

export function ProposalCard({ destination, proposalId, onSave }: ProposalCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const colors = detectStyle(destination);

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
      className="card overflow-hidden flex flex-col"
      aria-label={`旅行先候補: ${destination.name}`}
    >
      {/* Color bar */}
      <div className={`h-1.5 ${colors.bar}`} />

      <div className="p-5 flex flex-col flex-1">
        <header className="mb-3">
          <h3
            data-testid="destination-name"
            className="text-lg font-bold text-[var(--foreground)]"
          >
            {destination.name}
          </h3>
          <p
            data-testid="destination-budget"
            className="inline-block mt-2 text-sm font-semibold px-3 py-1 rounded-full bg-[var(--color-accent-50)] text-[var(--color-accent-600)] border border-[var(--color-accent-200)]"
          >
            {destination.estimatedBudget}
          </p>
        </header>

        <p
          data-testid="destination-overview"
          className="text-sm text-[var(--color-neutral-700)] mb-4 leading-relaxed"
        >
          {destination.overview}
        </p>

        <div className="mb-4">
          <h4 className="text-xs font-semibold text-[var(--color-neutral-600)] uppercase tracking-wide mb-2">
            見どころ
          </h4>
          <ul className="flex flex-wrap gap-2">
            {destination.highlights.map((h) => (
              <li
                key={h}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colors.badge}`}
              >
                {h}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-[var(--color-neutral-600)] mb-4 leading-relaxed">
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
            className={`
              mt-auto w-full py-2.5 text-sm font-semibold rounded-[var(--radius-lg)] transition-all
              ${isSaved
                ? 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-green-200 cursor-default'
                : isSaving
                  ? 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-500)] border border-[var(--border)] cursor-not-allowed'
                  : 'btn-secondary cursor-pointer'
              }
            `}
          >
            {isSaved ? '✓ 保存済み' : isSaving ? '保存中...' : '♡ 保存する'}
          </button>
        )}
      </div>
    </article>
  );
}
