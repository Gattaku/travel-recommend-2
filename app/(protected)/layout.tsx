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
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="font-bold text-[var(--color-primary-600)] text-lg"
          >
            家族旅行プランナー
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/propose"
              className="text-[var(--color-neutral-700)] hover:text-[var(--color-primary-600)] transition-colors"
            >
              提案を見る
            </Link>
            <Link
              href="/dashboard"
              className="text-[var(--color-neutral-700)] hover:text-[var(--color-primary-600)] transition-colors"
            >
              保存済み
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
