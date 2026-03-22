'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ItineraryEditor } from '@/src/components/itinerary/ItineraryEditor';
import type { TripItinerary } from '@/src/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ItineraryPage({ params }: Props) {
  const { id } = use(params);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/itinerary/${id}`);
        if (!res.ok) throw new Error('しおりの取得に失敗しました');
        const data = await res.json();
        setItinerary({
          id: data.id,
          userId: '',
          savedProposalId: null,
          title: data.title,
          travelDates: data.travelDates,
          schedule: data.schedule,
          accommodation: data.accommodation,
          packingList: data.packingList,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'エラーが発生しました';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave(updates: Partial<TripItinerary>) {
    const body: Record<string, unknown> = {};
    if (updates.title !== undefined) body.title = updates.title;
    if (updates.travelDates !== undefined) body.travelDates = updates.travelDates;
    if (updates.schedule !== undefined) body.schedule = updates.schedule;
    if (updates.accommodation !== undefined) body.accommodation = updates.accommodation;
    if (updates.packingList !== undefined) body.packingList = updates.packingList;

    const res = await fetch(`/api/itinerary/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('保存に失敗しました');

    // Update local state
    setItinerary((prev) => (prev ? { ...prev, ...updates } : prev));
  }

  if (isLoading) {
    return (
      <div role="status" aria-label="読み込み中" className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        {error ?? 'しおりが見つかりませんでした'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            旅のしおり
          </h1>
          <p className="text-sm text-[var(--color-neutral-700)] mt-1">
            {itinerary.title}
          </p>
        </div>
        <Link
          href={`/itinerary/${id}/print`}
          className="px-4 py-2 border border-[var(--color-primary-600)] text-[var(--color-primary-600)] text-sm font-medium rounded-lg hover:bg-[var(--color-primary-50)] transition-colors"
          aria-label="しおりを出力する"
        >
          しおりを出力する
        </Link>
      </header>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <ItineraryEditor itinerary={itinerary} onSave={handleSave} />
      </div>
    </div>
  );
}
