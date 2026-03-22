# API Contract: 旅行提案生成

## POST /api/propose

Claude AI を使って家族構成・旅行条件から旅行先候補を生成する。

### Request

```json
{
  "familyProfile": {
    "adultCount": 2,
    "childrenAges": [5, 8]
  },
  "condition": {
    "season": "summer",
    "budget": 100000,
    "style": "nature",
    "area": "domestic"
  }
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| familyProfile.adultCount | number | ✅ | 大人人数（1〜10） |
| familyProfile.childrenAges | number[] | | 子供の年齢リスト |
| condition.season | string | ✅ | `spring` / `summer` / `autumn` / `winter` |
| condition.budget | number | ✅ | 総予算（円） |
| condition.style | string | ✅ | `nature` / `culture` / `resort` / `onsen` / `city` |
| condition.area | string | ✅ | `domestic` / `overseas` |

### Response 200

```json
{
  "proposalId": "uuid",
  "destinations": [
    {
      "name": "北海道・富良野",
      "overview": "広大なラベンダー畑と雄大な自然が広がる...",
      "highlights": ["ファーム富田", "白金青い池", "旭山動物園"],
      "estimatedBudget": "8〜12万円（4人）",
      "tips": "夏は混雑するため早めの予約を推奨"
    }
  ]
}
```

### Response 400

```json
{ "error": "条件が不足しています", "fields": ["condition.season"] }
```

### Response 504

```json
{ "error": "提案の生成に時間がかかっています。再度お試しください。" }
```
