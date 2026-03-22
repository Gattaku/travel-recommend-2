/**
 * 目的地名（Claude生成）から楽天トラベル SimpleHotelSearch の largeClassCode へのマッピング
 */

const AREA_CODE_MAP: { keywords: string[]; code: string }[] = [
  {
    keywords: ['北海道', '知床', '札幌', '函館', '富良野', '小樽', '旭川', '釧路', '帯広'],
    code: 'hokkaido',
  },
  {
    keywords: ['東北', '青森', '秋田', '岩手', '盛岡', '宮城', '仙台', '山形', '福島'],
    code: 'tohoku',
  },
  {
    keywords: ['関東', '東京', '横浜', '神奈川', '千葉', '埼玉', '茨城', '栃木', '群馬', '日光', '鎌倉', '箱根'],
    code: 'kanto',
  },
  {
    keywords: ['甲信越', '山梨', '長野', '新潟', '富士山', '白馬', '軽井沢', '上高地'],
    code: 'koshinetsu',
  },
  {
    keywords: ['北陸', '富山', '石川', '金沢', '福井', '能登'],
    code: 'hokuriku',
  },
  {
    keywords: ['東海', '静岡', '愛知', '名古屋', '岐阜', '三重', '伊勢', '浜松'],
    code: 'tokai',
  },
  {
    keywords: ['近畿', '関西', '大阪', '京都', '兵庫', '神戸', '奈良', '和歌山', '滋賀', '淡路'],
    code: 'kinki',
  },
  {
    keywords: ['中国', '広島', '岡山', '山口', '島根', '鳥取', '出雲'],
    code: 'chugoku',
  },
  {
    keywords: ['四国', '愛媛', '香川', '高知', '徳島', '松山'],
    code: 'shikoku',
  },
  {
    keywords: ['九州', '福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '由布院', 'ゆふいん', '阿蘇'],
    code: 'kyushu',
  },
  {
    keywords: ['沖縄', '石垣', '宮古', '那覇'],
    code: 'okinawa',
  },
];

/**
 * 目的地名からエリアコードを推定する。
 * 判別できない場合は null を返す。
 */
export function getAreaCode(destinationName: string): string | null {
  for (const { keywords, code } of AREA_CODE_MAP) {
    if (keywords.some((kw) => destinationName.includes(kw))) {
      return code;
    }
  }
  return null;
}

export const AREA_CODE_OPTIONS = [
  { label: '北海道', value: 'hokkaido' },
  { label: '東北', value: 'tohoku' },
  { label: '関東', value: 'kanto' },
  { label: '甲信越', value: 'koshinetsu' },
  { label: '北陸', value: 'hokuriku' },
  { label: '東海', value: 'tokai' },
  { label: '近畿（関西）', value: 'kinki' },
  { label: '中国', value: 'chugoku' },
  { label: '四国', value: 'shikoku' },
  { label: '九州', value: 'kyushu' },
  { label: '沖縄', value: 'okinawa' },
] as const;
