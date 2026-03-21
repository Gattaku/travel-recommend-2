'use client';

import { useState } from 'react';
import { ProposalForm } from '@/src/components/proposal/ProposalForm';
import { ProposalList } from '@/src/components/proposal/ProposalList';
import type {
  FamilyProfile,
  TripCondition,
  Destination,
  ProposeResponse,
} from '@/src/types';

export default function ProposePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProposeResponse | null>(null);

  async function handlePropose(profile: FamilyProfile, condition: TripCondition) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyProfile: profile, condition }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 504) {
          throw new Error('提案の生成に時間がかかっています。しばらく待ってから再度お試しください。');
        }
        throw new Error((data as { error?: string }).error ?? '提案の生成に失敗しました');
      }

      const data: ProposeResponse = await response.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(destination: Destination, proposalId: string) {
    const response = await fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId, destination }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error((data as { error?: string }).error ?? '保存に失敗しました');
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          旅行先を提案する
        </h1>
        <p className="mt-1 text-sm text-[var(--color-neutral-700)]">
          家族構成と希望条件を入力すると、おすすめの旅行先を提案します。
        </p>
      </header>

      <section
        aria-label="旅行条件入力"
        className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6"
      >
        <ProposalForm onSubmit={handlePropose} isLoading={isLoading} />
      </section>

      {/* Loading state */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          aria-label="提案を生成中"
          className="flex flex-col items-center py-12 text-[var(--color-neutral-700)]"
        >
          <div
            aria-hidden="true"
            className="w-10 h-10 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin mb-4"
          />
          <p className="text-sm">旅行先を探しています... 最大 30 秒かかる場合があります</p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
        >
          {error}
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <ProposalList
          destinations={result.destinations}
          proposalId={result.proposalId}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
