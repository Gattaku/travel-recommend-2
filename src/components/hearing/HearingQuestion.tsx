'use client';

import { useState } from 'react';
import type { HearingQuestion as HearingQuestionType, HearingAnswer } from '@/src/types';
import { HearingIcon } from './HearingIcon';

interface HearingQuestionProps {
  question: HearingQuestionType;
  initialAnswer?: HearingAnswer;
  onAnswer: (answer: HearingAnswer) => void;
  onSkip: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export function HearingQuestion({
  question,
  initialAnswer,
  onAnswer,
  onSkip,
  onBack,
  showBack = false,
}: HearingQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialAnswer?.selectedOptions ?? [],
  );
  const [freeText, setFreeText] = useState<string>(
    initialAnswer?.freeText ?? '',
  );

  function handleOptionToggle(optionId: string) {
    if (question.answerType === 'single-select') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
    }
  }

  function handleSubmit() {
    const answer: HearingAnswer = {
      questionId: question.id,
      selectedOptions,
      freeText: question.answerType === 'free-text' ? freeText || null : null,
      skipped: false,
    };
    onAnswer(answer);
  }

  function handleSkip() {
    onSkip();
  }

  const hasAnswer =
    question.answerType === 'free-text'
      ? freeText.trim().length > 0
      : selectedOptions.length > 0;

  function handleKeyDown(e: React.KeyboardEvent, optionId: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionToggle(optionId);
    }
  }

  return (
    <div className="space-y-5" role="region" aria-labelledby={`question-${question.id}`}>
      {/* Question header with icon */}
      <div className="flex items-start gap-3">
        {question.icon && (
          <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center text-[var(--color-primary-500)]">
            <HearingIcon icon={question.icon} className="w-5 h-5" />
          </div>
        )}
        <h3 id={`question-${question.id}`} className="text-lg font-semibold text-[var(--foreground)] pt-1.5">
          {question.questionText}
        </h3>
      </div>

      {question.answerType === 'free-text' ? (
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="自由に記入してください..."
          rows={3}
          aria-label={question.questionText}
          className="w-full border border-[var(--border)] rounded-[var(--radius-lg)] px-4 py-3 text-sm bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] resize-none transition-colors"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="group" aria-label={question.questionText}>
          {question.options?.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                role={question.answerType === 'single-select' ? 'radio' : 'checkbox'}
                aria-checked={isSelected}
                onClick={() => handleOptionToggle(option.id)}
                onKeyDown={(e) => handleKeyDown(e, option.id)}
                tabIndex={0}
                className={`
                  px-4 py-3 text-sm rounded-[var(--radius-lg)] border-2 transition-all text-left
                  ${
                    isSelected
                      ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)] font-semibold shadow-sm'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]/50'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {/* Checkbox/radio indicator */}
                  <span className={`
                    shrink-0 w-4 h-4 rounded-${question.answerType === 'single-select' ? 'full' : 'sm'} border-2 flex items-center justify-center transition-colors
                    ${isSelected
                      ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-500)]'
                      : 'border-[var(--color-neutral-400)]'
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </span>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="前の質問に戻る"
            className="px-5 py-2.5 text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)] hover:bg-[var(--color-neutral-100)] rounded-[var(--radius-lg)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-neutral-400)] focus:ring-offset-2"
          >
            ← 戻る
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasAnswer}
          aria-label="次の質問へ進む"
          className="btn-primary px-6 py-2.5 text-sm"
        >
          次へ →
        </button>
        <button
          type="button"
          onClick={handleSkip}
          aria-label="この質問をスキップ"
          className="px-5 py-2.5 text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-neutral-400)] focus:ring-offset-2"
        >
          スキップ
        </button>
      </div>
    </div>
  );
}
