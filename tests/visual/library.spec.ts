import { test, expect } from '@playwright/test';

test.describe('Library and Templates Visual Tests', () => {
  test('library sidebar with all categories', async ({ page }) => {
    await page.goto('/');

    // Wait for library to load
    await expect(page.locator('h3:has-text("Library")')).toBeVisible();
    await page.waitForTimeout(2000);

    // Take screenshot of full library sidebar
    const librarySection = page.locator('div:has(h3:text("Library"))');
    await expect(librarySection).toHaveScreenshot('library-sidebar-full.png');
  });

  test('library objects category', async ({ page }) => {
    await page.goto('/');

    // Click on Objects category
    await page.click('text=Objects');
    await page.waitForTimeout(1000);

    // Take screenshot of objects view
    const librarySection = page.locator('div:has(h3:text("Library"))');
    await expect(librarySection).toHaveScreenshot('library-objects-category.png');
  });

  test('library fields category', async ({ page }) => {
    await page.goto('/');

    // Click on Fields category
    await page.click('text=Fields');
    await page.waitForTimeout(1000);

    // Take screenshot of fields view
    const librarySection = page.locator('div:has(h3:text("Library"))');
    await expect(librarySection).toHaveScreenshot('library-fields-category.png');
  });

  test('library controls category', async ({ page }) => {
    await page.goto('/');

    // Click on Controls category
    await page.click('text=Controls');
    await page.waitForTimeout(1000);

    // Take screenshot of controls view
    const librarySection = page.locator('div:has(h3:text("Library"))');
    await expect(librarySection).toHaveScreenshot('library-controls-category.png');
  });

  test('library icons category', async ({ page }) => {
    await page.goto('/');

    // Click on Icons category
    await page.click('text=Icons');
    await page.waitForTimeout(1000);

    // Take screenshot of icons view
    const librarySection = page.locator('div:has(h3:text("Library"))');
    await expect(librarySection).toHaveScreenshot('library-icons-category.png');
  });

  test('library item with use button', async ({ page }) => {
    await page.goto('/');

    // Wait for library items
    await page.waitForTimeout(2000);

    // Look for a use button and hover over an item
    const useButton = page.locator('button:has-text("use")').first();
    if (await useButton.isVisible()) {
      await useButton.hover();
      await page.waitForTimeout(500);
    }

    // Take screenshot showing use button interaction
    const librarySection = page.locator('div:has(h3:text("Library"))');
    await expect(librarySection).toHaveScreenshot('library-item-use-button.png');
  });

  test('library search results', async ({ page }) => {
    await page.goto('/');

    // Search for specific term
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('table');
    await page.waitForTimeout(1000);

    // Take screenshot of search results
    const librarySection = page.locator('div:has(h3:text("Library"))');
    await expect(librarySection).toHaveScreenshot('library-search-results.png');
  });
});