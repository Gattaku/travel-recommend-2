'use client';

import { useState, useEffect } from 'react';
import type { HearingPreferences } from '@/src/types';

// ---------------------------------------------------------------------------
// 好みプロフィール編集コンポーネント
// ---------------------------------------------------------------------------

const HOBBY_OPTIONS = [
  { id: 'fishing', label: '釣り' },
  { id: 'hiking', label: 'ハイキング・登山' },
  { id: 'photography', label: '写真撮影' },
  { id: 'camping', label: 'キャンプ' },
  { id: 'sports', label: 'スポーツ・アクティビティ' },
  { id: 'art-museums', label: '美術館・博物館' },
  { id: 'shopping', label: 'ショッピング' },
  { id: 'hot-springs', label: '温泉' },
  { id: 'gourmet', label: 'グルメ・食べ歩き' },
  { id: 'history', label: '歴史・神社仏閣' },
];

const PRIORITY_OPTIONS = [
  { id: 'scenery', label: '景色・絶景' },
  { id: 'food', label: '食事・グルメ' },
  { id: 'relaxation', label: 'のんびり・癒し' },
  { id: 'adventure', label: '冒険・体験' },
  { id: 'learning', label: '学び・教育' },
  { id: 'instagram', label: 'フォトジェニック' },
  { id: 'local-culture', label: '地元の文化に触れる' },
  { id: 'convenience', label: 'アクセスの良さ' },
];

const TRANSPORT_OPTIONS = [
  { id: 'car', label: '車' },
  { id: 'train', label: '電車・新幹線' },
  { id: 'plane', label: '飛行機' },
  { id: 'bus', label: 'バス・ツアー' },
  { id: 'any', label: 'こだわりなし' },
];

const FOOD_OPTIONS = [
  { id: 'local-cuisine', label: 'ご当地グルメ' },
  { id: 'seafood', label: '海鮮・魚介' },
  { id: 'bbq', label: 'BBQ・アウトドア' },
  { id: 'allergy-free', label: 'アレルギー対応' },
  { id: 'vegetarian', label: 'ベジタリアン' },
  { id: 'child-menu', label: '子供向けメニュー充実' },
  { id: 'no-preference', label: 'こだわりなし' },
];

const emptyPreferences: HearingPreferences = {
  hobbies: [],
  travelPriorities: [],
  childInterests: [],
  transportPreference: null,
  foodPreferences: [],
  customNotes: null,
};

interface HearingProfileEditorProps {
  onSaved?: () => void;
}

export function HearingProfileEditor({ onSaved }: HearingProfileEditorProps) {
  const [prefs, setPrefs] = useState<HearingPreferences>(emptyPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/hearing-profile');
        if (res.ok) {
          const data = await res.json();
          setPrefs(data.preferences);
          setHasProfile(true);
        }
      } catch {
        // 未作成の場合は空のまま
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggleOption(field: 'hobbies' | 'travelPriorities' | 'foodPreferences', optionId: string) {
    setPrefs((prev) => {
      const current = prev[field];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [field]: updated };
    });
  }

  function setTransport(optionId: string) {
    setPrefs((prev) => ({ ...prev, transportPreference: optionId }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/hearing-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: prefs }),
      });
      if (res.ok) {
        setMessage('保存しました');
        setHasProfile(true);
        onSaved?.();
      } else {
        setMessage('保存に失敗しました');
      }
    } catch {
      setMessage('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/hearing-profile', { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        setPrefs(emptyPreferences);
        setHasProfile(false);
        setMessage('プロフィールを削除しました');
        onSaved?.();
      }
    } catch {
      setMessage('削除に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--color-neutral-700)]">読み込み中...</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[var(--foreground)]">好みプロフィール</h3>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700"
        >
          {message}
        </div>
      )}

      {/* 趣味 */}
      <fieldset>
        <legend className="text-sm font-medium mb-2">家族の趣味・興味</legend>
        <div className="flex flex-wrap gap-2">
          {HOBBY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOption('hobbies', opt.id)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                prefs.hobbies.includes(opt.id)
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                  : 'border-[var(--border)] text-[var(--foreground)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 重視すること */}
      <fieldset>
        <legend className="text-sm font-medium mb-2">旅行で重視すること</legend>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOption('travelPriorities', opt.id)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                prefs.travelPriorities.includes(opt.id)
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                  : 'border-[var(--border)] text-[var(--foreground)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 移動手段 */}
      <fieldset>
        <legend className="text-sm font-medium mb-2">移動手段の希望</legend>
        <div className="flex flex-wrap gap-2">
          {TRANSPORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTransport(opt.id)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                prefs.transportPreference === opt.id
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                  : 'border-[var(--border)] text-[var(--foreground)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 食事 */}
      <fieldset>
        <legend className="text-sm font-medium mb-2">食事のこだわり</legend>
        <div className="flex flex-wrap gap-2">
          {FOOD_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOption('foodPreferences', opt.id)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                prefs.foodPreferences.includes(opt.id)
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                  : 'border-[var(--border)] text-[var(--foreground)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* メモ */}
      <div>
        <label htmlFor="customNotes" className="block text-sm font-medium mb-2">
          その他メモ
        </label>
        <textarea
          id="customNotes"
          value={prefs.customNotes ?? ''}
          onChange={(e) => setPrefs((prev) => ({ ...prev, customNotes: e.target.value || null }))}
          rows={2}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none"
          placeholder="その他の希望やメモ..."
        />
      </div>

      {/* アクション */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[var(--color-primary-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-700)] disabled:opacity-50 transition-colors"
        >
          {saving ? '保存中...' : '保存する'}
        </button>
        {hasProfile && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="px-6 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            削除する
          </button>
        )}
      </div>
    </div>
  );
}
