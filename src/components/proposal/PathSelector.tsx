'use client';

interface PathSelectorProps {
  onQuickPropose: () => void;
  onDetailedHearing: () => void;
}

export function PathSelector({ onQuickPropose, onDetailedHearing }: PathSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--foreground)] text-center">
        どのように旅行先を探しますか？
      </h2>
      <p className="text-sm text-[var(--color-neutral-600)] text-center">
        提案の精度を高めたい場合は「こだわり提案」がおすすめです
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {/* Quick propose card */}
        <button
          type="button"
          onClick={onQuickPropose}
          className="card group text-left p-6 cursor-pointer hover:border-[var(--color-accent-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-400)] focus:ring-offset-2"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-accent-50)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-[var(--color-accent-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[var(--foreground)] mb-1">
            すぐに結果を見る
          </h3>
          <p className="text-sm text-[var(--color-neutral-600)] mb-3 leading-relaxed">
            入力した基本条件だけでAIが旅行先を提案します。ざっくり候補を見たい時に。
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent-600)] bg-[var(--color-accent-50)] px-2.5 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            約10秒
          </span>
        </button>

        {/* Detailed hearing card */}
        <button
          type="button"
          onClick={onDetailedHearing}
          className="card group text-left p-6 cursor-pointer hover:border-[var(--color-primary-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] focus:ring-offset-2 relative overflow-hidden"
        >
          {/* Recommended badge */}
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-white bg-[var(--color-primary-500)] px-2 py-0.5 rounded-full">
              おすすめ
            </span>
          </div>

          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-[var(--color-primary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[var(--foreground)] mb-1">
            好みを詳しく伝える
          </h3>
          <p className="text-sm text-[var(--color-neutral-600)] mb-3 leading-relaxed">
            5〜8問の質問に答えて、あなたの家族にピッタリの旅行先を見つけます。
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-2.5 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            約2〜3分
          </span>
        </button>
      </div>
    </div>
  );
}
