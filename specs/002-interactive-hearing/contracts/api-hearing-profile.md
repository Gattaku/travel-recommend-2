# API Contract: Hearing Profile

## GET /api/hearing-profile

認証済みユーザーの保存済み好みプロフィールを取得する。

### Response 200

```json
{
  "id": "uuid",
  "preferences": {
    "hobbies": ["fishing", "hiking"],
    "travelPriorities": ["scenery", "food"],
    "childInterests": ["insects", "water-play"],
    "transportPreference": "car",
    "foodPreferences": ["local-cuisine"],
    "customNotes": null
  },
  "updatedAt": "2026-03-23T00:00:00Z"
}
```

### Response 404

プロフィールが未作成の場合。

```json
{
  "error": "hearing profile not found"
}
```

### Response 401

未認証の場合。

```json
{
  "error": "unauthorized"
}
```

---

## PUT /api/hearing-profile

好みプロフィールを作成または更新する（UPSERT）。

### Request Body

```json
{
  "preferences": {
    "hobbies": ["fishing", "hiking"],
    "travelPriorities": ["scenery", "food"],
    "childInterests": ["insects", "water-play"],
    "transportPreference": "car",
    "foodPreferences": ["local-cuisine"],
    "customNotes": "自由記述メモ"
  }
}
```

### Response 200

```json
{
  "id": "uuid",
  "preferences": { ... },
  "updatedAt": "2026-03-23T00:00:00Z"
}
```

### Response 400

バリデーションエラー。

```json
{
  "error": "validation error",
  "fields": ["preferences"]
}
```

---

## DELETE /api/hearing-profile

好みプロフィールを削除する。

### Response 204

成功（レスポンスボディなし）。

### Response 404

プロフィールが存在しない場合。

```json
{
  "error": "hearing profile not found"
}
```
