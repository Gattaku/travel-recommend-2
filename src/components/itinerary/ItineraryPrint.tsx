import type { TripItinerary } from '@/src/types';

interface ItineraryPrintProps {
  itinerary: TripItinerary;
}

export function ItineraryPrint({ itinerary }: ItineraryPrintProps) {
  const { title, travelDates, schedule, accommodation, packingList } = itinerary;

  const dateRange =
    travelDates.start && travelDates.end
      ? `${travelDates.start} 〜 ${travelDates.end}`
      : travelDates.start
      ? `${travelDates.start} 出発`
      : '日程未定';

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 font-sans print:px-0">
      {/* Cover */}
      <header className="text-center mb-10 pb-6 border-b-2 border-[var(--color-primary-600)]">
        <h1 className="text-3xl font-bold text-[var(--color-primary-600)] mb-2">
          {title}
        </h1>
        <p className="text-lg text-[var(--color-neutral-700)]">{dateRange}</p>
        <p className="text-xs text-[var(--color-neutral-700)] mt-4 print:hidden">
          このページを印刷またはPDFに保存できます
        </p>
      </header>

      {/* Schedule */}
      {schedule.length > 0 && (
        <section className="mb-8" aria-label="スケジュール">
          <h2 className="text-lg font-bold border-b border-[var(--border)] pb-1 mb-4">
            スケジュール
          </h2>
          {schedule.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-5">
              <h3 className="text-sm font-semibold text-[var(--color-primary-600)] mb-2">
                {dayIndex + 1} 日目 — {day.date}
              </h3>
              {day.spots.length === 0 ? (
                <p className="text-sm text-[var(--color-neutral-700)] ml-4">
                  （スポット未設定）
                </p>
              ) : (
                <ol className="ml-4 space-y-1 list-decimal list-inside">
                  {day.spots.map((spot, spotIndex) => (
                    <li key={spotIndex} className="text-sm">
                      <span className="font-medium">{spot.name}</span>
                      {spot.memo && (
                        <span className="text-[var(--color-neutral-700)] ml-2">
                          — {spot.memo}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Accommodation */}
      {(accommodation.name || accommodation.address) && (
        <section className="mb-8" aria-label="宿泊先">
          <h2 className="text-lg font-bold border-b border-[var(--border)] pb-1 mb-4">
            宿泊先
          </h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {accommodation.name && (
              <>
                <dt className="text-[var(--color-neutral-700)]">宿泊施設</dt>
                <dd className="font-medium">{accommodation.name}</dd>
              </>
            )}
            {accommodation.address && (
              <>
                <dt className="text-[var(--color-neutral-700)]">住所</dt>
                <dd>{accommodation.address}</dd>
              </>
            )}
            {accommodation.checkIn && (
              <>
                <dt className="text-[var(--color-neutral-700)]">チェックイン</dt>
                <dd>{accommodation.checkIn}</dd>
              </>
            )}
            {accommodation.checkOut && (
              <>
                <dt className="text-[var(--color-neutral-700)]">チェックアウト</dt>
                <dd>{accommodation.checkOut}</dd>
              </>
            )}
          </dl>
        </section>
      )}

      {/* Packing list */}
      {packingList.length > 0 && (
        <section className="mb-8" aria-label="持ち物リスト">
          <h2 className="text-lg font-bold border-b border-[var(--border)] pb-1 mb-4">
            持ち物リスト
          </h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {packingList.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span
                  aria-label={item.checked ? 'チェック済み' : '未チェック'}
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center shrink-0 ${
                    item.checked
                      ? 'bg-[var(--color-primary-600)] border-[var(--color-primary-600)] text-white'
                      : 'border-[var(--color-neutral-700)]'
                  }`}
                >
                  {item.checked && '✓'}
                </span>
                <span className={item.checked ? 'line-through text-[var(--color-neutral-700)]' : ''}>
                  {item.item}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-10 pt-4 border-t border-[var(--border)] text-center">
        <p className="text-xs text-[var(--color-neutral-700)]">
          家族旅行プランナー — 良い旅を！
        </p>
      </footer>
    </div>
  );
}
