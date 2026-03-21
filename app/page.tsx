import { redirect } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';

export default async function RootPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
