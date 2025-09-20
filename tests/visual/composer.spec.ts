import { test, expect } from '@playwright/test';

test.describe('Prompt Composer Visual Tests', () => {
  test('empty composer state', async ({ page }) => {
    await page.goto('/');

    // Wait for the composer to load
    await expect(page.locator('h3:has-text("Prompt Composer")')).toBeVisible();
    await page.waitForTimeout(1000);

    // Focus on composer area
    const composerSection = page.locator('div:has(h3:text("Prompt Composer"))');
    await expect(composerSection).toHaveScreenshot('composer-empty.png');
  });

  test('composer with sample text', async ({ page }) => {
    await page.goto('/');

    // Fill in sample prompt
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a shift management page with tabs for My Shifts, Available Shifts, and Swap Requests. Include a table showing upcoming shifts with columns for Date, Time, Location, and Status.');

    await page.waitForTimeout(500);

    // Take screenshot of filled composer
    const composerSection = page.locator('div:has(h3:text("Prompt Composer"))');
    await expect(composerSection).toHaveScreenshot('composer-filled.png');
  });

  test('composer with pattern buttons', async ({ page }) => {
    await page.goto('/');

    // Wait for patterns to load
    await expect(page.locator('text=Patterns')).toBeVisible();
    await page.waitForTimeout(1000);

    // Focus on patterns area
    const patternsSection = page.locator('div:has(h4:text("Patterns"))');
    await expect(patternsSection).toHaveScreenshot('composer-patterns.png');
  });

  test('composer with template menu open', async ({ page }) => {
    await page.goto('/');

    // Click the menu button (⋯)
    await page.click('button:has-text("⋯")');
    await page.waitForTimeout(500);

    // Take screenshot with menu open
    const composerSection = page.locator('div:has(h3:text("Prompt Composer"))');
    await expect(composerSection).toHaveScreenshot('composer-menu-open.png');
  });
});