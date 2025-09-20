import { test, expect } from '@playwright/test';

test.describe('Home Page Visual Tests', () => {
  test('homepage with library sidebar', async ({ page }) => {
    await page.goto('/');

    // Wait for the app to load
    await expect(page.locator('h3:has-text("Prompt Composer")')).toBeVisible();
    await expect(page.locator('h3:has-text("Library")')).toBeVisible();

    // Wait for library items to load
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png');
  });

  test('homepage with search active', async ({ page }) => {
    await page.goto('/');

    // Wait for the app to load
    await expect(page.locator('h3:has-text("Library")')).toBeVisible();

    // Activate search
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('button');
    await page.waitForTimeout(1000);

    // Take screenshot with search results
    await expect(page).toHaveScreenshot('homepage-search-active.png');
  });

  test('homepage with filter categories', async ({ page }) => {
    await page.goto('/');

    // Wait for the app to load
    await expect(page.locator('h3:has-text("Library")')).toBeVisible();

    // Click on Controls filter
    await page.click('text=Controls');
    await page.waitForTimeout(1000);

    // Take screenshot with filters
    await expect(page).toHaveScreenshot('homepage-controls-filter.png');
  });
});