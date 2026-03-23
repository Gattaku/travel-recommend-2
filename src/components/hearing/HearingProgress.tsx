'use client';

interface HearingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function HearingProgress({ currentStep, totalSteps }: HearingProgressProps) {
  return (
    <div
      className="mb-8"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={0}
      aria-valuemax={totalSteps}
      aria-label={`ヒアリング進捗: ${currentStep}/${totalSteps}問`}
    >
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              {/* Step dot */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                    ${isCompleted
                      ? 'bg-[var(--color-primary-500)] text-white'
                      : isCurrent
                        ? 'bg-[var(--color-primary-500)] text-white ring-4 ring-[var(--color-primary-100)]'
                        : 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)]'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {isCurrent && (
                  <div className="absolute inset-0 w-8 h-8 rounded-full bg-[var(--color-primary-400)] animate-ping opacity-20" />
                )}
              </div>

              {/* Connecting line */}
              {i < totalSteps - 1 && (
                <div className="flex-1 mx-1">
                  <div
                    className={`h-0.5 rounded-full transition-colors duration-300 ${
                      i < currentStep
                        ? 'bg-[var(--color-primary-400)]'
                        : 'bg-[var(--color-neutral-200)]'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Text indicator */}
      <p className="mt-3 text-xs text-center text-[var(--color-neutral-500)]">
        {currentStep} / {totalSteps} 問回答済み
      </p>
    </div>
  );
}
