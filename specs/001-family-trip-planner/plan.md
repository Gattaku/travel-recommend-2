# Implementation Plan: 家族旅行プランナー（提案・保存・しおり作成）

**Branch**: `001-family-trip-planner` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-family-trip-planner/spec.md`

## Summary

家族構成・旅行条件を入力すると Claude AI が旅行先を提案し、保存・比較・決定後に旅のしおりを
自動生成する Web アプリ。Next.js App Router + Supabase (Auth/DB) + 楽天トラベルAPI を組み合わせ、
Vercel にデプロイする。

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**:
- Next.js 15 (App Router)
- Supabase JS v2 (`@supabase/ssr`, `@supabase/supabase-js`)
- Anthropic SDK (`@anthropic-ai/sdk`) — Claude による旅行提案生成
- 楽天トラベルAPI — ホテル検索（REST、applicationId 認証）
- Tailwind CSS — スタイリング（Specify デザイントークン連携）
- React Hook Form + Zod — フォームバリデーション

**Storage**: Supabase PostgreSQL（RLS 有効）
**Testing**: Jest + React Testing Library（ユニット）、Playwright（E2E）
**Target Platform**: Web（PC/スマートフォン対応）、Vercel デプロイ
**Project Type**: Web アプリケーション（フルスタック Next.js）
**Performance Goals**: 旅行提案表示 30 秒以内、しおり生成 10 秒以内（SC-001/003）
**Constraints**: 楽天トラベルAPI 無料枠制限内、Claude API コスト最小化
**Scale/Scope**: 個人〜家族単位利用、初期フェーズは数十〜数百ユーザー想定

## Constitution Check

| 原則 | チェック | 備考 |
|------|---------|------|
| I. User Experience First | ✅ | 3タップ保存・30秒以内提案を SC に明記 |
| II. Recommendation Quality | ✅ | Claude 提案＋楽天API 実データの組み合わせ |
| III. Test-First | ✅ | 各フェーズにテストタスクを先行配置 |
| IV. Design Token Consistency | ✅ | Tailwind config を Specify トークンから生成 |
| V. Simplicity | ✅ | MVP は楽天トラベル単一API、共有機能は対象外 |

## Phase 0: Research — 技術的意思決定記録

### 楽天トラベルAPI

- **ベースURL**: `https://app.rakuten.co.jp/services/api/Travel/`
- **使用エンドポイント**:
  - `SimpleHotelSearch/20170426` — 条件指定ホテル検索
  - `GetAreaClass/20131024` — エリアコードマスタ取得
- **認証**: クエリパラメータ `applicationId=<APIキー>` + `format=json`
- **主要検索パラメータ**: `largeClassCode`（都道府県）、`checkinDate`、`checkoutDate`、
  `adultNum`、`upClassNum`（子供人数）、`maxCharge`（上限金額）
- **レスポンス主要フィールド**: `hotelName`、`hotelInformationUrl`、`hotelImageUrl`、
  `hotelMinCharge`、`reviewAverage`、`access`

### Claude API による旅行提案生成

- Server Action 内で `@anthropic-ai/sdk` を使用
- プロンプト: 家族構成・条件 → 旅行先候補 3〜5 件を構造化 JSON で返す
- レスポンス形式: `{ destinations: [{ name, overview, highlights, estimatedBudget, tips }] }`
- ストリーミングは使わず完全レスポンス待ち（30 秒タイムアウト）

### Supabase Auth + Google OIDC

- Supabase Dashboard: Authentication > Providers > Google で Client ID/Secret 設定
- `@supabase/ssr` を使用: `createServerClient`（Server Component/Route Handler）、
  `createBrowserClient`（Client Component）
- OAuth コールバックルート: `app/auth/callback/route.ts`
- Next.js Middleware でセッションリフレッシュ＋保護ルート制御

### MVP 後の候補 API

