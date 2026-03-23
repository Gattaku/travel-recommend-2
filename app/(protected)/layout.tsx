import { redirect } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase: AnyClient = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="font-bold text-transparent bg-clip-text bg-[var(--gradient-hero)] text-xl tracking-tight"
          >
            家族旅行プランナー
          </Link>
          <div className="flex items-center gap-1 text-sm">
            <Link
              href="/propose"
              className="px-3 py-2 rounded-[var(--radius-lg)] text-[var(--color-neutral-700)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] font-medium transition-all"
            >
              旅行先を探す
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-[var(--radius-lg)] text-[var(--color-neutral-700)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] font-medium transition-all"
            >
              マイリスト
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
