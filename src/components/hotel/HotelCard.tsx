import type { HotelResult } from '@/src/lib/rakuten/hotels';

interface HotelCardProps {
  hotel: HotelResult;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <article
      data-testid="hotel-card"
      className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)] hover:shadow-md transition-shadow"
      aria-label={`ホテル: ${hotel.hotelName}`}
    >
      {hotel.hotelImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hotel.hotelImageUrl}
          alt={hotel.hotelName}
          className="w-full h-36 object-cover"
        />
      )}
      <div className="p-4">
        <h4 className="text-sm font-bold text-[var(--foreground)] mb-1 line-clamp-2">
          {hotel.hotelName}
        </h4>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-semibold text-[var(--color-primary-600)]">
            ¥{hotel.hotelMinCharge.toLocaleString()}〜/泊
          </span>
          {hotel.reviewAverage !== null && (
            <span className="text-xs text-[var(--color-neutral-700)]">
              ★ {hotel.reviewAverage.toFixed(1)}
            </span>
          )}
        </div>

        {hotel.access && (
          <p className="text-xs text-[var(--color-neutral-700)] mb-3 line-clamp-2">
            {hotel.access}
          </p>
        )}

        <a
          href={hotel.hotelInformationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-1.5 text-xs font-medium border border-[var(--color-primary-600)] text-[var(--color-primary-600)] rounded-lg hover:bg-[var(--color-primary-50)] transition-colors"
        >
          詳細・予約
        </a>
      </div>
    </article>
  );
}
