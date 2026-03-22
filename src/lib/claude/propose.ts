import Anthropic from '@anthropic-ai/sdk';
import type {
  FamilyProfile,
  TripCondition,
  Destination,
  ProposeResponse,
} from '@/src/types';

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

export class ProposeError extends Error {
  constructor(
    message: string,
    public readonly code: 'VALIDATION_ERROR' | 'TIMEOUT' | 'INVALID_RESPONSE' | 'API_ERROR',
  ) {
    super(message);
    this.name = 'ProposeError';
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;
const VALID_STYLES = ['nature', 'culture', 'resort', 'onsen', 'city'] as const;
const VALID_AREAS = ['domestic', 'overseas'] as const;

function validate(profile: FamilyProfile, condition: TripCondition): void {
  if (!profile.adultCount || profile.adultCount < 1) {
    throw new ProposeError('adultCount は 1 以上の整数が必要です', 'VALIDATION_ERROR');
  }
  if (condition.budget < 0) {
    throw new ProposeError('budget は 0 以上の数値が必要です', 'VALIDATION_ERROR');
  }
  if (!(VALID_SEASONS as readonly string[]).includes(condition.season)) {
    throw new ProposeError(`season は ${VALID_SEASONS.join(' / ')} のいずれかです`, 'VALIDATION_ERROR');
  }
  if (!(VALID_STYLES as readonly string[]).includes(condition.style)) {
    throw new ProposeError(`style は ${VALID_STYLES.join(' / ')} のいずれかです`, 'VALIDATION_ERROR');
  }
  if (!(VALID_AREAS as readonly string[]).includes(condition.area)) {
    throw new ProposeError(`area は ${VALID_AREAS.join(' / ')} のいずれかです`, 'VALIDATION_ERROR');
  }
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

const SEASON_LABELS: Record<TripCondition['season'], string> = {
  spring: '春（3〜5月）',
  summer: '夏（6〜8月）',
  autumn: '秋（9〜11月）',
  winter: '冬（12〜2月）',
};

const STYLE_LABELS: Record<TripCondition['style'], string> = {
  nature: '自然体験',
  culture: '文化・歴史',
  resort: 'リゾート',
  onsen: '温泉・のんびり',
  city: '都市観光',
};

function buildPrompt(profile: FamilyProfile, condition: TripCondition): string {
  const childrenDesc =
    profile.childrenAges.length > 0
      ? `子供 ${profile.childrenAges.length} 名（年齢: ${profile.childrenAges.join(', ')} 歳）`
      : '子供なし';

  return `あなたは家族旅行のプロフェッショナルなアドバイザーです。
以下の家族構成と希望条件に合った旅行先を 3〜5 件提案してください。

## 家族構成
- 大人: ${profile.adultCount} 名
- ${childrenDesc}

## 旅行条件
- 時期: ${SEASON_LABELS[condition.season]}
- 総予算: ${condition.budget.toLocaleString('ja-JP')} 円
- スタイル: ${STYLE_LABELS[condition.style]}
- エリア: ${condition.area === 'domestic' ? '国内' : '海外'}

## 出力形式
以下の JSON のみを返してください（コードブロック不要）:
{
  "destinations": [
    {
      "name": "旅行先名",
      "overview": "概要（2〜3文）",
      "highlights": ["見どころ1", "見どころ2", "見どころ3"],
      "estimatedBudget": "費用目安（例: 8〜12万円（4人））",
      "tips": "おすすめポイント・注意事項"
    }
  ]
}

## 注意
- 提案は実在する場所のみ
- 費用目安は家族全員分の概算
- highlights は 2〜4 件
- 条件に最もマッチする順に並べること
- JSON 以外のテキストを含めないこと`;
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

const TIMEOUT_MS = 28_000; // 28 秒（SC-001: 30 秒以内）

export async function propose(
  profile: FamilyProfile,
  condition: TripCondition,
): Promise<ProposeResponse> {
  validate(profile, condition);

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let rawText: string;

  try {
    const message = await client.messages.create(
      {
        // model: 'claude-opus-4-6',
        // model: 'claude-sonnet-4-6',
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: buildPrompt(profile, condition),
          },
        ],
      },
      { signal: controller.signal },
    );

    rawText =
      message.content[0]?.type === 'text' ? message.content[0].text : '';
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      (err.name === 'AbortError' || err.message.includes('aborted'))
    ) {
      throw new ProposeError('提案の生成がタイムアウトしました', 'TIMEOUT');
    }
    const msg = err instanceof Error ? err.message : String(err);
    throw new ProposeError(`Claude API エラー: ${msg}`, 'API_ERROR');
  } finally {
    clearTimeout(timer);
  }

  // Parse JSON response
  let parsed: { destinations?: Destination[] };
  try {
    // Strip optional markdown code fences
    const json = rawText.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    parsed = JSON.parse(json);
  } catch {
    throw new ProposeError(
      `Claude のレスポンスが JSON として解析できませんでした: ${rawText.slice(0, 200)}`,
      'INVALID_RESPONSE',
    );
  }

  if (!Array.isArray(parsed.destinations) || parsed.destinations.length === 0) {
    throw new ProposeError(
      'Claude のレスポンスに destinations が含まれていません',
      'INVALID_RESPONSE',
    );
  }

  return {
    proposalId: crypto.randomUUID(),
    destinations: parsed.destinations,
  };
}
