# Quickstart: 家族旅行プランナー

## 前提条件

- Node.js 20+
- Supabase プロジェクト（無料プランで可）
- Google Cloud Console OAuth 2.0 クライアント ID
- 楽天 API アプリ登録（applicationId）
- Anthropic API キー

## 環境変数

`.env.local` を作成：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx

ANTHROPIC_API_KEY=xxxx
RAKUTEN_APPLICATION_ID=xxxx

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## セットアップ手順

```bash
# 1. 依存関係インストール
npm install

# 2. Supabase マイグレーション実行
npx supabase db push

# 3. 開発サーバー起動
npm run dev
```

## Supabase 設定

1. Dashboard > Authentication > Providers > Google を有効化
2. Google Cloud Console から取得した Client ID / Secret を設定
3. Redirect URL を `https://<your-supabase-project>.supabase.co/auth/v1/callback` に設定

## 主要ユーザーフロー検証

```
1. http://localhost:3000 にアクセス → ログインページにリダイレクト
2. Google でログイン → ダッシュボードにリダイレクト
3. 「旅行先を提案する」→ 条件入力 → 提案一覧表示（30秒以内）
4. 提案カードの「保存」→ ダッシュボードに追加される
5. 保存済み提案 > 「この旅行に決めた」→ しおり自動生成
6. しおり編集 → 「印刷する」→ 印刷プレビュー表示
```
