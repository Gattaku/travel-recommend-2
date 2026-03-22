'use client';

interface HearingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function HearingProgress({ currentStep, totalSteps }: HearingProgressProps) {
  const percentage = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <div className="mb-6" role="progressbar" aria-valuenow={currentStep} aria-valuemin={0} aria-valuemax={totalSteps} aria-label={`ヒアリング進捗: ${currentStep}/${totalSteps}問`}>
      <div className="flex justify-between text-sm text-[var(--color-neutral-700)] mb-2">
        <span>{currentStep} / {totalSteps} 問</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary-500)] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
