import { test, expect } from '@playwright/test';

test.describe('Drag and Drop Visual Tests', () => {
  test('edit mode default activation', async ({ page }) => {
    await page.goto('/');

    // Create a simple layout with draggable components
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a simple page with header, two buttons, and a text section.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Should automatically be in edit mode with drag handles visible
    // Take screenshot showing drag handles
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('edit-mode-handles.png');
  });

  test('components with drag handles visible', async ({ page }) => {
    await page.goto('/');

    // Create components that should be draggable
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a dashboard with multiple cards containing buttons, text, and status badges.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Should automatically show drag handles in edit mode
    // Take screenshot of draggable components
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('edit-components-with-handles.png');
  });

  test('edit mode persistence', async ({ page }) => {
    await page.goto('/');

    // Create layout
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a form with title, input fields, and submit button.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Should remain in edit mode with drag handles visible
    // Take screenshot showing persistent edit mode
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('edit-mode-persistent.png');
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