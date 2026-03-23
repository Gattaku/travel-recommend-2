'use client';

import { useState, useEffect } from 'react';
import { ProposalForm } from '@/src/components/proposal/ProposalForm';
import { PathSelector } from '@/src/components/proposal/PathSelector';
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
  | 'form'         // 基本条件入力中
  | 'path-select'  // クイック or こだわり選択
  | 'hearing'      // ヒアリング中
  | 'loading'      // 提案生成中
  | 'result';      // 提案結果表示中

const LOADING_MESSAGES = [
  '旅行先を探しています...',
  'ぴったりの場所を見つけています...',
  'おすすめを厳選しています...',
  'もう少しお待ちください...',
];

const SEASON_LABELS: Record<string, string> = {
  spring: '春', summer: '夏', autumn: '秋', winter: '冬',
};
const STYLE_LABELS: Record<string, string> = {
  nature: '自然体験', culture: '文化・歴史', resort: 'リゾート', onsen: '温泉', city: '都市観光',
};
const AREA_LABELS: Record<string, string> = {
  domestic: '国内', overseas: '海外',
};

export default function ProposePage() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProposeResponse | null>(null);
  const [familyProfile, setFamilyProfile] = useState<FamilyProfile | null>(null);
  const [tripCondition, setTripCondition] = useState<TripCondition | null>(null);

  // ─── フォーム送信 → パス選択画面へ ───
  function handleFormNext(profile: FamilyProfile, condition: TripCondition) {
    setFamilyProfile(profile);
    setTripCondition(condition);
    setError(null);
    setResult(null);
    setPageState('path-select');
  }

  // ─── クイック提案 ───
  async function handleQuickPropose() {
    if (!familyProfile || !tripCondition) return;
    await fetchProposal(familyProfile, tripCondition);
  }

  // ─── こだわり提案 → ヒアリングへ ───
  function handleDetailedHearing() {
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

  // ─── 「条件を変更する」→ フォームへ ───
  function handleChangeConditions() {
    setPageState('form');
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
          旅行先を探す
        </h1>
        <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
          家族構成と希望条件を入力すると、おすすめの旅行先を提案します。
        </p>
      </header>

      {/* Step 1: 基本条件入力フォーム */}
      {pageState === 'form' && (
        <section
          aria-label="旅行条件入力"
          className="card-static p-6"
        >
          <ProposalForm
            onSubmit={handleFormNext}
            isLoading={isLoading}
          />
        </section>
      )}

      {/* Step 2: パス選択（クイック vs こだわり） */}
      {pageState === 'path-select' && (
        <section aria-label="提案方法を選択" className="card-static p-6">
          <PathSelector
            onQuickPropose={handleQuickPropose}
            onDetailedHearing={handleDetailedHearing}
          />
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleChangeConditions}
              className="text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] underline transition-colors"
            >
              ← 条件を変更する
            </button>
          </div>
        </section>
      )}

      {/* Step 3: ヒアリングフロー */}
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
          className="flex flex-col items-center py-16 text-[var(--color-neutral-600)]"
        >
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--color-primary-500)] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </div>
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-[var(--color-primary-200)] animate-ping opacity-30" />
          </div>
          <LoadingMessages messages={LOADING_MESSAGES} />
          <p className="text-xs text-[var(--color-neutral-500)] mt-2">最大 30 秒かかる場合があります</p>
        </div>
      )}

      {/* Error state */}
      {error && pageState === 'result' && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-red-50 border border-red-200 rounded-[var(--radius-xl)] text-red-700 text-sm"
        >
          {error}
        </div>
      )}

      {/* Results */}
      {result && pageState === 'result' && (
        <>
          {/* Condition summary */}
          {tripCondition && familyProfile && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--color-neutral-500)]">検索条件:</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-100)] font-medium">
                {SEASON_LABELS[tripCondition.season] ?? tripCondition.season}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-accent-50)] text-[var(--color-accent-600)] border border-[var(--color-accent-200)] font-medium">
                予算 {(tripCondition.budget / 10000).toFixed(0)}万円
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] border border-[var(--color-neutral-200)] font-medium">
                {STYLE_LABELS[tripCondition.style] ?? tripCondition.style}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] border border-[var(--color-neutral-200)] font-medium">
                {AREA_LABELS[tripCondition.area] ?? tripCondition.area}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] border border-[var(--color-neutral-200)] font-medium">
                大人{familyProfile.adultCount}名
                {familyProfile.childrenAges.length > 0 && ` + 子供(${familyProfile.childrenAges.join('歳, ')}歳)`}
              </span>
              <button
                type="button"
                onClick={handleChangeConditions}
                className="text-xs text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline ml-1"
              >
                条件を変更
              </button>
            </div>
          )}

          {/* もっと絞り込むボタン */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRefine}
              className="btn-secondary px-6 py-2 text-sm"
            >
              もっと絞り込む
            </button>
          </div>

          <ProposalList
            destinations={result.destinations}
            proposalId={result.proposalId}
            onSave={handleSave}
          />

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

// ---------------------------------------------------------------------------
// Loading messages component with rotation
// ---------------------------------------------------------------------------
function LoadingMessages({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <p className="text-sm font-medium text-[var(--color-neutral-700)] transition-opacity duration-500">
      {messages[index]}
    </p>
  );
}
