/**
 * E2E tests for US1: 旅行先の提案を受け取る
 *
 * TDD: Written BEFORE full implementation; expect failures until app is running.
 * Run with: npx playwright test tests/e2e/propose.spec.ts
 *
 * Acceptance Scenarios (from spec.md US1):
 *  1. 条件入力 → 3件以上の候補が表示される
 *  2. 条件変更 → 再提案で異なる候補が表示される
 *  3. 必須未入力 → 不足項目が明示されて提案されない
 */

import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function goToProposePage(page: Page) {
  await page.goto('/propose');
}

async function fillProposalForm(
  page: Page,
  opts: {
    adultCount?: string;
    childrenAges?: string;
    season?: string;
    budget?: string;
    style?: string;
    area?: string;
  } = {},
) {
  const {
    adultCount = '2',
    childrenAges = '5,8',
    season = 'summer',
    budget = '100000',
    style = 'nature',
    area = 'domestic',
  } = opts;

  await page.getByLabel('大人人数').fill(adultCount);
  await page.getByLabel('子供の年齢（カンマ区切り）').fill(childrenAges);
  await page.getByLabel('旅行時期').selectOption(season);
  await page.getByLabel('予算（円）').fill(budget);
  await page.getByLabel('旅行スタイル').selectOption(style);
  await page.getByLabel('エリア').selectOption(area);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('US1: 旅行先の提案を受け取る', () => {
  test.beforeEach(async ({ page }) => {
    await goToProposePage(page);
  });

  test('シナリオ1: 条件入力後に3件以上の旅行先候補が表示される', async ({ page }) => {
    await fillProposalForm(page);
    await page.getByRole('button', { name: '旅行先を提案して' }).click();

    // Wait for results (30 second timeout per SC-001)
    await expect(page.getByTestId('proposal-card').first()).toBeVisible({ timeout: 30_000 });

    const count = await page.getByTestId('proposal-card').count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Each card should show required fields
    const firstCard = page.getByTestId('proposal-card').first();
    await expect(firstCard.getByTestId('destination-name')).toBeVisible();
    await expect(firstCard.getByTestId('destination-overview')).toBeVisible();
    await expect(firstCard.getByTestId('destination-budget')).toBeVisible();
  });

  test('シナリオ2: 条件変更後に再提案すると異なる候補が表示される', async ({ page }) => {
    // First proposal
    await fillProposalForm(page, { season: 'summer', style: 'nature' });
    await page.getByRole('button', { name: '旅行先を提案して' }).click();
    await expect(page.getByTestId('proposal-card').first()).toBeVisible({ timeout: 30_000 });

    const firstResultText = await page
      .getByTestId('proposal-card')
      .first()
      .getByTestId('destination-name')
      .textContent();

    // Change conditions and re-propose
    await page.getByLabel('旅行時期').selectOption('winter');
    await page.getByLabel('旅行スタイル').selectOption('onsen');
    await page.getByRole('button', { name: '旅行先を提案して' }).click();

    await expect(page.getByTestId('proposal-card').first()).toBeVisible({ timeout: 30_000 });

    // Verify at least one name differs (statistically likely)
    const allNames = await page
      .getByTestId('destination-name')
      .allTextContents();
    expect(allNames.some((n) => n !== firstResultText)).toBe(true);
  });

  test('シナリオ3: 必須条件未入力の場合は不足項目が表示されて提案されない', async ({
    page,
  }) => {
    // Clear the default values and submit
    await page.getByLabel('大人人数').fill('');
    await page.getByLabel('予算（円）').fill('');
    await page.getByRole('button', { name: '旅行先を提案して' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    const count = await page.getByTestId('proposal-card').count();
    expect(count).toBe(0);
  });
});
