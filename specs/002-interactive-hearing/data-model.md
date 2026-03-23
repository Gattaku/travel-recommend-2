# Data Model: インタラクティブ・ヒアリング機能

## Entities

### HearingQuestion (静的定義、DB不要)

ヒアリングで表示される質問データ。TypeScript の定数配列として定義する。

| Field | Type | Description |
|-------|------|-------------|
| id | string | 質問の一意識別子 (例: "hobbies", "travel-priorities") |
| category | string | カテゴリ (hobbies / priorities / child-interests / transport / food) |
| questionText | string | 質問文（日本語） |
| answerType | "multi-select" or "single-select" or "free-text" | 回答形式 |
| options | Option[] or null | 選択肢の配列（free-text の場合 null） |
| condition | QuestionCondition or null | 表示条件（null = 常に表示） |

### QuestionCondition (静的定義)

質問の表示条件。

| Field | Type | Description |
|-------|------|-------------|
| hasChildren | boolean or null | 子供がいる場合のみ表示 |
| hasInfant | boolean or null | 幼児(0-2歳)がいる場合のみ表示 |
| area | "domestic" or "overseas" or null | 特定エリア選択時のみ表示 |

### HearingAnswer (ランタイムのみ)

ユーザーの回答データ。ヒアリングフロー中にメモリ上で保持し、localStorage に一時保存する。

| Field | Type | Description |
|-------|------|-------------|
| questionId | string | 対応する質問ID |
| selectedOptions | string[] | 選択した選択肢のID配列 |
| freeText | string or null | フリーテキスト回答 |
| skipped | boolean | スキップしたかどうか |

### HearingProfile (DB永続化: hearing_profiles テーブル)

ヒアリング回答から導出・蓄積された好み情報。

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | 主キー |
| userId | UUID | ユーザーID (auth.users FK) |
| preferences | HearingPreferences | 好み情報 (JSONB) |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

### HearingPreferences (JSONB構造)

| Field | Type | Description |
|-------|------|-------------|
| hobbies | string[] | 家族の趣味・興味 |
| travelPriorities | string[] | 旅行で重視すること |
| childInterests | string[] | 子供が喜ぶ体験 |
| transportPreference | string or null | 移動手段の希望 |
| foodPreferences | string[] | 食事のこだわり |
| customNotes | string or null | 自由記述メモ |

## Relationships

```
FamilyProfile (既存)
  |
  +-- 1:1 --> HearingProfile (新規)
  |              preferences: HearingPreferences
  |
  +-- 1:N --> TripProposal (既存)
                condition: TripCondition + HearingAnswers (プロンプトに組込み)
```

## State Transitions

### ヒアリングフロー状態

```
[基本条件入力済み]
    |
    +-- "もっと詳しく教える" --> [ヒアリング中]
    |                              |
    |                              +-- 質問に回答 --> [次の質問]
    |                              |
    |                              +-- スキップ --> [次の質問]
    |                              |
    |                              +-- 全質問完了 --> [ヒアリング完了]
    |                              |
    |                              +-- "基本条件だけで提案" --> [提案生成(基本)]
    |
    +-- "旅行先を提案して" --> [提案生成(基本)]

[ヒアリング完了]
    |
    +-- "この条件で提案して" --> [提案生成(ヒアリング込み)]

[提案結果表示]
    |
    +-- "もっと絞り込む" --> [ヒアリング中]
```
