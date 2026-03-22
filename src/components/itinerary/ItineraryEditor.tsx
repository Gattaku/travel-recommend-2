'use client';

import { useState } from 'react';
import type {
  TripItinerary,
  ScheduleDay,
  PackingItem,
  Accommodation,
} from '@/src/types';

interface ItineraryEditorProps {
  itinerary: TripItinerary;
  onSave: (updates: Partial<TripItinerary>) => Promise<void>;
}

export function ItineraryEditor({ itinerary, onSave }: ItineraryEditorProps) {
  const [title, setTitle] = useState(itinerary.title);
  const [travelDates, setTravelDates] = useState(itinerary.travelDates);
  const [accommodation, setAccommodation] = useState<Accommodation>(
    itinerary.accommodation,
  );
  const [packingList, setPackingList] = useState<PackingItem[]>(
    itinerary.packingList,
  );
  const [schedule, setSchedule] = useState<ScheduleDay[]>(itinerary.schedule);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await onSave({ title, travelDates, accommodation, packingList, schedule });
      setSaveStatus('保存しました');
    } catch {
      setSaveStatus('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  }

  function togglePackingItem(index: number) {
    setPackingList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  function addPackingItem() {
    setPackingList((prev) => [...prev, { item: '', checked: false }]);
  }

  function updatePackingItemText(index: number, text: string) {
    setPackingList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, item: text } : item)),
    );
  }

  function removePackingItem(index: number) {
    setPackingList((prev) => prev.filter((_, i) => i !== index));
  }

  function addScheduleDay() {
    const nextDate =
      schedule.length > 0
        ? new Date(
            new Date(schedule[schedule.length - 1].date).getTime() +
              86400000,
          )
            .toISOString()
            .slice(0, 10)
        : travelDates.start ?? new Date().toISOString().slice(0, 10);
    setSchedule((prev) => [...prev, { date: nextDate, spots: [] }]);
  }

  function addSpot(dayIndex: number) {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, spots: [...day.spots, { name: '', memo: '' }] }
          : day,
      ),
    );
  }

  function updateSpot(
    dayIndex: number,
    spotIndex: number,
    field: 'name' | 'memo',
    value: string,
  ) {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              spots: day.spots.map((spot, j) =>
                j === spotIndex ? { ...spot, [field]: value } : spot,
              ),
            }
          : day,
      ),
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <section aria-label="タイトル">
        <label htmlFor="title" className="block text-sm font-semibold mb-1">
          タイトル
        </label>
        <input
          id="title"
          aria-label="タイトル"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
        />
      </section>

      {/* Travel dates */}
      <section aria-label="旅行日程">
        <h2 className="text-sm font-semibold mb-2">旅行日程</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-xs text-[var(--color-neutral-700)] mb-1">
              出発日
            </label>
            <input
              id="startDate"
              type="date"
              value={travelDates.start ?? ''}
              onChange={(e) =>
                setTravelDates((prev) => ({ ...prev, start: e.target.value || null }))
              }
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-xs text-[var(--color-neutral-700)] mb-1">
              帰宅日
            </label>
            <input
              id="endDate"
              type="date"
              value={travelDates.end ?? ''}
              onChange={(e) =>
                setTravelDates((prev) => ({ ...prev, end: e.target.value || null }))
              }
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            />
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section aria-label="スケジュール">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">スケジュール</h2>
          <button
            onClick={addScheduleDay}
            type="button"
            className="text-xs text-[var(--color-primary-600)] hover:underline"
          >
            + 日程を追加
          </button>
        </div>
        {schedule.length === 0 && (
          <p className="text-sm text-[var(--color-neutral-700)]">
            日程がありません。追加してください。
          </p>
        )}
        {schedule.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="border border-[var(--border)] rounded-lg p-4 mb-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <input
                type="date"
                value={day.date}
                aria-label={`${dayIndex + 1} 日目の日付`}
                onChange={(e) =>
                  setSchedule((prev) =>
                    prev.map((d, i) =>
                      i === dayIndex ? { ...d, date: e.target.value } : d,
                    ),
                  )
                }
                className="border border-[var(--border)] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              />
              <span className="text-xs text-[var(--color-neutral-700)]">
                {dayIndex + 1} 日目
              </span>
            </div>
            {day.spots.map((spot, spotIndex) => (
              <div key={spotIndex} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={spot.name}
                  placeholder="スポット名"
                  aria-label={`スポット ${spotIndex + 1} の名前`}
                  onChange={(e) =>
                    updateSpot(dayIndex, spotIndex, 'name', e.target.value)
                  }
                  className="flex-1 border border-[var(--border)] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
                />
                <input
                  type="text"
                  value={spot.memo}
                  placeholder="メモ"
                  aria-label={`スポット ${spotIndex + 1} のメモ`}
                  onChange={(e) =>
                    updateSpot(dayIndex, spotIndex, 'memo', e.target.value)
                  }
                  className="flex-1 border border-[var(--border)] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
                />
              </div>
            ))}
            <button
              onClick={() => addSpot(dayIndex)}
              type="button"
              className="text-xs text-[var(--color-primary-600)] hover:underline"
            >
              + スポットを追加
            </button>
          </div>
        ))}
      </section>

      {/* Accommodation */}
      <section aria-label="宿泊先">
        <h2 className="text-sm font-semibold mb-2">宿泊先</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              { key: 'name' as const, label: '宿泊施設名', type: 'text' as const },
              { key: 'address' as const, label: '住所', type: 'text' as const },
              { key: 'checkIn' as const, label: 'チェックイン', type: 'date' as const },
              { key: 'checkOut' as const, label: 'チェックアウト', type: 'date' as const },
            ]
          ).map(({ key, label, type }) => (
            <div key={key}>
              <label
                htmlFor={`accommodation-${key}`}
                className="block text-xs text-[var(--color-neutral-700)] mb-1"
              >
                {label}
              </label>
              <input
                id={`accommodation-${key}`}
                type={type}
                value={accommodation[key] ?? ''}
                onChange={(e) =>
                  setAccommodation((prev) => ({ ...prev, [key]: e.target.value || undefined }))
                }
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Packing list */}
      <section aria-label="持ち物リスト" role="region">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">持ち物リスト</h2>
          <button
            onClick={addPackingItem}
            type="button"
            className="text-xs text-[var(--color-primary-600)] hover:underline"
          >
            + アイテムを追加
          </button>
        </div>
        <ul className="space-y-2">
          {packingList.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`packing-${index}`}
                checked={item.checked}
                onChange={() => togglePackingItem(index)}
                className="w-4 h-4 accent-[var(--color-primary-600)]"
              />
              <input
                type="text"
                value={item.item}
                aria-label={`持ち物 ${index + 1}`}
                onChange={(e) => updatePackingItemText(index, e.target.value)}
                className="flex-1 border border-[var(--border)] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
              />
              <button
                onClick={() => removePackingItem(index)}
                type="button"
                aria-label="削除"
                className="text-[var(--color-neutral-700)] hover:text-red-500 text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Save button */}
      <div className="flex items-center gap-4 pt-2 border-t border-[var(--border)]">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-[var(--color-primary-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-700)] disabled:opacity-50 transition-colors"
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
        {saveStatus && (
          <p role="status" aria-live="polite" className="text-sm text-[var(--color-neutral-700)]">
            {saveStatus}
          </p>
        )}
      </div>
    </div>
  );
}
