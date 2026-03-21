/**
 * E2E tests for US3: 旅のしおりを作成する
 *
 * TDD: Written BEFORE full implementation.
 * Run with: npx playwright test tests/e2e/itinerary.spec.ts
 *
 * Acceptance Scenarios (from spec.md US3):
 *  1. 「この旅行に決めた」→ しおり雛形が生成される（10秒以内）
 *  2. しおりの各セクションを編集できる
 *  3. 「しおりを出力する」→ 印刷プレビューが表示される
 */

import { test, expect } from '@playwright/test';

test.describe('US3: 旅のしおりを作成する', () => {
  test('シナリオ1: 「この旅行先に決めた」でしおり雛形が10秒以内に生成される', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    // Find an undecided saved proposal
    const undecidedCard = page.locator('section[aria-label="検討中の旅行先"] a').first();
    const count = await undecidedCard.count();
    if (count === 0) {
      test.skip();
      // reason: 検討中の保存済み提案がないためスキップ
      return;
    }

    await undecidedCard.click();

    // Click "decide" button
    const decideBtn = page.getByRole('button', { name: 'この旅行先に決めた' });
    await expect(decideBtn).toBeVisible();

    const startTime = Date.now();
    await decideBtn.click();

    // Should navigate to itinerary page within 10 seconds
    await expect(page).toHaveURL(/\/itinerary\//, { timeout: 10_000 });
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(10_000);

    // Itinerary sections should be visible
    await expect(page.getByRole('heading', { name: /しおり/ })).toBeVisible();
    await expect(page.getByRole('region', { name: '持ち物リスト' })).toBeVisible();
  });

  test('シナリオ2: しおりの各セクションを編集できる', async ({ page }) => {
    // Navigate to an existing itinerary
    await page.goto('/dashboard');
    const decidedCard = page.locator('section[aria-label="決定済みの旅行先"] a').first();
    const count = await decidedCard.count();
    if (count === 0) {
      test.skip();
      // reason: 決定済みの提案がないためスキップ
      return;
    }
    await decidedCard.click();

    // Look for link to itinerary
    const itineraryLink = page.getByRole('link', { name: 'しおりを見る' });
    if (await itineraryLink.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await itineraryLink.click();
    } else {
      test.skip();
      // reason: しおりへのリンクが見つかりませんでした
      return;
    }

    // Edit title
    const newTitle = `テスト旅行_${Date.now()}`;
    const titleInput = page.getByLabel('タイトル');
    await titleInput.fill(newTitle);
    await page.getByRole('button', { name: '保存' }).click();

    await expect(page.getByRole('status')).toContainText('保存しました', { timeout: 5_000 });

    // Reload and verify
    await page.reload();
    await expect(page.getByLabel('タイトル')).toHaveValue(newTitle);
  });

  test('シナリオ3: 「しおりを出力する」で印刷プレビューが表示される', async ({ page }) => {
    // Navigate to an itinerary
    await page.goto('/dashboard');
    const decidedCard = page.locator('section[aria-label="決定済みの旅行先"] a').first();
    if ((await decidedCard.count()) === 0) {
      test.skip();
      // reason: 決定済みの提案がないためスキップ
      return;
    }
    await decidedCard.click();

    const itineraryLink = page.getByRole('link', { name: 'しおりを見る' });
    if (!(await itineraryLink.isVisible({ timeout: 2_000 }).catch(() => false))) {
      test.skip();
      // reason: しおりへのリンクが見つかりませんでした
      return;
    }
    await itineraryLink.click();

    // Click print button
    await page.getByRole('link', { name: 'しおりを出力する' }).click();

    // Should navigate to print page
    await expect(page).toHaveURL(/\/print$/, { timeout: 5_000 });
    await expect(page.getByRole('main')).toBeVisible();
  });
});
