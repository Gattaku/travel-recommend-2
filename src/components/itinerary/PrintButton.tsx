'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-[var(--color-primary-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-700)] transition-colors"
      aria-label="印刷する"
    >
      印刷する / PDF で保存
    </button>
  );
}
