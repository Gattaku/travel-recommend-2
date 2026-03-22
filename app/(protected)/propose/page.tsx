'use client';

import { useState } from 'react';
import { ProposalForm } from '@/src/components/proposal/ProposalForm';
import { ProposalList } from '@/src/components/proposal/ProposalList';
import { HotelSearchSection } from '@/src/components/hotel/HotelSearchSection';
import { HearingFlow } from '@/src/components/hearing/HearingFlow';
import type {
  FamilyProfile,
  TripCondition,
  Destination,
  ProposeResponse,
  HearingAnswer,
} from '@/src/types';

// ---------------------------------------------------------------------------
// Page state
// ---------------------------------------------------------------------------
type PageState =
  | 'form'       // 基本条件入力中
  | 'hearing'    // ヒアリング中
  | 'loading'    // 提案生成中
  | 'result';    // 提案結果表示中

export default function ProposePage() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProposeResponse | null>(null);
  const [familyProfile, setFamilyProfile] = useState<FamilyProfile | null>(null);
  const [tripCondition, setTripCondition] = useState<TripCondition | null>(null);

  // ─── 基本条件のみで提案 ───
  async function handlePropose(profile: FamilyProfile, condition: TripCondition) {
    setFamilyProfile(profile);
    setTripCondition(condition);
    await fetchProposal(profile, condition);
  }

  // ─── ヒアリング開始 ───
  function handleStartHearing(profile: FamilyProfile, condition: TripCondition) {
    setFamilyProfile(profile);
    setTripCondition(condition);
    setError(null);
    setResult(null);
    setPageState('hearing');
  }

  // ─── ヒアリング完了 → 提案生成 ───
  async function handleHearingComplete(answers: HearingAnswer[]) {
    if (!familyProfile || !tripCondition) return;
    await fetchProposal(familyProfile, tripCondition, answers);
  }

  // ─── ヒアリングスキップ → 基本条件のみで提案 ───
  async function handleHearingSkipAll() {
    if (!familyProfile || !tripCondition) return;
    await fetchProposal(familyProfile, tripCondition);
  }

  // ─── 「もっと絞り込む」→ ヒアリングへ ───
  function handleRefine() {
    setPageState('hearing');
  }

  // ─── 提案 API 呼び出し ───
  async function fetchProposal(
    profile: FamilyProfile,
    condition: TripCondition,
    hearingAnswers?: HearingAnswer[],
  ) {
    setPageState('loading');
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyProfile: profile,
          condition,
          hearingAnswers: hearingAnswers ?? undefined,
        }),
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
      setPageState('result');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setError(msg);
      setPageState('result');
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

  const isLoading = pageState === 'loading';

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

      {/* 基本条件入力フォーム（form/result 状態で表示） */}
      {(pageState === 'form' || pageState === 'result') && (
        <section
          aria-label="旅行条件入力"
          className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6"
        >
          <ProposalForm
            onSubmit={handlePropose}
            onStartHearing={handleStartHearing}
            isLoading={isLoading}
          />
        </section>
      )}

      {/* ヒアリングフロー */}
      {pageState === 'hearing' && familyProfile && tripCondition && (
        <section aria-label="ヒアリング">
          <HearingFlow
            profile={familyProfile}
            condition={tripCondition}
            onComplete={handleHearingComplete}
            onSkipAll={handleHearingSkipAll}
          />
        </section>
      )}

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
      {error && pageState === 'result' && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
        >
          {error}
        </div>
      )}

      {/* Results */}
      {result && pageState === 'result' && (
        <>
          {/* もっと絞り込むボタン */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRefine}
              className="px-6 py-2 text-sm border border-[var(--color-primary-500)] text-[var(--color-primary-600)] font-medium rounded-lg hover:bg-[var(--color-primary-50)] transition-colors"
            >
              もっと絞り込む
            </button>
          </div>

          <ProposalList
            destinations={result.destinations}
            proposalId={result.proposalId}
            onSave={handleSave}
          />

          {/* Hotel search after itinerary candidates */}
          <HotelSearchSection
            destinations={result.destinations}
            adultNum={familyProfile?.adultCount ?? 2}
            childrenCount={familyProfile?.childrenAges.length ?? 0}
          />
        </>
      )}
    </div>
  );
}
