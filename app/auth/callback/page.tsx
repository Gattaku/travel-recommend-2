'use client';

import { createClient } from '@/src/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const code = new URLSearchParams(window.location.search).get('code');

    if (!code) {
      router.replace('/login?error=no_code');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('[auth/callback] exchangeCodeForSession error:', error.message);
        router.replace('/login?error=auth_failed');
      } else {
        router.replace('/dashboard');
      }
    });
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-[var(--color-neutral-700)]">認証中...</p>
    </main>
  );
}
