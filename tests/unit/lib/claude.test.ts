/**
 * Unit tests for src/lib/claude/propose.ts
 *
 * TDD: These tests are written BEFORE implementation and should initially FAIL.
 * Run with: npx jest tests/unit/lib/claude.test.ts
 */

import { propose } from '@/src/lib/claude/propose';
import type { FamilyProfile, TripCondition, Destination } from '@/src/types';

// ---------------------------------------------------------------------------
// Mock Anthropic SDK
// ---------------------------------------------------------------------------

const mockMessagesCreate = jest.fn();

jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    messages: {
      create: mockMessagesCreate,
    },
  })),
}));

beforeEach(() => {
  mockMessagesCreate.mockReset();
});

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const validProfile: FamilyProfile = {
  adultCount: 2,
  childrenAges: [5, 8],
};

const validCondition: TripCondition = {
  season: 'summer',
  budget: 100000,
  style: 'nature',
  area: 'domestic',
};

const mockDestinations: Destination[] = [
  {
    name: '北海道・富良野',
    overview: '広大なラベンダー畑と雄大な自然が広がる夏の人気スポット。',
    highlights: ['ファーム富田', '白金青い池', '旭山動物園'],
    estimatedBudget: '8〜12万円（4人）',
    tips: '夏は混雑するため早めの予約を推奨',
  },
  {
    name: '長野・白馬',
    overview: '北アルプスを望む高原リゾート。夏でも涼しい。',
    highlights: ['白馬八方尾根', '栂池自然園', 'アドベンチャーパーク'],
    estimatedBudget: '7〜10万円（4人）',
    tips: '標高が高いため薄手の上着を持参',
  },
  {
    name: '沖縄・石垣島',
    overview: '透明度抜群の海と亜熱帯の自然。子供連れに人気。',
    highlights: ['川平湾', '石垣島鍾乳洞', 'シュノーケリング'],
    estimatedBudget: '12〜18万円（4人）',
    tips: '夏は台風シーズン。旅行保険への加入を推奨',
  },
];

function mockClaudeSuccess(destinations: Destination[] = mockDestinations) {
  mockMessagesCreate.mockResolvedValueOnce({
    content: [
      {
        type: 'text',
        text: JSON.stringify({ destinations }),
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('propose()', () => {
  it('正常系: 3件以上の旅行先候補を返す', async () => {
    mockClaudeSuccess();

    const result = await propose(validProfile, validCondition);

    expect(result.destinations).toHaveLength(3);
    expect(result.destinations[0]).toMatchObject({
      name: expect.any(String),
      overview: expect.any(String),
      highlights: expect.any(Array),
      estimatedBudget: expect.any(String),
      tips: expect.any(String),
    });
  });

  it('正常系: highlights が配列で返る', async () => {
    mockClaudeSuccess();

    const result = await propose(validProfile, validCondition);
    result.destinations.forEach((d) => {
      expect(Array.isArray(d.highlights)).toBe(true);
    });
  });

  it('タイムアウト: AbortError が投げられると TIMEOUT エラーをスローする', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    mockMessagesCreate.mockRejectedValueOnce(abortError);

    await expect(propose(validProfile, validCondition)).rejects.toMatchObject({
      code: 'TIMEOUT',
    });
  });

  it('不正入力: adultCount が 0 のときバリデーションエラーをスローする', async () => {
    const badProfile: FamilyProfile = { adultCount: 0, childrenAges: [] };
    await expect(propose(badProfile, validCondition)).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
    });
  });

  it('不正入力: budget が負のときバリデーションエラーをスローする', async () => {
    const badCondition: TripCondition = { ...validCondition, budget: -1 };
    await expect(propose(validProfile, badCondition)).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
    });
  });

  it('不正入力: season が無効な値のときバリデーションエラーをスローする', async () => {
    // @ts-expect-error intentional bad value
    const badCondition: TripCondition = { ...validCondition, season: 'monsoon' };
    await expect(propose(validProfile, badCondition)).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
    });
  });

  it('Claude がレスポンスに destinations を含まない場合はエラーをスローする', async () => {
    mockMessagesCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify({ wrong: 'data' }) }],
    });

    await expect(propose(validProfile, validCondition)).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });
});
