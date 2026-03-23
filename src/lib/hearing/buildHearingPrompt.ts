import type { HearingAnswer, TripCondition } from '@/src/types';
import { HEARING_QUESTIONS } from './questions';

// ---------------------------------------------------------------------------
// ヒアリング回答からプロンプトテキストを構築する
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 矛盾検出
// ---------------------------------------------------------------------------

interface Contradiction {
  message: string;
}

/**
 * ヒアリング回答と旅行条件の矛盾を検出する。
 */
export function detectContradictions(
  answers: HearingAnswer[],
  condition?: TripCondition,
): Contradiction[] {
  const contradictions: Contradiction[] = [];

  if (!condition) return contradictions;

  const validAnswers = answers.filter((a) => !a.skipped);

  // 海外希望なのに車移動を選択
  const transportAnswer = validAnswers.find((a) => a.questionId === 'transport');
  if (
    condition.area === 'overseas' &&
    transportAnswer?.selectedOptions.includes('car')
  ) {
    contradictions.push({
      message: '海外旅行で「車移動」を希望されていますが、レンタカーの手配が必要になる場合があります。',
    });
  }

  // 低予算で海外リゾート
  if (
    condition.area === 'overseas' &&
    condition.budget < 50000 &&
    condition.style === 'resort'
  ) {
    contradictions.push({
      message: `予算${condition.budget.toLocaleString()}円で海外リゾートは難しい場合があります。予算の見直しまたは国内のリゾートも検討してみてください。`,
    });
  }

  // 冬に川遊び・海水浴を希望
  const childAnswer = validAnswers.find((a) => a.questionId === 'child-interests');
  if (
    condition.season === 'winter' &&
    childAnswer?.selectedOptions.includes('water-play')
  ) {
    contradictions.push({
      message: '冬の時期に「川遊び・海水浴」を希望されていますが、屋内プールやスパなどの代替を提案します。',
    });
  }

  return contradictions;
}

// ---------------------------------------------------------------------------
// プロンプト構築
// ---------------------------------------------------------------------------

/**
 * ヒアリング回答の配列を受け取り、Claude プロンプトに追加する
 * 自然言語テキストセクションを返す。
 *
 * 回答がない場合（全スキップ、空配列）は空文字列を返す。
 * condition を渡すと矛盾検出も行い、注意事項としてプロンプトに含める。
 */
export function buildHearingPrompt(
  answers: HearingAnswer[],
  condition?: TripCondition,
): string {
  if (!answers || answers.length === 0) {
    return '';
  }

  // スキップされていない有効な回答のみ
  const validAnswers = answers.filter((a) => !a.skipped);

  if (validAnswers.length === 0) {
    return '';
  }

  const lines: string[] = [];
  lines.push('## 家族のヒアリング情報（追加情報）');
  lines.push('以下は家族から得た追加情報です。この情報を踏まえて、より家族にマッチした旅行先を提案してください。');
  lines.push('');

  for (const answer of validAnswers) {
    const question = HEARING_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const label = question.questionText;

    if (answer.freeText) {
      lines.push(`- ${label}: ${answer.freeText}`);
    } else if (answer.selectedOptions.length > 0) {
      // 選択肢IDをラベルに変換
      const optionLabels = answer.selectedOptions
        .map((optId) => {
          const opt = question.options?.find((o) => o.id === optId);
          return opt?.label ?? optId;
        })
        .join('、');
      lines.push(`- ${label}: ${optionLabels}`);
    }
  }

  // 矛盾検出（condition が渡された場合）
  if (condition) {
    const contradictions = detectContradictions(answers, condition);
    if (contradictions.length > 0) {
      lines.push('');
      lines.push('## 注意事項');
      lines.push('以下の点にも留意して提案してください:');
      for (const c of contradictions) {
        lines.push(`- ${c.message}`);
      }
    }
  }

  return lines.join('\n');
}
