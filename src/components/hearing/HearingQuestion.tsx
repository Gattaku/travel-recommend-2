'use client';

import { useState } from 'react';
import type { HearingQuestion as HearingQuestionType, HearingAnswer } from '@/src/types';

interface HearingQuestionProps {
  question: HearingQuestionType;
  initialAnswer?: HearingAnswer;
  onAnswer: (answer: HearingAnswer) => void;
  onSkip: () => void;
}

export function HearingQuestion({
  question,
  initialAnswer,
  onAnswer,
  onSkip,
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
    <div className="space-y-4" role="region" aria-labelledby={`question-${question.id}`}>
      <h3 id={`question-${question.id}`} className="text-lg font-medium text-[var(--foreground)]">
        {question.questionText}
      </h3>

      {question.answerType === 'free-text' ? (
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="自由に記入してください..."
          rows={3}
          aria-label={question.questionText}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label={question.questionText}>
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
                  px-4 py-3 text-sm rounded-lg border transition-colors text-left
                  ${
                    isSelected
                      ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)] font-medium'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--color-primary-300)]'
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasAnswer}
          aria-label="次の質問へ進む"
          className="px-6 py-2 bg-[var(--color-primary-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
        >
          次へ
        </button>
        <button
          type="button"
          onClick={handleSkip}
          aria-label="この質問をスキップ"
          className="px-6 py-2 text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-neutral-400)] focus:ring-offset-2"
        >
          スキップ
        </button>
      </div>
    </div>
  );
}
