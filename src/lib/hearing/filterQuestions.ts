import type { HearingQuestion, FamilyProfile, TripCondition } from '@/src/types';

// ---------------------------------------------------------------------------
// 質問フィルタリング
// ---------------------------------------------------------------------------
// 家族構成（子供の有無・幼児の有無）とエリア（国内/海外）に基づいて
// 表示する質問をフィルタリングする。
// ---------------------------------------------------------------------------

/**
 * 家族構成とエリア条件に基づいて、表示すべき質問のみを返す。
 */
export function filterQuestions(
  questions: HearingQuestion[],
  profile: FamilyProfile,
  condition: TripCondition,
): HearingQuestion[] {
  const hasChildren = profile.childrenAges.length > 0;
  const hasInfant = profile.childrenAges.some((age) => age <= 2);

  return questions.filter((q) => {
    // 条件なし → 常に表示
    if (!q.condition) return true;

    // 子供がいるかチェック
    if (q.condition.hasChildren !== undefined) {
      if (q.condition.hasChildren !== hasChildren) return false;
    }

    // 幼児がいるかチェック
    if (q.condition.hasInfant !== undefined) {
      if (q.condition.hasInfant !== hasInfant) return false;
    }

    // エリアチェック
    if (q.condition.area !== undefined) {
      if (q.condition.area !== condition.area) return false;
    }

    return true;
  });
}
