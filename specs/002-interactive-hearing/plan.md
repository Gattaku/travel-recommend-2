# Implementation Plan: インタラクティブ・ヒアリング機能

**Branch**: `002-interactive-hearing` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-interactive-hearing/spec.md`

## Summary

既存の基本条件入力フローに加えて、家族の趣味・旅行の方向性・子供の好みなどを
段階的にヒアリングするインタラクティブな質問フローを追加する。
ヒアリング回答は Claude へのプロンプトに追加セクションとして組み込まれ、より精度の高い提案を生成する。
回答した好み情報は Supabase に永続化され、次回以降に自動プリセットされる。

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**:
- Next.js 15 (App Router) -- 既存
- Supabase JS v2 (`@supabase/ssr`, `@supabase/supabase-js`) -- 既存
- Anthropic SDK (`@anthropic-ai/sdk`) -- 既存、プロンプト拡張
- React Hook Form + Zod -- 既存、ヒアリングフォームで再利用
- Tailwind CSS -- 既存

**Storage**: Supabase PostgreSQL（RLS 有効）-- hearing_profiles テーブル追加
**Testing**: Jest + React Testing Library（ユニット）
**Target Platform**: Web（PC/スマートフォン対応）
**Project Type**: Web アプリケーション（フルスタック Next.js） -- 既存プロジェクトへの機能追加
**Performance Goals**: ヒアリング含む提案表示 40 秒以内（SC-001）、ヒアリング所要時間 2 分以内（SC-003）
**Constraints**: Claude API コスト最小化（プロンプト長増加を最小限に）
**Scale/Scope**: 既存ユーザーベースへの追加機能

## Constitution Check

| 原則 | チェック | 備考 |
|------|---------|------|
| I. User Experience First | PASS | ヒアリングはオプション、スキップ可能、2分以内完了を SC に明記 |
| II. Recommendation Quality | PASS | ヒアリング回答で提案精度向上。情報不足時は基本条件フォールバック |
| III. Test-First | PASS | ヒアリングロジック・プロンプト構築のユニットテストを先行配置 |
| IV. Design Token Consistency | PASS | 既存デザイントークンを使用、新規トークン不要 |
| V. Simplicity | PASS | 質問は静的定義、管理画面なし。動的質問はP3でインクリメンタル対応 |

## Phase 0: Research

### ヒアリング質問設計

- **Decision**: ヒアリング質問は静的な定数配列として TypeScript で定義する
- **Rationale**: 管理画面不要、コード変更で質問を追加・変更可能。YAGNI原則に沿う
- **Alternatives**: DB管理（過剰）、CMS連携（スコープ外）

### プロンプト拡張方式

- **Decision**: ヒアリング回答を自然言語テキストとして既存プロンプトに追加セクションとして挿入する
- **Rationale**: Claude は自然言語理解が得意であり、構造化フィルタより柔軟な提案が可能
- **Alternatives**: 構造化パラメータ（柔軟性不足）、別API呼び出し（コスト増）

### 好みプロフィール永続化

- **Decision**: Supabase に `hearing_profiles` テーブルを追加し、JSONB で好み情報を保存
- **Rationale**: 既存の Supabase インフラを活用。RLS で行レベルセキュリティ適用
- **Alternatives**: localStorage のみ（デバイス間同期不可）、別DBサービス（過剰）

### 一時保存方式

- **Decision**: ヒアリング途中の回答は localStorage に保存する
- **Rationale**: ブラウザ再アクセス時の復元のみが目的であり、サーバー保存は過剰
- **Alternatives**: Supabase に draft テーブル（過剰）、SessionStorage（タブ閉じで消失）

## Project Structure

### Documentation (this feature)

```text
specs/002-interactive-hearing/
├── plan.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api-hearing-profile.md
└── tasks.md
```

### Source Code (新規・変更ファイル)

```text
src/
├── components/
│   └── hearing/
│       ├── HearingFlow.tsx           # ヒアリングフロー全体のコンテナ
│       ├── HearingQuestion.tsx       # 個別質問カード
│       ├── HearingProgress.tsx       # 進捗表示バー
│       └── HearingProfileEditor.tsx  # 保存済みプロフィール編集
├── lib/
│   ├── hearing/
│   │   ├── questions.ts             # 質問定義（静的データ）
│   │   ├── filterQuestions.ts       # 条件に基づく質問フィルタリング
│   │   └── buildHearingPrompt.ts    # ヒアリング回答 -> プロンプトテキスト変換
│   ├── claude/
│   │   └── propose.ts              # 既存 -- プロンプトにヒアリングセクション追加
│   └── supabase/
│       └── typed.ts                # 既存 -- hearing_profiles 型追加
├── types/
│   └── index.ts                    # 既存 -- ヒアリング関連型追加
└── app/
    ├── (protected)/
    │   └── propose/
    │       └── page.tsx            # 既存 -- ヒアリングフロー統合
    └── api/
        └── hearing-profile/
            └── route.ts            # 好みプロフィール CRUD エンドポイント

supabase/migrations/
└── 002_hearing_profiles.sql        # hearing_profiles テーブル

tests/
└── unit/
    ├── lib/hearing/
    │   ├── questions.test.ts
    │   ├── filterQuestions.test.ts
    │   └── buildHearingPrompt.test.ts
    └── components/hearing/
        └── HearingFlow.test.ts
```

**Structure Decision**: 既存プロジェクト構造に `hearing/` ディレクトリを追加。
コンポーネント・ライブラリ・APIの3層に分離し、既存コードへの影響を最小化。

## Phase 1: Data Model

### hearing_profiles テーブル

```sql
CREATE TABLE IF NOT EXISTS public.hearing_profiles (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences  JSONB       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- preferences JSONB 構造:
-- {
--   "hobbies": ["fishing", "hiking", "photography"],
--   "travelPriorities": ["scenery", "food", "relaxation"],
--   "childInterests": ["insects", "animals", "water-play"],
--   "transportPreference": "car",
--   "foodPreferences": ["local-cuisine", "allergy-free"],
--   "customNotes": "フリーテキストメモ"
-- }

CREATE UNIQUE INDEX idx_hearing_profiles_user_id ON public.hearing_profiles(user_id);

ALTER TABLE public.hearing_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hearing_profiles: owner read"
  ON public.hearing_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "hearing_profiles: owner insert"
  ON public.hearing_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hearing_profiles: owner update"
  ON public.hearing_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hearing_profiles: owner delete"
  ON public.hearing_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER trg_hearing_profiles_updated_at
  BEFORE UPDATE ON public.hearing_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

## Complexity Tracking

| 要素 | 理由 | シンプルな代替が不十分な理由 |
|------|------|---------------------------|
| ヒアリング質問の動的フィルタリング (P3) | 家族構成によって不要な質問を除外 | 全質問表示では幼児なし家族にベビーカー質問が出るなど UX 低下 |
