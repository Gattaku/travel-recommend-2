'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  HearingQuestion as HearingQuestionType,
  HearingAnswer,
  HearingPreferences,
  FamilyProfile,
  TripCondition,
} from '@/src/types';
import { HEARING_QUESTIONS } from '@/src/lib/hearing/questions';
import { filterQuestions } from '@/src/lib/hearing/filterQuestions';
import { HearingProgress } from './HearingProgress';
import { HearingQuestion } from './HearingQuestion';

// ---------------------------------------------------------------------------
// localStorage keys
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'travel-recommend:hearing-draft';

interface HearingDraft {
  answers: HearingAnswer[];
  currentStep: number;
}

function saveDraft(draft: HearingDraft) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // localStorage 容量超過等は無視
  }
}

function loadDraft(): HearingDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HearingDraft;
  } catch {
    return null;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// プロフィール → プリセット回答に変換
// ---------------------------------------------------------------------------
function preferencesToAnswers(prefs: HearingPreferences): HearingAnswer[] {
  const answers: HearingAnswer[] = [];

  if (prefs.hobbies.length > 0) {
    answers.push({ questionId: 'hobbies', selectedOptions: prefs.hobbies, freeText: null, skipped: false });
  }
  if (prefs.travelPriorities.length > 0) {
    answers.push({ questionId: 'priorities', selectedOptions: prefs.travelPriorities, freeText: null, skipped: false });
  }
  if (prefs.childInterests.length > 0) {
    answers.push({ questionId: 'child-interests', selectedOptions: prefs.childInterests, freeText: null, skipped: false });
  }
  if (prefs.transportPreference) {
    answers.push({ questionId: 'transport', selectedOptions: [prefs.transportPreference], freeText: null, skipped: false });
  }
  if (prefs.foodPreferences.length > 0) {
    answers.push({ questionId: 'food', selectedOptions: prefs.foodPreferences, freeText: null, skipped: false });
  }
  if (prefs.customNotes) {
    answers.push({ questionId: 'custom-notes', selectedOptions: [], freeText: prefs.customNotes, skipped: false });
  }

  return answers;
}

// ---------------------------------------------------------------------------
// 回答 → プロフィール preferences に変換
// ---------------------------------------------------------------------------
function answersToPreferences(answers: HearingAnswer[]): HearingPreferences {
  const prefs: HearingPreferences = {
    hobbies: [],
    travelPriorities: [],
    childInterests: [],
    transportPreference: null,
    foodPreferences: [],
    customNotes: null,
  };

  for (const a of answers) {
    if (a.skipped) continue;

    switch (a.questionId) {
      case 'hobbies':
        prefs.hobbies = a.selectedOptions;
        break;
      case 'priorities':
      case 'overseas-preferences':
        prefs.travelPriorities = [...prefs.travelPriorities, ...a.selectedOptions];
        break;
      case 'child-interests':
      case 'infant-needs':
        prefs.childInterests = [...prefs.childInterests, ...a.selectedOptions];
        break;
      case 'transport':
        prefs.transportPreference = a.selectedOptions[0] ?? null;
        break;
      case 'food':
        prefs.foodPreferences = a.selectedOptions;
        break;
      case 'custom-notes':
        prefs.customNotes = a.freeText;
        break;
    }
  }

  return prefs;
}

// ---------------------------------------------------------------------------
// プロフィール保存 (API)
// ---------------------------------------------------------------------------
async function saveProfile(preferences: HearingPreferences): Promise<void> {
  try {
    await fetch('/api/hearing-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences }),
    });
  } catch {
    // 保存失敗はサイレント（提案フローを止めない）
    console.error('Failed to save hearing profile');
  }
}

