# API Contract: 旅のしおり

## POST /api/itinerary

決定済み保存提案からしおり雛形を生成する。

### Request

```json
{ "savedProposalId": "uuid" }
```

### Response 201

```json
{
  "id": "uuid",
  "title": "北海道・富良野 家族旅行",
  "travelDates": { "start": null, "end": null },
  "schedule": [],
  "accommodation": {},
  "packingList": [
    { "item": "パスポート（海外の場合）", "checked": false },
    { "item": "常備薬", "checked": false },
    { "item": "子供の着替え（日数分＋1）", "checked": false }
  ]
}
```

---

## GET /api/itinerary/:id

しおり詳細を取得する。

### Response 200

上記 POST レスポンスと同形式（`createdAt`, `updatedAt` 追加）

---

## PATCH /api/itinerary/:id

しおりを更新する。

### Request（部分更新可）

```json
{
  "title": "夏の北海道旅行",
  "travelDates": { "start": "2026-07-20", "end": "2026-07-23" },
  "schedule": [
    {
      "date": "2026-07-20",
      "spots": [
        { "name": "ファーム富田", "memo": "ラベンダーソフト食べたい" }
      ]
    }
  ],
  "accommodation": {
    "name": "ホテル〇〇",
    "address": "北海道富良野市...",
    "checkIn": "2026-07-20",
    "checkOut": "2026-07-23"
  },
  "packingList": [
    { "item": "常備薬", "checked": true }
  ]
}
```

### Response 200

```json
{ "id": "uuid", "updated": true }
```
