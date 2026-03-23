/**
 * 楽天トラベル SimpleHotelSearch クライアント
 * API docs: https://webservice.rakuten.co.jp/documentation/simple-hotel-search
 */

const RAKUTEN_API_BASE = 'https://app.rakuten.co.jp/services/api/Travel';
const SIMPLE_HOTEL_SEARCH = `${RAKUTEN_API_BASE}/SimpleHotelSearch/20170426`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HotelSearchParams {
  /** 都道府県コード (例: "hokkaido") */
  largeClassCode: string;
  /** チェックイン日 YYYY-MM-DD */
  checkinDate: string;
  /** チェックアウト日 YYYY-MM-DD */
  checkoutDate: string;
  /** 大人人数 */
  adultNum: number;
  /** 子供人数（未就学児含む） */
  upClassNum?: number;
  /** 1室あたりの上限金額（円） */
  maxCharge?: number;
  /** 取得件数（デフォルト 10, 最大 30） */
  hits?: number;
}

export interface HotelResult {
  hotelName: string;
  hotelInformationUrl: string;
  hotelImageUrl: string | null;
  hotelMinCharge: number;
  reviewAverage: number | null;
  access: string;
}

export interface HotelSearchResult {
  hotels: HotelResult[];
  totalCount: number;
}

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

export class RakutenApiError extends Error {
  constructor(
    message: string,
    public readonly code: 'NO_RESULTS' | 'AUTH_ERROR' | 'NETWORK_ERROR' | 'API_ERROR',
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'RakutenApiError';
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export async function searchHotels(
  params: HotelSearchParams,
): Promise<HotelSearchResult> {
  const applicationId = process.env.RAKUTEN_APPLICATION_ID?.trim();
  if (!applicationId) {
    throw new RakutenApiError(
      'RAKUTEN_APPLICATION_ID が設定されていません',
      'AUTH_ERROR',
    );
  }

  const searchParams = new URLSearchParams({
    applicationId,
    format: 'json',
    largeClassCode: 'japan',
    middleClassCode: params.largeClassCode,
    checkinDate: params.checkinDate,
    checkoutDate: params.checkoutDate,
    adultNum: String(params.adultNum),
    hits: String(params.hits ?? 10),
  });

  if (params.upClassNum !== undefined) {
    searchParams.set('upClassNum', String(params.upClassNum));
  }
  if (params.maxCharge !== undefined) {
    searchParams.set('maxCharge', String(params.maxCharge));
  }

  const url = `${SIMPLE_HOTEL_SEARCH}?${searchParams.toString()}`;
  console.error('[RakutenAPI] applicationId length:', applicationId.length, 'prefix:', applicationId.slice(0, 4), 'url:', url.replace(applicationId, applicationId.slice(0, 4) + '***'));

  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate: 300 }, // 5 分キャッシュ
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new RakutenApiError(`ネットワークエラー: ${msg}`, 'NETWORK_ERROR');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body.error_description ?? body.error ?? JSON.stringify(body);
    } catch {
      // レスポンスボディの読み取りに失敗しても無視
    }
    throw new RakutenApiError(
      `楽天トラベルAPI エラー: HTTP ${response.status}${detail ? ` - ${detail}` : ''}`,
      'API_ERROR',
      response.status,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await response.json();

  if (data.error) {
    if (data.error === 'not_found') {
      return { hotels: [], totalCount: 0 };
    }
    throw new RakutenApiError(
      `楽天トラベルAPI エラー: ${data.error_description ?? data.error}`,
      'API_ERROR',
    );
  }

  const rawHotels: HotelResult[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data.hotels ?? []).map((entry: any) => {
      const h = entry.hotel?.[0]?.hotelBasicInfo ?? {};
      return {
        hotelName: h.hotelName ?? '',
        hotelInformationUrl: h.hotelInformationUrl ?? '',
        hotelImageUrl: h.hotelImageUrl ?? null,
        hotelMinCharge: h.hotelMinCharge ?? 0,
        reviewAverage: h.reviewAverage ?? null,
        access: h.access ?? '',
      };
    });

  return {
    hotels: rawHotels,
    totalCount: data.pagingInfo?.recordCount ?? rawHotels.length,
  };
}
