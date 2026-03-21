interface LoadingSpinnerProps {
  label?: string;
}

/**
 * 共通ローディングスピナー
 */
export function LoadingSpinner({
  label = '読み込み中...',
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className="flex flex-col items-center py-12 text-[var(--color-neutral-700)]"
    >
      <div
        aria-hidden="true"
        className="w-10 h-10 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin mb-4"
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}
