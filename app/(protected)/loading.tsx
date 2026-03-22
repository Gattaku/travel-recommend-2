export default function Loading() {
  return (
    <div
      role="status"
      aria-label="読み込み中"
      className="flex justify-center py-20"
    >
      <div
        aria-hidden="true"
        className="w-10 h-10 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin"
      />
    </div>
  );
}
