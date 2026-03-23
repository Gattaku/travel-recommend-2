# Tasks: インタラクティブ・ヒアリング機能

**Input**: Design documents from `/specs/002-interactive-hearing/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/api-hearing-profile.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: ヒアリング機能に必要な型定義・DB スキーマ・ディレクトリ構造の準備

- [x] T001 ヒアリング関連の型定義を追加する in src/types/index.ts (HearingQuestion, HearingAnswer, HearingPreferences, HearingProfile 型)
- [x] T002 [P] hearing_profiles テーブルのマイグレーションファイルを作成する in supabase/migrations/002_hearing_profiles.sql
- [x] T003 [P] Supabase 型定義に hearing_profiles テーブルの型を追加する in src/lib/supabase/typed.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 全ユーザーストーリーが依存するヒアリング質問データと共通ロジック

- [x] T004 ヒアリング質問の静的データ定義を作成する in src/lib/hearing/questions.ts (全カテゴリ: hobbies, priorities, child-interests, transport, food)
- [x] T005 ヒアリング回答からプロンプトテキストを構築する関数を作成する in src/lib/hearing/buildHearingPrompt.ts
- [x] T006 既存の propose.ts にヒアリング回答を受け取るオプション引数を追加し、プロンプトにヒアリングセクションを挿入する in src/lib/claude/propose.ts

**Checkpoint**: 質問データとプロンプト構築ロジックが揃い、ユーザーストーリー実装に進める

---

## Phase 3: User Story 1 - ヒアリングを通じたパーソナライズ提案 (Priority: P1) MVP

**Goal**: 基本条件入力後にヒアリング質問に回答し、回答を反映した精度の高い提案を受け取れる

**Independent Test**: 基本条件入力 -> 「もっと詳しく教える」-> ヒアリング回答 -> 提案表示でヒアリング内容が反映されている

### Implementation for User Story 1

- [x] T007 [P] [US1] ヒアリング進捗バーコンポーネントを作成する in src/components/hearing/HearingProgress.tsx
- [x] T008 [P] [US1] 個別質問カードコンポーネントを作成する in src/components/hearing/HearingQuestion.tsx (選択肢の複数選択・単一選択・フリーテキスト対応)
- [x] T009 [US1] ヒアリングフロー全体のコンテナコンポーネントを作成する in src/components/hearing/HearingFlow.tsx (質問ステップ遷移・スキップ・回答収集・localStorage一時保存)
- [x] T010 [US1] 既存の ProposalForm に「もっと詳しく教える」ボタンを追加する in src/components/proposal/ProposalForm.tsx
- [x] T011 [US1] 提案ページにヒアリングフローを統合する in app/(protected)/propose/page.tsx (フロー状態管理: 基本条件入力 -> ヒアリング -> 提案表示、「もっと絞り込む」ボタン追加)
- [x] T012 [US1] /api/propose エンドポイントにヒアリング回答パラメータを追加する in app/api/propose/route.ts (既存リクエストに hearingAnswers オプションフィールドを追加)

**Checkpoint**: ヒアリングを通じた提案フローが E2E で動作する。スキップ時は既存フローと同一の動作。

---

## Phase 4: User Story 2 - ヒアリング内容の保存と再利用 (Priority: P2)

**Goal**: ヒアリング回答を好みプロフィールとして保存し、次回以降に自動プリセットされる

**Independent Test**: ヒアリング回答後に再度提案ページにアクセスすると、前回の回答がプリセットされている

### Implementation for User Story 2

- [x] T013 [P] [US2] hearing-profile API エンドポイントを作成する in app/api/hearing-profile/route.ts (GET/PUT/DELETE、Supabase RLS 経由の CRUD)
- [x] T014 [US2] HearingFlow コンポーネントに保存済みプロフィール読み込みとプリセット機能を追加する in src/components/hearing/HearingFlow.tsx
- [x] T015 [US2] ヒアリング完了時に好みプロフィールを自動保存するロジックを追加する in src/components/hearing/HearingFlow.tsx
- [x] T016 [P] [US2] 好みプロフィール編集コンポーネントを作成する in src/components/hearing/HearingProfileEditor.tsx
- [x] T017 [US2] 「今回だけ違う条件で探す」オプションを HearingFlow に追加する in src/components/hearing/HearingFlow.tsx

**Checkpoint**: 保存・プリセット・編集・一時無視がすべて動作する

---

## Phase 5: User Story 3 - ヒアリング質問のカスタマイズ (Priority: P3)

**Goal**: 家族構成やエリアに応じて表示される質問が動的に変わる

**Independent Test**: 幼児がいる家族構成でベビーカー質問が出る、海外選択でフライト時間質問が出る

### Implementation for User Story 3

- [x] T018 [US3] 質問フィルタリング関数を作成する in src/lib/hearing/filterQuestions.ts (家族構成・エリアに基づく条件フィルタ)
- [x] T019 [US3] questions.ts に条件付き質問を追加する in src/lib/hearing/questions.ts (幼児向け: ベビーカー・離乳食、海外向け: 言語・フライト時間、大人のみ向けの除外条件)
- [x] T020 [US3] HearingFlow コンポーネントに質問フィルタリングを統合する in src/components/hearing/HearingFlow.tsx (filterQuestions を呼び出して表示質問を決定)

**Checkpoint**: 条件に応じた質問表示が動作する

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 全ストーリーにまたがる品質改善

- [x] T021 [P] ヒアリング回答の矛盾検出ロジックを追加する (予算と希望の矛盾チェック、ユーザーへの条件見直し提案)
- [x] T022 ヒアリング関連コンポーネントのアクセシビリティを検証・改善する (WCAG 2.1 AA: キーボード操作、aria-label、フォーカス管理)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001 (型定義) completion
- **US1 (Phase 3)**: Depends on Phase 2 completion (質問データ + プロンプト構築)
- **US2 (Phase 4)**: Depends on Phase 3 completion (HearingFlow が存在する前提)
- **US3 (Phase 5)**: Depends on Phase 2 completion (質問データが存在する前提)、Phase 3 の HearingFlow が存在
- **Polish (Phase 6)**: Depends on all user stories

### User Story Dependencies

- **US1 (P1)**: Phase 2 完了後すぐに開始可能
- **US2 (P2)**: US1 で HearingFlow.tsx が作成された後に拡張
- **US3 (P3)**: US1 で HearingFlow.tsx が作成された後に拡張。US2 と並行可能だが US1 必須

### Within Each User Story

- コンポーネント作成 -> 統合 -> ページ更新
- [P] マーク付きタスクは並行実行可能

### Parallel Opportunities

- T002, T003 は T001 と並行可能
- T007, T008 は並行作成可能
- T013, T016 は並行作成可能

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup (T001-T003) -- 型定義とDB
2. Phase 2: Foundational (T004-T006) -- 質問データとプロンプト
3. Phase 3: US1 (T007-T012) -- ヒアリングフローと提案統合
4. VALIDATE: ヒアリングを通じた提案が動作することを確認

### Incremental Delivery

1. Setup + Foundational -> 基盤完了
2. US1 -> ヒアリング提案が動作 (MVP)
3. US2 -> プロフィール保存・再利用が動作
4. US3 -> 動的質問が動作
5. Polish -> 矛盾検出・アクセシビリティ改善

---

## Notes

- 既存の ProposalForm / propose.ts / route.ts は変更するが、既存フローを壊さないよう後方互換性を維持する
- ヒアリング回答は localStorage で一時保存し、Supabase にはプロフィールとしてのみ永続化する
- 質問定義は TypeScript の定数として管理し、DB は使用しない (YAGNI)
