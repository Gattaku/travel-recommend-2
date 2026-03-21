/**
 * E2E tests for US2: 提案を保存・管理する
 *
 * TDD: Written BEFORE full implementation.
 * Run with: npx playwright test tests/e2e/save.spec.ts
 *
 * Acceptance Scenarios (from spec.md US2):
 *  1. 提案を保存 → 保存済み一覧に追加される
 *  2. 保存済み提案にメモを追加 → 次回もメモが表示される
 *  3. 保存済み提案を削除 → 一覧から消える
 */

import { test, expect } from '@playwright/test';

test.describe('US2: 提案を保存・管理する', () => {
  test('シナリオ1: 提案を保存すると保存済み一覧に追加される', async ({ page }) => {
    await page.goto('/propose');

    await page.getByLabel('大人人数').fill('2');
    await page.getByLabel('旅行時期').selectOption('summer');
    await page.getByLabel('予算（円）').fill('100000');
    await page.getByLabel('旅行スタイル').selectOption('nature');
    await page.getByLabel('エリア').selectOption('domestic');
    await page.getByRole('button', { name: '旅行先を提案して' }).click();

    await expect(page.getByTestId('proposal-card').first()).toBeVisible({ timeout: 30_000 });

    // Save the first proposal
    await page.getByTestId('proposal-card').first().getByRole('button', { name: '保存する' }).click();
    await expect(
      page.getByTestId('proposal-card').first().getByRole('button', { name: '保存済み' }),
    ).toBeVisible({ timeout: 5_000 });

    // Verify it appears on dashboard
    await page.goto('/dashboard');
    const count = await page.locator('a[aria-label^="保存済み:"]').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('シナリオ2: 保存済み提案にメモを追加すると保持される', async ({ page }) => {
    await page.goto('/dashboard');

    // Click first saved proposal
    const firstCard = page.locator('a[aria-label^="保存済み:"]').first();
    if ((await firstCard.count()) === 0) {
      test.skip();
      // reason: 保存済み提案がないためスキップ
      return;
    }
    await firstCard.click();

    // Add memo
    const memo = `テストメモ_${Date.now()}`;
    const memoInput = page.getByLabel('メモ');
    await memoInput.fill(memo);
    await page.getByRole('button', { name: 'メモを保存' }).click();

    await expect(page.getByRole('status')).toContainText('保存しました', { timeout: 5_000 });

    // Reload and verify memo persists
    await page.reload();
    await expect(page.getByLabel('メモ')).toHaveValue(memo);
  });

  test('シナリオ3: 保存済み提案を削除すると一覧から消える', async ({ page }) => {
    await page.goto('/dashboard');

    const cards = page.locator('a[aria-label^="保存済み:"]');
    const countBefore = await cards.count();
    if (countBefore === 0) {
      test.skip();
      // reason: 保存済み提案がないためスキップ
      return;
    }

    const firstName = await cards.first().getAttribute('aria-label');

    // Go to detail page and delete
    await cards.first().click();
    await page.getByRole('button', { name: 'この提案を削除' }).click();

    // Confirm dialog if present
    const confirmBtn = page.getByRole('button', { name: '削除する' });
    if (await confirmBtn.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await confirmBtn.click();
    }

    // Should redirect back to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 5_000 });

    // Deleted item should not appear
    const remaining = page.locator(`a[aria-label="${firstName}"]`);
    expect(await remaining.count()).toBe(0);
  });
});
