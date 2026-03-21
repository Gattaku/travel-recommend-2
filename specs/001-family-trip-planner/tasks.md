# Tasks: 家族旅行プランナー（提案・保存・しおり作成）

**Input**: `specs/001-family-trip-planner/` の全設計ドキュメント
**Prerequisites**: plan.md ✅, spec.md ✅, contracts/ ✅

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup（共有インフラ）

- [x] T001 Next.js 15 プロジェクトを初期化する（TypeScript、App Router、Tailwind CSS）
- [x] T002 [P] Supabase JS (`@supabase/ssr`, `@supabase/supabase-js`) をインストールする
- [x] T003 [P] Anthropic SDK (`@anthropic-ai/sdk`) をインストールする
- [x] T004 [P] React Hook Form + Zod をインストールする
- [x] T005 [P] Playwright をインストールしてE2E設定を行う（`tests/e2e/`）
- [x] T006 [P] Jest + React Testing Library をインストールしてユニットテスト設定を行う（`tests/unit/`）
- [x] T007 `.env.local.example` を作成する（必要な環境変数を全て記載）
- [x] T008 Specify デザイントークンから Tailwind config (`output/theme.js`) を設定する

---

## Phase 2: Foundational（全ストーリーの前提基盤）

**⚠️ CRITICAL**: このフェーズが完了するまでユーザーストーリーの実装を開始しない

- [x] T009 Supabase マイグレーションファイル `supabase/migrations/001_initial_schema.sql` を作成する（family_profiles, trip_proposals, saved_proposals, itineraries テーブル + RLS ポリシー）
- [x] T010 [P] Supabase クライアントユーティリティを作成する
  - `src/lib/supabase/client.ts`（createBrowserClient）
  - `src/lib/supabase/server.ts`（createServerClient）
- [x] T011 Next.js Middleware を作成する（`src/middleware.ts`）— セッションリフレッシュ＋保護ルート制御
- [x] T012 Google OIDC 認証フローを実装する
  - `src/app/(auth)/login/page.tsx`（Google ログインボタン）
  - `src/app/auth/callback/route.ts`（OAuth コールバック処理）
- [x] T013 保護ルート用 layout を作成する（`src/app/(protected)/layout.tsx`）— 未認証時は `/login` にリダイレクト
- [x] T014 [P] 共通型定義ファイルを作成する（`src/types/index.ts`）— FamilyProfile, TripCondition, TripProposal, SavedProposal, Itinerary

**Checkpoint**: 認証フロー動作確認 → Google ログイン → ダッシュボードへリダイレクト

---

## Phase 3: US1 — 旅行先の提案を受け取る（Priority: P1）🎯 MVP

**Goal**: 家族構成・条件を入力すると旅行先候補3件以上が表示される

**Independent Test**: 条件入力 → 「提案を見る」→ 候補一覧表示までが動作すること

### US1 テスト（実装前に作成・FAIL確認）

- [x] T015 [P] [US1] `tests/unit/lib/claude.test.ts` を作成する — propose 関数のユニットテスト（正常・タイムアウト・不正入力）
- [x] T016 [P] [US1] `tests/e2e/propose.spec.ts` を作成する — 条件入力→提案表示の E2E テスト

### US1 実装

- [x] T017 [US1] Claude 提案生成ロジックを実装する（`src/lib/claude/propose.ts`）
- [x] T018 [US1] 楽天トラベルAPI クライアントを実装する（`src/lib/rakuten/hotels.ts`）
- [x] T019 [US1] 提案生成 API Route を実装する（`src/app/api/propose/route.ts`）— T017 に依存
- [x] T020 [US1] ホテル検索プロキシ API Route を実装する（`src/app/api/hotels/route.ts`）— T018 に依存
- [x] T021 [P] [US1] 条件入力フォームコンポーネントを作成する（`src/components/proposal/ProposalForm.tsx`）
- [x] T022 [P] [US1] 提案カードコンポーネントを作成する（`src/components/proposal/ProposalCard.tsx`）
- [x] T023 [US1] 提案一覧コンポーネントを作成する（`src/components/proposal/ProposalList.tsx`）
- [x] T024 [US1] 提案ページを実装する（`src/app/(protected)/propose/page.tsx`）— T019, T021, T023 に依存
- [x] T025 [US1] ダッシュボードページの骨格を作成する（`src/app/(protected)/dashboard/page.tsx`）

