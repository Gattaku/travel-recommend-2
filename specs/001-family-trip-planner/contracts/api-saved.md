# API Contract: 保存済み提案

## GET /api/saved

ログインユーザーの保存済み提案一覧を返す。

### Response 200

```json
{
  "saved": [
    {
      "id": "uuid",
      "destination": { "name": "北海道・富良野", "overview": "..." },
      "memo": "子供が動物園を楽しみにしている",
      "isDecided": false,
      "createdAt": "2026-03-22T10:00:00Z"
    }
  ]
}
```

---

## POST /api/saved

提案を保存リストに追加する。

### Request

```json
{
  "proposalId": "uuid",
  "destination": { "name": "...", "overview": "...", "highlights": [], "estimatedBudget": "...", "tips": "..." }
}
```

### Response 201

```json
{ "id": "uuid" }
```

---

## PATCH /api/saved/:id

メモ更新または決定フラグ変更。

### Request

```json
{ "memo": "新しいメモ", "isDecided": true }
```

### Response 200

```json
{ "id": "uuid", "updated": true }
```

---

## DELETE /api/saved/:id

保存済み提案を削除する。

### Response 204

空レスポンス
