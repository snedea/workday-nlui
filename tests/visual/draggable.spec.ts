import { test, expect } from '@playwright/test';

test.describe('Drag and Drop Visual Tests', () => {
  test('draggable mode activation', async ({ page }) => {
    await page.goto('/');

    // Create a simple layout with draggable components
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a simple page with header, two buttons, and a text section.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Switch to draggable mode
    const viewButton = page.locator('button:has-text("👁️ View")');
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(1000);
    }

    // Take screenshot showing drag handles
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('draggable-mode-handles.png');
  });

  test('components with drag handles visible', async ({ page }) => {
    await page.goto('/');

    // Create components that should be draggable
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a dashboard with multiple cards containing buttons, text, and status badges.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Activate draggable mode
    const viewButton = page.locator('button:has-text("👁️ View")');
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(1000);
    }

    // Take screenshot of draggable components
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('draggable-components-with-handles.png');
  });

  test('draggable to static mode transition', async ({ page }) => {
    await page.goto('/');

    // Create layout
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a form with title, input fields, and submit button.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Start in draggable mode
    const viewButton = page.locator('button:has-text("👁️ View")');
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(1000);

      // Now switch back to static
      await page.click('button:has-text("✏️ Edit")');
      await page.waitForTimeout(1000);
    }

    // Take screenshot in static mode after transition
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('static-mode-after-draggable.png');
  });

  test('resizable preview window', async ({ page }) => {
    await page.goto('/');

    // Create content
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a large content area with multiple sections and tables.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Take screenshot showing resize handle at bottom
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('resizable-preview-window.png');
  });

  test('preview title format', async ({ page }) => {
    await page.goto('/');

    // Create content with identifiable title
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create an expense report dashboard with summary cards.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Take screenshot showing the "Preview - [Title]" format
    const headerSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(headerSection).toHaveScreenshot('preview-title-format.png');
  });
});