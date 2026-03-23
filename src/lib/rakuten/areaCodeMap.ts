/**
 * 楽天トラベル SimpleHotelSearch 用エリアコードマッピング
 *
 * 新API (openapi.rakuten.co.jp) では largeClassCode + middleClassCode + smallClassCode の
 * 3階層すべてが必須。middleClassCode = 都道府県、smallClassCode = エリア。
 */

export interface AreaCode {
  middleClassCode: string;
  smallClassCode: string;
}

// ---------------------------------------------------------------------------
// 都道府県ごとのサブエリア一覧
// ---------------------------------------------------------------------------

export interface SubArea {
  label: string;
  smallClassCode: string;
}

export interface PrefectureArea {
  label: string;
  middleClassCode: string;
  region: string;
  subAreas: SubArea[];
}

export const PREFECTURE_AREAS: PrefectureArea[] = [
  // ── 北海道 ──
  {
    label: '北海道', middleClassCode: 'hokkaido', region: '北海道',
    subAreas: [
      { label: '札幌', smallClassCode: 'sapporo' },
      { label: '定山渓', smallClassCode: 'jozankei' },
      { label: '函館・大沼・松前', smallClassCode: 'hakodate' },
      { label: '旭川・層雲峡', smallClassCode: 'asahikawa' },
      { label: '小樽・キロロ・積丹', smallClassCode: 'otaru' },
      { label: '富良野・美瑛・トマム', smallClassCode: 'furano' },
      { label: '帯広・十勝', smallClassCode: 'obihiro' },
      { label: '釧路・阿寒・川湯・根室', smallClassCode: 'kushiro' },
      { label: '網走・紋別・北見・知床', smallClassCode: 'abashiri' },
      { label: '稚内・留萌・利尻・礼文', smallClassCode: 'wakkanai' },
      { label: 'ニセコ・ルスツ', smallClassCode: 'niseko' },
      { label: '洞爺・登別・苫小牧', smallClassCode: 'toya' },
    ],
  },
  // ── 東北 ──
  {
    label: '青森県', middleClassCode: 'aomori', region: '東北',
    subAreas: [
      { label: '青森・浅虫温泉', smallClassCode: 'aomori' },
      { label: '弘前・黒石', smallClassCode: 'hirosaki' },
      { label: '八戸・三沢', smallClassCode: 'hachinohe' },
      { label: '十和田湖・奥入瀬', smallClassCode: 'towada' },
    ],
  },
  {
    label: '岩手県', middleClassCode: 'iwate', region: '東北',
    subAreas: [
      { label: '盛岡', smallClassCode: 'morioka' },
      { label: '花巻・北上・遠野', smallClassCode: 'hanamaki' },
      { label: '平泉・一関', smallClassCode: 'hiraizumi' },
    ],
  },
  {
    label: '宮城県', middleClassCode: 'miyagi', region: '東北',
    subAreas: [
      { label: '仙台', smallClassCode: 'sendai' },
      { label: '松島・塩釜', smallClassCode: 'matsushima' },
      { label: '鳴子・大崎', smallClassCode: 'naruko' },
    ],
  },
  {
    label: '秋田県', middleClassCode: 'akita', region: '東北',
    subAreas: [
      { label: '秋田', smallClassCode: 'akita' },
      { label: '田沢湖・角館', smallClassCode: 'tazawa' },
      { label: '横手・湯沢', smallClassCode: 'yokote' },
    ],
  },
  {
    label: '山形県', middleClassCode: 'yamagata', region: '東北',
    subAreas: [
      { label: '山形・蔵王・天童', smallClassCode: 'yamagata' },
      { label: '米沢', smallClassCode: 'yonezawa' },
      { label: '酒田・鶴岡', smallClassCode: 'sakata' },
    ],
  },
  {
    label: '福島県', middleClassCode: 'fukushima', region: '東北',
    subAreas: [
      { label: '福島・飯坂温泉', smallClassCode: 'fukushima' },
      { label: '郡山・磐梯熱海', smallClassCode: 'koriyama' },
      { label: '会津若松・喜多方', smallClassCode: 'aizu' },
      { label: '猪苗代・表磐梯', smallClassCode: 'inawashiro' },
    ],
  },
  // ── 関東 ──
  {
    label: '東京都', middleClassCode: 'tokyo', region: '関東',
    subAreas: [
      { label: '新宿・中野・杉並', smallClassCode: 'shinjuku' },
      { label: '渋谷・目黒・世田谷', smallClassCode: 'shibuya' },
      { label: '上野・浅草・両国', smallClassCode: 'ueno' },
      { label: '品川・大田・蒲田', smallClassCode: 'shinagawa' },
      { label: '池袋・赤羽・板橋', smallClassCode: 'ikebukuro' },
      { label: '銀座・日本橋・東京駅周辺', smallClassCode: 'ginza' },
      { label: 'お台場・汐留・新橋', smallClassCode: 'odaiba' },
      { label: '六本木・麻布・赤坂', smallClassCode: 'roppongi' },
    ],
  },
  {
    label: '神奈川県', middleClassCode: 'kanagawa', region: '関東',
    subAreas: [
      { label: '横浜', smallClassCode: 'yokohama' },
      { label: '箱根', smallClassCode: 'hakone' },
      { label: '鎌倉・湘南', smallClassCode: 'kamakura' },
      { label: '川崎', smallClassCode: 'kawasaki' },
    ],
  },
  {
    label: '千葉県', middleClassCode: 'chiba', region: '関東',
    subAreas: [
      { label: '舞浜・浦安・船橋', smallClassCode: 'maihama' },
      { label: '千葉・市原', smallClassCode: 'chiba' },
      { label: '成田', smallClassCode: 'narita' },
      { label: '館山・南房総', smallClassCode: 'tateyama' },
    ],
  },
  {
    label: '埼玉県', middleClassCode: 'saitama', region: '関東',
    subAreas: [
      { label: 'さいたま', smallClassCode: 'saitama' },
      { label: '川越・所沢', smallClassCode: 'kawagoe' },
      { label: '秩父・長瀞', smallClassCode: 'chichibu' },
    ],
  },
  {
    label: '茨城県', middleClassCode: 'ibaraki', region: '関東',
    subAreas: [
      { label: '水戸・笠間', smallClassCode: 'mito' },
      { label: 'つくば', smallClassCode: 'tsukuba' },
    ],
  },
  {
    label: '栃木県', middleClassCode: 'tochigi', region: '関東',
    subAreas: [
      { label: '日光・鬼怒川', smallClassCode: 'nikko' },
      { label: '那須・塩原', smallClassCode: 'nasu' },
      { label: '宇都宮', smallClassCode: 'utsunomiya' },
    ],
  },
  {
    label: '群馬県', middleClassCode: 'gunma', region: '関東',
    subAreas: [
      { label: '草津・万座・嬬恋', smallClassCode: 'kusatsu' },
      { label: '伊香保・渋川', smallClassCode: 'ikaho' },
      { label: '前橋・高崎', smallClassCode: 'maebashi' },
    ],
  },
  // ── 甲信越 ──
  {
    label: '山梨県', middleClassCode: 'yamanashi', region: '甲信越',
    subAreas: [
      { label: '甲府・湯村', smallClassCode: 'kofu' },
      { label: '河口湖・富士吉田', smallClassCode: 'kawaguchiko' },
      { label: '石和・勝沼', smallClassCode: 'isawa' },
    ],
  },
  {
    label: '長野県', middleClassCode: 'nagano', region: '甲信越',
    subAreas: [
      { label: '長野・戸隠・小布施', smallClassCode: 'nagano' },
      { label: '軽井沢・佐久', smallClassCode: 'karuizawa' },
      { label: '松本・浅間・塩尻', smallClassCode: 'matsumoto' },
      { label: '上高地・乗鞍・白骨', smallClassCode: 'kamikochi' },
      { label: '白馬・大町', smallClassCode: 'hakuba' },
      { label: '蓼科・白樺湖・車山', smallClassCode: 'tateshina' },
    ],
  },
  {
    label: '新潟県', middleClassCode: 'niigata', region: '甲信越',
    subAreas: [
      { label: '新潟', smallClassCode: 'niigata' },
      { label: '越後湯沢・苗場', smallClassCode: 'yuzawa' },
      { label: '佐渡', smallClassCode: 'sado' },
    ],
  },
  // ── 北陸 ──
  {
    label: '富山県', middleClassCode: 'toyama', region: '北陸',
    subAreas: [
      { label: '富山', smallClassCode: 'toyama' },
      { label: '黒部・宇奈月', smallClassCode: 'kurobe' },
      { label: '高岡・氷見', smallClassCode: 'takaoka' },
    ],
  },
  {
    label: '石川県', middleClassCode: 'ishikawa', region: '北陸',
    subAreas: [
      { label: '金沢', smallClassCode: 'kanazawa' },
      { label: '加賀・小松・辰口', smallClassCode: 'kaga' },
      { label: '和倉・七尾・能登', smallClassCode: 'wajima' },
    ],
  },
  {
    label: '福井県', middleClassCode: 'fukui', region: '北陸',
    subAreas: [
      { label: '福井・あわら', smallClassCode: 'fukui' },
      { label: '敦賀・若狭', smallClassCode: 'tsuruga' },
    ],
  },
  // ── 東海 ──
  {
    label: '静岡県', middleClassCode: 'shizuoka', region: '東海',
    subAreas: [
      { label: '静岡・清水', smallClassCode: 'shizuoka' },
      { label: '熱海', smallClassCode: 'atami' },
      { label: '伊豆', smallClassCode: 'izu' },
      { label: '浜松・浜名湖', smallClassCode: 'hamamatsu' },
    ],
  },
  {
    label: '愛知県', middleClassCode: 'aichi', region: '東海',
    subAreas: [
      { label: '名古屋', smallClassCode: 'nagoya' },
      { label: '三河', smallClassCode: 'mikawa' },
      { label: '知多', smallClassCode: 'chita' },
    ],
  },
  {
    label: '岐阜県', middleClassCode: 'gifu', region: '東海',
    subAreas: [
      { label: '岐阜・大垣', smallClassCode: 'gifu' },
      { label: '下呂・南飛騨', smallClassCode: 'gero' },
      { label: '高山・飛騨', smallClassCode: 'takayama' },
    ],
  },
  {
    label: '三重県', middleClassCode: 'mie', region: '東海',
    subAreas: [
      { label: '津・松阪', smallClassCode: 'tsu' },
      { label: '伊勢・二見', smallClassCode: 'ise' },
      { label: '鳥羽', smallClassCode: 'toba' },
    ],
  },
  // ── 近畿（関西） ──
  {
    label: '大阪府', middleClassCode: 'osaka', region: '近畿',
    subAreas: [
      { label: '大阪梅田・中之島', smallClassCode: 'umeda' },
      { label: '心斎橋・なんば・天王寺', smallClassCode: 'namba' },
      { label: '新大阪・江坂・十三', smallClassCode: 'shinosaka' },
      { label: 'ベイエリア・USJ', smallClassCode: 'bay' },
    ],
  },
  {
    label: '京都府', middleClassCode: 'kyoto', region: '近畿',
    subAreas: [
      { label: '京都市内', smallClassCode: 'shi' },
      { label: '嵐山・嵯峨野', smallClassCode: 'arashiyama' },
      { label: '天橋立・宮津', smallClassCode: 'amanohashidate' },
    ],
  },
  {
    label: '兵庫県', middleClassCode: 'hyogo', region: '近畿',
    subAreas: [
      { label: '神戸・有馬', smallClassCode: 'kobe' },
      { label: '姫路・赤穂', smallClassCode: 'himeji' },
      { label: '城崎', smallClassCode: 'kinosaki' },
      { label: '淡路島', smallClassCode: 'awaji' },
    ],
  },
  {
    label: '奈良県', middleClassCode: 'nara', region: '近畿',
    subAreas: [
      { label: '奈良市内', smallClassCode: 'nara' },
      { label: '吉野・天川', smallClassCode: 'yoshino' },
    ],
  },
  {
    label: '滋賀県', middleClassCode: 'shiga', region: '近畿',
    subAreas: [
      { label: '大津・雄琴', smallClassCode: 'otsu' },
      { label: '長浜・彦根', smallClassCode: 'nagahama' },
    ],
  },
  {
    label: '和歌山県', middleClassCode: 'wakayama', region: '近畿',
    subAreas: [
      { label: '白浜・田辺', smallClassCode: 'shirahama' },
      { label: '和歌山市・紀の川', smallClassCode: 'wakayama' },
      { label: '那智勝浦・串本', smallClassCode: 'katsuura' },
    ],
  },
  // ── 中国 ──
  {
    label: '広島県', middleClassCode: 'hiroshima', region: '中国',
    subAreas: [
      { label: '広島', smallClassCode: 'hiroshima' },
      { label: '宮島・廿日市', smallClassCode: 'miyajima' },
      { label: '尾道・福山', smallClassCode: 'onomichi' },
    ],
  },
  {
    label: '岡山県', middleClassCode: 'okayama', region: '中国',
    subAreas: [
      { label: '岡山・玉野', smallClassCode: 'okayama' },
      { label: '倉敷・総社', smallClassCode: 'kurashiki' },
    ],
  },
  {
    label: '山口県', middleClassCode: 'yamaguchi', region: '中国',
    subAreas: [
      { label: '下関・宇部', smallClassCode: 'shimonoseki' },
      { label: '萩・長門', smallClassCode: 'hagi' },
    ],
  },
  {
    label: '島根県', middleClassCode: 'shimane', region: '中国',
    subAreas: [
      { label: '出雲・大田', smallClassCode: 'izumo' },
      { label: '松江・玉造', smallClassCode: 'matsue' },
    ],
  },
  {
    label: '鳥取県', middleClassCode: 'tottori', region: '中国',
    subAreas: [
      { label: '鳥取・岩美', smallClassCode: 'tottori' },
      { label: '米子・皆生・境港', smallClassCode: 'yonago' },
    ],
  },
  // ── 四国 ──
  {
    label: '愛媛県', middleClassCode: 'ehime', region: '四国',
    subAreas: [
      { label: '松山・道後', smallClassCode: 'matsuyama' },
      { label: '今治・しまなみ海道', smallClassCode: 'imabari' },
    ],
  },
  {
    label: '香川県', middleClassCode: 'kagawa', region: '四国',
    subAreas: [
      { label: '高松・さぬき', smallClassCode: 'takamatsu' },
      { label: '琴平・善通寺', smallClassCode: 'kotohira' },
    ],
  },
  {
    label: '高知県', middleClassCode: 'kochi', region: '四国',
    subAreas: [
      { label: '高知', smallClassCode: 'kochi' },
      { label: '四万十・足摺', smallClassCode: 'shimanto' },
    ],
  },
  {
    label: '徳島県', middleClassCode: 'tokushima', region: '四国',
    subAreas: [
      { label: '徳島・鳴門', smallClassCode: 'tokushima' },
      { label: '祖谷・大歩危', smallClassCode: 'iya' },
    ],
  },
  // ── 九州 ──
  {
    label: '福岡県', middleClassCode: 'fukuoka', region: '九州',
    subAreas: [
      { label: '博多・天神', smallClassCode: 'hakata' },
      { label: '北九州・小倉', smallClassCode: 'kitakyushu' },
    ],
  },
  {
    label: '佐賀県', middleClassCode: 'saga', region: '九州',
    subAreas: [
      { label: '佐賀・嬉野', smallClassCode: 'saga' },
      { label: '唐津・呼子', smallClassCode: 'karatsu' },
    ],
  },
  {
    label: '長崎県', middleClassCode: 'nagasaki', region: '九州',
    subAreas: [
      { label: '長崎', smallClassCode: 'nagasaki' },
      { label: 'ハウステンボス・佐世保', smallClassCode: 'sasebo' },
    ],
  },
  {
    label: '熊本県', middleClassCode: 'kumamoto', region: '九州',
    subAreas: [
      { label: '熊本', smallClassCode: 'kumamoto' },
      { label: '阿蘇', smallClassCode: 'aso' },
      { label: '黒川・杖立', smallClassCode: 'kurokawa' },
    ],
  },
  {
    label: '大分県', middleClassCode: 'oita', region: '九州',
    subAreas: [
      { label: '別府', smallClassCode: 'beppu' },
      { label: '由布院', smallClassCode: 'yufuin' },
      { label: '大分', smallClassCode: 'oita' },
    ],
  },
  {
    label: '宮崎県', middleClassCode: 'miyazaki', region: '九州',
    subAreas: [
      { label: '宮崎・青島', smallClassCode: 'miyazaki' },
      { label: '高千穂', smallClassCode: 'takachiho' },
    ],
  },
  {
    label: '鹿児島県', middleClassCode: 'kagoshima', region: '九州',
    subAreas: [
      { label: '鹿児島・桜島', smallClassCode: 'kagoshima' },
      { label: '指宿・枕崎', smallClassCode: 'ibusuki' },
      { label: '屋久島', smallClassCode: 'yakushima' },
    ],
  },
  // ── 沖縄 ──
  {
    label: '沖縄県', middleClassCode: 'okinawa', region: '沖縄',
    subAreas: [
      { label: '那覇', smallClassCode: 'nahashi' },
      { label: '恩納・北谷・読谷', smallClassCode: 'onna' },
      { label: '名護・本部・国頭', smallClassCode: 'nago' },
      { label: '宮古島', smallClassCode: 'miyako' },
      { label: '石垣島・西表島', smallClassCode: 'ishigaki' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 目的地名 → エリアコード自動推定
// ---------------------------------------------------------------------------

interface KeywordMapping {
  keywords: string[];
  middleClassCode: string;
  smallClassCode: string;
}

const KEYWORD_MAP: KeywordMapping[] = [
  // 北海道
  { keywords: ['札幌'], middleClassCode: 'hokkaido', smallClassCode: 'sapporo' },
  { keywords: ['函館'], middleClassCode: 'hokkaido', smallClassCode: 'hakodate' },
  { keywords: ['富良野', '美瑛'], middleClassCode: 'hokkaido', smallClassCode: 'furano' },
  { keywords: ['小樽'], middleClassCode: 'hokkaido', smallClassCode: 'otaru' },
  { keywords: ['旭川'], middleClassCode: 'hokkaido', smallClassCode: 'asahikawa' },
  { keywords: ['釧路'], middleClassCode: 'hokkaido', smallClassCode: 'kushiro' },
  { keywords: ['帯広', '十勝'], middleClassCode: 'hokkaido', smallClassCode: 'obihiro' },
  { keywords: ['知床', '網走'], middleClassCode: 'hokkaido', smallClassCode: 'abashiri' },
  { keywords: ['ニセコ', 'ルスツ'], middleClassCode: 'hokkaido', smallClassCode: 'niseko' },
  { keywords: ['北海道'], middleClassCode: 'hokkaido', smallClassCode: 'sapporo' },
  // 東北
  { keywords: ['仙台'], middleClassCode: 'miyagi', smallClassCode: 'sendai' },
  { keywords: ['松島'], middleClassCode: 'miyagi', smallClassCode: 'matsushima' },
  { keywords: ['盛岡'], middleClassCode: 'iwate', smallClassCode: 'morioka' },
  { keywords: ['平泉'], middleClassCode: 'iwate', smallClassCode: 'hiraizumi' },
  { keywords: ['青森'], middleClassCode: 'aomori', smallClassCode: 'aomori' },
  { keywords: ['秋田', '田沢湖', '角館'], middleClassCode: 'akita', smallClassCode: 'tazawa' },
  { keywords: ['山形', '蔵王'], middleClassCode: 'yamagata', smallClassCode: 'yamagata' },
  { keywords: ['福島', '会津'], middleClassCode: 'fukushima', smallClassCode: 'aizu' },
  { keywords: ['東北'], middleClassCode: 'miyagi', smallClassCode: 'sendai' },
  // 関東
  { keywords: ['東京'], middleClassCode: 'tokyo', smallClassCode: 'shinjuku' },
  { keywords: ['横浜'], middleClassCode: 'kanagawa', smallClassCode: 'yokohama' },
  { keywords: ['箱根'], middleClassCode: 'kanagawa', smallClassCode: 'hakone' },
  { keywords: ['鎌倉', '湘南'], middleClassCode: 'kanagawa', smallClassCode: 'kamakura' },
  { keywords: ['日光', '鬼怒川'], middleClassCode: 'tochigi', smallClassCode: 'nikko' },
  { keywords: ['那須'], middleClassCode: 'tochigi', smallClassCode: 'nasu' },
  { keywords: ['千葉', '舞浜'], middleClassCode: 'chiba', smallClassCode: 'maihama' },
  { keywords: ['草津'], middleClassCode: 'gunma', smallClassCode: 'kusatsu' },
  { keywords: ['伊香保'], middleClassCode: 'gunma', smallClassCode: 'ikaho' },
  { keywords: ['関東'], middleClassCode: 'tokyo', smallClassCode: 'shinjuku' },
  // 甲信越
  { keywords: ['軽井沢'], middleClassCode: 'nagano', smallClassCode: 'karuizawa' },
  { keywords: ['上高地', '乗鞍'], middleClassCode: 'nagano', smallClassCode: 'kamikochi' },
  { keywords: ['白馬'], middleClassCode: 'nagano', smallClassCode: 'hakuba' },
  { keywords: ['松本'], middleClassCode: 'nagano', smallClassCode: 'matsumoto' },
  { keywords: ['長野'], middleClassCode: 'nagano', smallClassCode: 'nagano' },
  { keywords: ['富士山', '河口湖'], middleClassCode: 'yamanashi', smallClassCode: 'kawaguchiko' },
  { keywords: ['山梨', '甲府'], middleClassCode: 'yamanashi', smallClassCode: 'kofu' },
  { keywords: ['新潟'], middleClassCode: 'niigata', smallClassCode: 'niigata' },
  { keywords: ['越後湯沢'], middleClassCode: 'niigata', smallClassCode: 'yuzawa' },
  { keywords: ['甲信越'], middleClassCode: 'nagano', smallClassCode: 'nagano' },
  // 北陸
  { keywords: ['金沢'], middleClassCode: 'ishikawa', smallClassCode: 'kanazawa' },
  { keywords: ['能登', '和倉'], middleClassCode: 'ishikawa', smallClassCode: 'wajima' },
  { keywords: ['富山', '黒部'], middleClassCode: 'toyama', smallClassCode: 'toyama' },
  { keywords: ['福井'], middleClassCode: 'fukui', smallClassCode: 'fukui' },
  { keywords: ['北陸'], middleClassCode: 'ishikawa', smallClassCode: 'kanazawa' },
  // 東海
  { keywords: ['名古屋'], middleClassCode: 'aichi', smallClassCode: 'nagoya' },
  { keywords: ['熱海'], middleClassCode: 'shizuoka', smallClassCode: 'atami' },
  { keywords: ['伊豆'], middleClassCode: 'shizuoka', smallClassCode: 'izu' },
  { keywords: ['浜松'], middleClassCode: 'shizuoka', smallClassCode: 'hamamatsu' },
  { keywords: ['静岡'], middleClassCode: 'shizuoka', smallClassCode: 'shizuoka' },
  { keywords: ['下呂'], middleClassCode: 'gifu', smallClassCode: 'gero' },
  { keywords: ['高山', '飛騨'], middleClassCode: 'gifu', smallClassCode: 'takayama' },
  { keywords: ['岐阜'], middleClassCode: 'gifu', smallClassCode: 'gifu' },
  { keywords: ['伊勢', '鳥羽'], middleClassCode: 'mie', smallClassCode: 'ise' },
  { keywords: ['三重'], middleClassCode: 'mie', smallClassCode: 'tsu' },
  { keywords: ['東海'], middleClassCode: 'aichi', smallClassCode: 'nagoya' },
  // 近畿
  { keywords: ['大阪'], middleClassCode: 'osaka', smallClassCode: 'namba' },
  { keywords: ['京都'], middleClassCode: 'kyoto', smallClassCode: 'shi' },
  { keywords: ['神戸'], middleClassCode: 'hyogo', smallClassCode: 'kobe' },
  { keywords: ['城崎'], middleClassCode: 'hyogo', smallClassCode: 'kinosaki' },
  { keywords: ['淡路'], middleClassCode: 'hyogo', smallClassCode: 'awaji' },
  { keywords: ['姫路'], middleClassCode: 'hyogo', smallClassCode: 'himeji' },
  { keywords: ['奈良'], middleClassCode: 'nara', smallClassCode: 'nara' },
  { keywords: ['和歌山', '白浜'], middleClassCode: 'wakayama', smallClassCode: 'shirahama' },
  { keywords: ['滋賀'], middleClassCode: 'shiga', smallClassCode: 'otsu' },
  { keywords: ['近畿', '関西'], middleClassCode: 'osaka', smallClassCode: 'namba' },
  // 中国
  { keywords: ['広島'], middleClassCode: 'hiroshima', smallClassCode: 'hiroshima' },
  { keywords: ['宮島'], middleClassCode: 'hiroshima', smallClassCode: 'miyajima' },
  { keywords: ['岡山', '倉敷'], middleClassCode: 'okayama', smallClassCode: 'okayama' },
  { keywords: ['出雲'], middleClassCode: 'shimane', smallClassCode: 'izumo' },
  { keywords: ['島根', '松江'], middleClassCode: 'shimane', smallClassCode: 'matsue' },
  { keywords: ['山口'], middleClassCode: 'yamaguchi', smallClassCode: 'shimonoseki' },
  { keywords: ['鳥取'], middleClassCode: 'tottori', smallClassCode: 'tottori' },
  { keywords: ['中国地方'], middleClassCode: 'hiroshima', smallClassCode: 'hiroshima' },
  // 四国
  { keywords: ['松山', '道後'], middleClassCode: 'ehime', smallClassCode: 'matsuyama' },
  { keywords: ['愛媛'], middleClassCode: 'ehime', smallClassCode: 'matsuyama' },
  { keywords: ['高松'], middleClassCode: 'kagawa', smallClassCode: 'takamatsu' },
  { keywords: ['香川'], middleClassCode: 'kagawa', smallClassCode: 'takamatsu' },
  { keywords: ['高知'], middleClassCode: 'kochi', smallClassCode: 'kochi' },
  { keywords: ['徳島'], middleClassCode: 'tokushima', smallClassCode: 'tokushima' },
  { keywords: ['四国'], middleClassCode: 'kagawa', smallClassCode: 'takamatsu' },
  // 九州
  { keywords: ['福岡', '博多'], middleClassCode: 'fukuoka', smallClassCode: 'hakata' },
  { keywords: ['長崎', 'ハウステンボス'], middleClassCode: 'nagasaki', smallClassCode: 'nagasaki' },
  { keywords: ['熊本'], middleClassCode: 'kumamoto', smallClassCode: 'kumamoto' },
  { keywords: ['阿蘇'], middleClassCode: 'kumamoto', smallClassCode: 'aso' },
  { keywords: ['由布院', 'ゆふいん'], middleClassCode: 'oita', smallClassCode: 'yufuin' },
  { keywords: ['別府'], middleClassCode: 'oita', smallClassCode: 'beppu' },
  { keywords: ['大分'], middleClassCode: 'oita', smallClassCode: 'oita' },
  { keywords: ['鹿児島', '桜島'], middleClassCode: 'kagoshima', smallClassCode: 'kagoshima' },
  { keywords: ['屋久島'], middleClassCode: 'kagoshima', smallClassCode: 'yakushima' },
  { keywords: ['宮崎'], middleClassCode: 'miyazaki', smallClassCode: 'miyazaki' },
  { keywords: ['佐賀'], middleClassCode: 'saga', smallClassCode: 'saga' },
  { keywords: ['九州'], middleClassCode: 'fukuoka', smallClassCode: 'hakata' },
  // 沖縄
  { keywords: ['那覇'], middleClassCode: 'okinawa', smallClassCode: 'nahashi' },
  { keywords: ['石垣'], middleClassCode: 'okinawa', smallClassCode: 'ishigaki' },
  { keywords: ['宮古'], middleClassCode: 'okinawa', smallClassCode: 'miyako' },
  { keywords: ['沖縄'], middleClassCode: 'okinawa', smallClassCode: 'nahashi' },
];

/**
 * 目的地名からエリアコードを推定する。
 * 判別できない場合は null を返す。
 */
export function getAreaCode(destinationName: string): AreaCode | null {
  for (const { keywords, middleClassCode, smallClassCode } of KEYWORD_MAP) {
    if (keywords.some((kw) => destinationName.includes(kw))) {
      return { middleClassCode, smallClassCode };
    }
  }
  return null;
}
