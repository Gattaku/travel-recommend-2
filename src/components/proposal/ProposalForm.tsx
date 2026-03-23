'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FamilyProfile, TripCondition } from '@/src/types';

// ---------------------------------------------------------------------------
// Schema (Zod v4 compatible)
// ---------------------------------------------------------------------------

const schema = z.object({
  adultCount: z
    .number()
    .int()
    .min(1, '大人は1名以上必要です')
    .max(10, '大人は10名以内で入力してください'),
  childrenAgesRaw: z.string().default(''),
  season: z.enum(['spring', 'summer', 'autumn', 'winter']),
  budget: z.number().min(1, '予算を入力してください'),
  style: z.enum(['nature', 'culture', 'resort', 'onsen', 'city']),
  area: z.enum(['domestic', 'overseas']),
});

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProposalFormProps {
  onSubmit: (profile: FamilyProfile, condition: TripCondition) => void;
  onStartHearing?: (profile: FamilyProfile, condition: TripCondition) => void;
  isLoading: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const INPUT_CLASS = "w-full border border-[var(--border)] rounded-[var(--radius-lg)] px-3 py-2.5 text-sm bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] focus:border-[var(--color-primary-400)] transition-colors";

export function ProposalForm({ onSubmit, onStartHearing, isLoading }: ProposalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      adultCount: 2,
      childrenAgesRaw: '',
      season: 'summer',
      budget: 100000,
      style: 'nature',
      area: 'domestic',
    },
  });

  function parseValues(values: FormValues) {
    const childrenAges = (values.childrenAgesRaw as string)
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n: number) => !isNaN(n));

    const profile: FamilyProfile = {
      adultCount: values.adultCount,
      childrenAges,
    };
    const condition: TripCondition = {
      season: values.season,
      budget: values.budget,
      style: values.style,
      area: values.area,
    };
    return { profile, condition };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onFormSubmit(values: any) {
    const { profile, condition } = parseValues(values as FormValues);
    onSubmit(profile, condition);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onHearingClick(values: any) {
    const { profile, condition } = parseValues(values as FormValues);
    onStartHearing?.(profile, condition);
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      aria-label="旅行条件入力フォーム"
    >
      {hasErrors && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[var(--radius-lg)] text-sm text-red-700"
        >
          入力内容を確認してください。
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* 大人人数 */}
        <div>
          <label htmlFor="adultCount" className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
            大人人数 <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="adultCount"
            type="number"
            min={1}
            max={10}
            aria-required="true"
            aria-describedby={errors.adultCount ? 'adultCount-error' : undefined}
            className={INPUT_CLASS}
            {...register('adultCount', { valueAsNumber: true })}
          />
          {errors.adultCount && (
            <p id="adultCount-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.adultCount.message}
            </p>
          )}
        </div>

        {/* 子供の年齢 */}
        <div>
          <label htmlFor="childrenAgesRaw" className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
            子供の年齢（カンマ区切り）
          </label>
          <input
            id="childrenAgesRaw"
            type="text"
            placeholder="例: 5,8"
            className={INPUT_CLASS}
            {...register('childrenAgesRaw')}
          />
          <p className="mt-1 text-xs text-[var(--color-neutral-500)]">
            子供がいない場合は空欄
          </p>
        </div>

        {/* 旅行時期 */}
        <div>
          <label htmlFor="season" className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
            旅行時期 <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <select
            id="season"
            aria-required="true"
            className={INPUT_CLASS}
            {...register('season')}
          >
            <option value="spring">春（3〜5月）</option>
            <option value="summer">夏（6〜8月）</option>
            <option value="autumn">秋（9〜11月）</option>
            <option value="winter">冬（12〜2月）</option>
          </select>
        </div>

        {/* 予算 */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
            予算（円） <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="budget"
            type="number"
            min={0}
            step={10000}
            aria-required="true"
            aria-describedby={errors.budget ? 'budget-error' : undefined}
            className={INPUT_CLASS}
            {...register('budget', { valueAsNumber: true })}
          />
          {errors.budget && (
            <p id="budget-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.budget.message}
            </p>
          )}
        </div>

        {/* 旅行スタイル */}
        <div>
          <label htmlFor="style" className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
            旅行スタイル <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <select
            id="style"
            aria-required="true"
            className={INPUT_CLASS}
            {...register('style')}
          >
            <option value="nature">自然体験</option>
            <option value="culture">文化・歴史</option>
            <option value="resort">リゾート</option>
            <option value="onsen">温泉・のんびり</option>
            <option value="city">都市観光</option>
          </select>
        </div>

        {/* エリア */}
        <div>
          <label htmlFor="area" className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
            エリア <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <select
            id="area"
            aria-required="true"
            className={INPUT_CLASS}
            {...register('area')}
          >
            <option value="domestic">国内</option>
            <option value="overseas">海外</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={isLoading}
          aria-disabled={isLoading}
          className="btn-primary w-full sm:w-auto px-8 py-3 text-sm"
        >
          {isLoading ? '提案を生成中...' : '次へ →'}
        </button>
        {onStartHearing && (
          <button
            type="button"
            disabled={isLoading}
            aria-disabled={isLoading}
            onClick={handleSubmit(onHearingClick)}
            className="btn-secondary w-full sm:w-auto px-8 py-3 text-sm"
          >
            もっと詳しく教える
          </button>
        )}
      </div>
    </form>
  );
}
