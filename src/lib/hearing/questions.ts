import type { HearingQuestion } from '@/src/types';

// ---------------------------------------------------------------------------
// ヒアリング質問定義（静的データ）
// ---------------------------------------------------------------------------
// 質問の追加・変更はこのファイルを編集する。DB管理は不要（YAGNI）。
// condition が null の質問は常に表示される。
// condition が設定された質問は filterQuestions.ts でフィルタされる。
// ---------------------------------------------------------------------------

export const HEARING_QUESTIONS: HearingQuestion[] = [
  // ─── カテゴリ: 家族の趣味・興味 ───
  {
    id: 'hobbies',
    category: 'hobbies',
    questionText: '家族の趣味や興味を教えてください（複数選択可）',
    answerType: 'multi-select',
    icon: 'palette',
    options: [
      { id: 'fishing', label: '釣り' },
      { id: 'hiking', label: 'ハイキング・登山' },
      { id: 'photography', label: '写真撮影' },
      { id: 'camping', label: 'キャンプ' },
      { id: 'sports', label: 'スポーツ・アクティビティ' },
      { id: 'art-museums', label: '美術館・博物館' },
      { id: 'shopping', label: 'ショッピング' },
      { id: 'hot-springs', label: '温泉' },
      { id: 'gourmet', label: 'グルメ・食べ歩き' },
      { id: 'history', label: '歴史・神社仏閣' },
    ],
    condition: null,
  },

  // ─── カテゴリ: 旅行で重視すること ───
  {
    id: 'priorities',
    category: 'priorities',
    questionText: '旅行で特に重視することは何ですか？（最大3つ）',
    answerType: 'multi-select',
    icon: 'star',
    options: [
      { id: 'scenery', label: '景色・絶景' },
      { id: 'food', label: '食事・グルメ' },
      { id: 'relaxation', label: 'のんびり・癒し' },
      { id: 'adventure', label: '冒険・体験' },
      { id: 'learning', label: '学び・教育' },
      { id: 'instagram', label: 'フォトジェニック' },
      { id: 'local-culture', label: '地元の文化に触れる' },
      { id: 'convenience', label: 'アクセスの良さ' },
    ],
    condition: null,
  },

  // ─── カテゴリ: 子供が喜ぶ体験（子供がいる場合のみ） ───
  {
    id: 'child-interests',
    category: 'child-interests',
    questionText: 'お子さんが喜びそうな体験を教えてください（複数選択可）',
    answerType: 'multi-select',
    icon: 'child',
    options: [
      { id: 'insects', label: '虫取り・昆虫観察' },
      { id: 'animals', label: '動物とのふれあい' },
      { id: 'water-play', label: '川遊び・海水浴' },
      { id: 'theme-park', label: 'テーマパーク・遊園地' },
      { id: 'crafts', label: '工作・手作り体験' },
      { id: 'star-gazing', label: '星空観察' },
      { id: 'snow-play', label: '雪遊び・スキー' },
      { id: 'nature-walk', label: '自然散策・森林浴' },
    ],
    condition: { hasChildren: true },
  },

  // ─── カテゴリ: 移動手段の希望 ───
  {
    id: 'transport',
    category: 'transport',
    questionText: '移動手段の希望を教えてください',
    answerType: 'single-select',
    icon: 'transport',
    options: [
      { id: 'car', label: '車（レンタカー含む）' },
      { id: 'train', label: '電車・新幹線' },
      { id: 'plane', label: '飛行機' },
      { id: 'bus', label: 'バス・ツアー' },
      { id: 'any', label: '特にこだわりなし' },
    ],
    condition: null,
  },

  // ─── カテゴリ: 食事のこだわり ───
  {
    id: 'food',
    category: 'food',
    questionText: '食事に関するこだわりがあれば教えてください（複数選択可）',
    answerType: 'multi-select',
    icon: 'food',
    options: [
      { id: 'local-cuisine', label: 'ご当地グルメを楽しみたい' },
      { id: 'seafood', label: '海鮮・新鮮な魚介' },
      { id: 'bbq', label: 'BBQ・アウトドア料理' },
      { id: 'allergy-free', label: 'アレルギー対応が必要' },
      { id: 'vegetarian', label: 'ベジタリアン対応が必要' },
      { id: 'child-menu', label: '子供向けメニューが充実している場所' },
      { id: 'no-preference', label: '特にこだわりなし' },
    ],
    condition: null,
  },

  // ─── 条件付き質問: 幼児がいる場合 ───
  {
    id: 'infant-needs',
    category: 'child-interests',
    questionText: '小さなお子さん向けの設備で重要なものを教えてください（複数選択可）',
    answerType: 'multi-select',
    icon: 'baby',
    options: [
      { id: 'stroller-ok', label: 'ベビーカーで移動しやすい場所' },
      { id: 'baby-food', label: '離乳食対応のレストラン' },
      { id: 'diaper-room', label: 'オムツ替えスペースがある場所' },
      { id: 'nap-friendly', label: 'お昼寝しやすい宿泊施設' },
      { id: 'short-distance', label: '移動距離が短い場所' },
    ],
    condition: { hasInfant: true },
  },

  // ─── 条件付き質問: 海外旅行の場合 ───
  {
    id: 'overseas-preferences',
    category: 'priorities',
    questionText: '海外旅行について教えてください',
    answerType: 'multi-select',
    icon: 'globe',
    options: [
      { id: 'english-ok', label: '英語圏が安心' },
      { id: 'non-english-ok', label: '非英語圏でも大丈夫' },
      { id: 'short-flight', label: 'フライト時間は短い方がいい（4時間以内）' },
      { id: 'long-flight-ok', label: '長距離フライトでもOK' },
      { id: 'first-overseas', label: '初めての海外旅行' },
      { id: 'visa-free', label: 'ビザなしで行ける国がいい' },
    ],
    condition: { area: 'overseas' },
  },

  // ─── フリーテキスト: その他のリクエスト ───
  {
    id: 'custom-notes',
    category: 'hobbies',
    questionText: 'その他、旅行の希望やリクエストがあれば自由に記入してください',
    answerType: 'free-text',
    icon: 'pen',
    options: null,
    condition: null,
  },
];