**Checkpoint**: US1 独立検証 — 条件入力 → 提案一覧表示（30秒以内）が動作すること

---

## Phase 4: US2 — 提案を保存・管理する（Priority: P2）

**Goal**: 提案を保存・メモ追加・削除できる

**Independent Test**: 提案を保存 → アプリ再起動後も保存一覧に表示されること

### US2 テスト（実装前に作成・FAIL確認）

- [x] T026 [P] [US2] `tests/e2e/save.spec.ts` を作成する — 保存・メモ・削除の E2E テスト

### US2 実装

- [x] T027 [US2] 保存済み提案 API Routes を実装する（`src/app/api/saved/route.ts`, `src/app/api/saved/[id]/route.ts`）
- [x] T028 [P] [US2] 保存済みカードコンポーネントを作成する（`src/components/saved/SavedCard.tsx`）
- [x] T029 [P] [US2] 保存済み一覧コンポーネントを作成する（`src/components/saved/SavedList.tsx`）
- [x] T030 [US2] 保存済み提案詳細ページを実装する（`src/app/(protected)/saved/[id]/page.tsx`）— T027, T028 に依存
- [x] T031 [US2] ダッシュボードに保存済み一覧を統合する（`src/app/(protected)/dashboard/page.tsx`）— T027, T029 に依存
- [x] T032 [US2] 提案カードに「保存する」ボタンを追加する（`src/components/proposal/ProposalCard.tsx`）— T027 に依存

**Checkpoint**: US2 独立検証 — 提案保存 → 一覧確認 → メモ追加 → 削除が動作すること

---

## Phase 5: US3 — 旅のしおりを作成する（Priority: P3）

**Goal**: 決定した旅行先からしおりを生成・編集・PDF出力できる

**Independent Test**: 「この旅行に決めた」→ しおり生成（10秒以内）→ 編集 → 印刷プレビューが動作すること

### US3 テスト（実装前に作成・FAIL確認）

- [x] T033 [P] [US3] `tests/e2e/itinerary.spec.ts` を作成する — しおり生成・編集・印刷の E2E テスト

### US3 実装

- [x] T034 [US3] しおり API Routes を実装する（`src/app/api/itinerary/route.ts`, `src/app/api/itinerary/[id]/route.ts`）
- [x] T035 [P] [US3] しおりエディタコンポーネントを作成する（`src/components/itinerary/ItineraryEditor.tsx`）
- [x] T036 [P] [US3] 印刷用しおりコンポーネントを作成する（`src/components/itinerary/ItineraryPrint.tsx`）
- [x] T037 [US3] しおりページを実装する（`src/app/(protected)/itinerary/[id]/page.tsx`）— T034, T035 に依存
- [x] T038 [US3] 印刷用ページを実装する（`src/app/(protected)/itinerary/[id]/print/page.tsx`）— T036 に依存
- [x] T039 [US3] 保存済み提案詳細に「この旅行に決めた」ボタンを追加する（`src/app/(protected)/saved/[id]/page.tsx`）— T034 に依存

**Checkpoint**: US3 独立検証 — しおり生成 → 編集 → 印刷プレビューが動作すること

---

## Phase 6: Polish & Cross-Cutting

- [x] T040 [P] エラーハンドリング統一（API タイムアウト・楽天API 0件・Claude エラーの UI 表示）
- [x] T041 [P] ローディング状態の UI を追加する（提案生成中のスピナー等）
- [x] T042 [P] レスポンシブ対応を確認・修正する（モバイル表示）
- [x] T043 Vercel デプロイ設定を行う（環境変数・ビルド確認）
- [x] T044 [P] `quickstart.md` の手順通りに動作するか最終検証する

---

## Dependencies & Execution Order

### フェーズ依存関係

- **Phase 1 (Setup)**: 即時開始可能
- **Phase 2 (Foundational)**: Phase 1 完了後 — 全ユーザーストーリーをブロック
- **Phase 3 (US1)**: Phase 2 完了後
- **Phase 4 (US2)**: Phase 2 完了後（US1 と並行可能だが US1 完了後が推奨）
- **Phase 5 (US3)**: Phase 2 完了後（US2 の保存機能に依存するため US2 後）
- **Phase 6 (Polish)**: 全ユーザーストーリー完了後

### 各ストーリー内の依存関係

- テスト → 失敗確認 → 実装の順を厳守（Constitution III 原則）
- モデル/ユーティリティ → API Route → コンポーネント → ページ の順