| API | 用途 | 備考 |
|-----|------|------|
| じゃらんAPI（リクルート） | 宿泊施設検索 | 要申請、楽天と類似 |
| Google Places API | 観光スポット検索 | $200/月無料枠あり |
| OpenWeather API | 旅行時期の気候参考 | 無料枠で十分 |

## Project Structure

### Documentation (this feature)

```text
specs/001-family-trip-planner/
├── plan.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── api-proposal.md
│   ├── api-saved.md
│   └── api-itinerary.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx            # Google ログインページ
│   ├── auth/callback/route.ts        # OAuth コールバック
│   ├── (protected)/
│   │   ├── layout.tsx                # 認証ガード layout
│   │   ├── dashboard/page.tsx        # 保存済み提案一覧
│   │   ├── propose/page.tsx          # 旅行条件入力・提案表示
│   │   ├── saved/[id]/page.tsx       # 保存済み提案詳細
│   │   └── itinerary/
│   │       ├── [id]/page.tsx         # しおり表示・編集
│   │       └── [id]/print/page.tsx   # 印刷用しおり
│   └── api/
│       ├── propose/route.ts          # Claude 提案生成エンドポイント
│       └── hotels/route.ts           # 楽天トラベル検索プロキシ
├── components/
│   ├── proposal/
│   │   ├── ProposalForm.tsx
│   │   ├── ProposalCard.tsx
│   │   └── ProposalList.tsx
│   ├── saved/
│   │   ├── SavedList.tsx
│   │   └── SavedCard.tsx
│   └── itinerary/
│       ├── ItineraryEditor.tsx
│       └── ItineraryPrint.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # createBrowserClient
│   │   ├── server.ts                 # createServerClient
│   │   └── middleware.ts
│   ├── claude/propose.ts             # Claude 提案生成ロジック
│   └── rakuten/hotels.ts             # 楽天トラベルAPI クライアント
├── types/index.ts
└── middleware.ts

supabase/migrations/
└── 001_initial_schema.sql

tests/
├── unit/
│   ├── lib/claude.test.ts
│   ├── lib/rakuten.test.ts
│   └── components/
└── e2e/
    ├── propose.spec.ts
    ├── save.spec.ts
    └── itinerary.spec.ts
```

**Structure Decision**: Next.js App Router の Route Groups を活用。
`(auth)` は未認証向け、`(protected)` は認証必須ページ。
API Route はサードパーティ API キーを隠蔽するプロキシとして機能。

## Phase 1: Data Model

### Supabase テーブル設計

```sql
-- 家族プロフィール（auth.users の拡張）
CREATE TABLE family_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  adult_count INT NOT NULL DEFAULT 2,
  children_ages INT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 旅行提案セット（Claude が生成）
CREATE TABLE trip_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  condition JSONB NOT NULL,     -- { season, budget, style, area }
  destinations JSONB NOT NULL,  -- Claude レスポンスのスナップショット
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 保存済み提案（ユーザーが選んだ単一旅行先）
CREATE TABLE saved_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES trip_proposals(id) ON DELETE SET NULL,
  destination JSONB NOT NULL,  -- 保存時点のスナップショット
  memo TEXT DEFAULT '',
  is_decided BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 旅のしおり
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_proposal_id UUID REFERENCES saved_proposals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  travel_dates JSONB,          -- { start: date, end: date }
  schedule JSONB DEFAULT '[]', -- [{ date, spots: [{ name, memo }] }]
  accommodation JSONB DEFAULT '{}',
  packing_list JSONB DEFAULT '[]', -- [{ item, checked }]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: 全テーブル user_id = auth.uid() で行レベルセキュリティ適用
```

## Complexity Tracking

| 要素 | 理由 | シンプルな代替が不十分な理由 |
|------|------|---------------------------|
| Claude API + 楽天API の 2 系統外部連携 | 提案の質（AI）と実データ（ホテル）を両立 | どちらか一方ではユーザー価値が半減する |
| Supabase Auth + Google OIDC | セキュリティと利便性のバランス | メール認証のみでは離脱率が高い |