async function loadProfile(): Promise<HearingPreferences | null> {
  try {
    const res = await fetch('/api/hearing-profile');
    if (!res.ok) return null;
    const data = await res.json();
    return data.preferences as HearingPreferences;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 質問フィルタリング（filterQuestions.ts に委譲）
// ---------------------------------------------------------------------------
function getActiveQuestions(
  profile: FamilyProfile,
  condition: TripCondition,
): HearingQuestionType[] {
  return filterQuestions(HEARING_QUESTIONS, profile, condition);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface HearingFlowProps {
  profile: FamilyProfile;
  condition: TripCondition;
  onComplete: (answers: HearingAnswer[]) => void;
  onSkipAll: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HearingFlow({
  profile,
  condition,
  onComplete,
  onSkipAll,
}: HearingFlowProps) {
  const questions = getActiveQuestions(profile, condition);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<HearingAnswer[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [ignorePreset, setIgnorePreset] = useState(false);
  const [hasPreset, setHasPreset] = useState(false);
  const [showPresetChoice, setShowPresetChoice] = useState(false);

  // 初期化: draft復元 or 保存済みプロフィール読み込み
  useEffect(() => {
    if (initialized) return;

    async function init() {
      // 1. ドラフト復元を優先
      const draft = loadDraft();
      if (draft && draft.answers.length > 0) {
        setAnswers(draft.answers);
        setCurrentStep(draft.currentStep);
        setInitialized(true);
        return;
      }

      // 2. 保存済みプロフィールからプリセット
      const prefs = await loadProfile();
      if (prefs && !ignorePreset) {
        const preset = preferencesToAnswers(prefs);
        if (preset.length > 0) {
          setAnswers(preset);
          setHasPreset(true);
          setShowPresetChoice(true);
        }
      }

      setInitialized(true);
    }

    init();
  }, [initialized, ignorePreset]);

  const handleAnswer = useCallback(
    (answer: HearingAnswer) => {
      const newAnswers = [...answers.filter((a) => a.questionId !== answer.questionId), answer];
      const nextStep = currentStep + 1;

      setAnswers(newAnswers);
      setCurrentStep(nextStep);
      saveDraft({ answers: newAnswers, currentStep: nextStep });

      // 最後の質問に回答した場合
      if (nextStep >= questions.length) {
        clearDraft();
        // プロフィールを自動保存
        const preferences = answersToPreferences(newAnswers);
        saveProfile(preferences);
        onComplete(newAnswers);
      }
    },
    [answers, currentStep, questions.length, onComplete],
  );

  const handleSkip = useCallback(() => {
    const skipAnswer: HearingAnswer = {
      questionId: questions[currentStep]?.id ?? '',
      selectedOptions: [],
      freeText: null,
      skipped: true,
    };
    handleAnswer(skipAnswer);
  }, [currentStep, questions, handleAnswer]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveDraft({ answers, currentStep: prevStep });
    }
  }, [currentStep, answers]);

  const handleSkipAll = useCallback(() => {
    clearDraft();
    onSkipAll();
  }, [onSkipAll]);

  // プリセットを使う
  const handleUsePreset = useCallback(() => {
    setShowPresetChoice(false);
  }, []);

  // プリセットをリセットして最初から
  const handleIgnorePreset = useCallback(() => {
    setIgnorePreset(true);
    setAnswers([]);
    setCurrentStep(0);
    setHasPreset(false);
    setShowPresetChoice(false);
    clearDraft();
  }, []);

  // 質問が0件の場合（条件フィルタで全除外など）
  if (questions.length === 0) {
    onSkipAll();
    return null;
  }

  if (!initialized) {
    return (
      <div className="card-static p-6">
        <p className="text-sm text-[var(--color-neutral-600)]">読み込み中...</p>
      </div>
    );
  }

  // プリセット選択画面
  if (showPresetChoice) {
    return (
      <div className="card-static p-6 sm:p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[var(--color-primary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
            前回の回答があります
          </h2>
          <p className="text-sm text-[var(--color-neutral-600)] mb-6 leading-relaxed">
            前回のヒアリング回答を引き継いで、そのまま使うこともできます。
            新しく答え直すこともできます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleUsePreset}
              className="btn-primary px-6 py-2.5 text-sm"
            >
              前回の回答を使う
            </button>
            <button
              type="button"
              onClick={handleIgnorePreset}
              className="btn-secondary px-6 py-2.5 text-sm"
            >
              最初から答え直す
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 全質問回答済み（復元後に即完了する場合）
  if (currentStep >= questions.length) {
    return null;
  }

  const currentQuestion = questions[currentStep];
  const existingAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  return (
    <div className="card-static p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          もう少し教えてください
        </h2>
        <button
          type="button"
          onClick={handleSkipAll}
          className="text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] underline transition-colors"
        >
          スキップして基本条件だけで提案
        </button>
      </div>

      {hasPreset && !ignorePreset && (
        <p className="text-xs text-[var(--color-primary-600)] mb-4">
          前回の回答がプリセットされています
        </p>
      )}

      <HearingProgress currentStep={currentStep} totalSteps={questions.length} />

      <HearingQuestion
        key={currentQuestion.id}
        question={currentQuestion}
        initialAnswer={existingAnswer}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onBack={handleBack}
        showBack={currentStep > 0}
      />
    </div>
  );
}
