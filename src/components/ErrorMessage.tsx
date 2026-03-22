interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * 統一エラー表示コンポーネント
 * API タイムアウト・楽天API 0件・Claude エラーなどに使用
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm"
    >
      <p className="text-red-700 mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-red-600 underline hover:text-red-800"
        >
          もう一度試す
        </button>
      )}
    </div>
  );
}
