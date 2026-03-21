import { redirect } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';
import { ItineraryPrint } from '@/src/components/itinerary/ItineraryPrint';
import { PrintButton } from '@/src/components/itinerary/PrintButton';
import type { TripItinerary, ScheduleDay, PackingItem, Accommodation } from '@/src/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PrintPage({ params }: Props) {
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return (
      <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        しおりが見つかりませんでした
      </div>
    );
  }

  const itinerary: TripItinerary = {
    id: data.id,
    userId: data.user_id,
    savedProposalId: data.saved_proposal_id,
    title: data.title,
    travelDates: data.travel_dates as TripItinerary['travelDates'],
    schedule: (data.schedule as ScheduleDay[]) ?? [],
    accommodation: (data.accommodation as Accommodation) ?? {},
    packingList: (data.packing_list as PackingItem[]) ?? [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return (
    <div>
      {/* Print controls — hidden in actual print */}
      <div className="print:hidden sticky top-0 bg-white border-b border-[var(--border)] py-3 px-4 flex items-center gap-4 z-10">
        <PrintButton />
        <a
          href={`/itinerary/${id}`}
          className="text-sm text-[var(--color-neutral-700)] hover:underline"
        >
          編集に戻る
        </a>
      </div>

      <main>
        <ItineraryPrint itinerary={itinerary} />
      </main>
    </div>
  );
}
