import { test, expect } from '@playwright/test';

test.describe('Alerts and Status Components Visual Tests', () => {
  test('banner and toast components', async ({ page }) => {
    await page.goto('/');

    // Create a page with banners and toasts
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a system status page with success banner, warning banner, error banner, and info toast notifications.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Take screenshot of alert components
    const previewSection = page.locator('div:has(h3:text("Preview"))');
    await expect(previewSection).toHaveScreenshot('alerts-banners-toasts.png');
  });

  test('status indicators and badges', async ({ page }) => {
    await page.goto('/');

    // Create status badge variations
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a user status dashboard showing different status badges: Active (green), On Leave (orange), Terminated (red), and Pending (gray).');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Take screenshot of status indicators
    const previewSection = page.locator('div:has(h3:text("Preview"))');
    await expect(previewSection).toHaveScreenshot('status-badges.png');
  });

  test('notification states', async ({ page }) => {
    await page.goto('/');

    // Create various notification types
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a notification center with different alert types: success notification for completed action, warning for pending approval, and error for failed operation.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Take screenshot
    const previewSection = page.locator('div:has(h3:text("Preview"))');
    await expect(previewSection).toHaveScreenshot('notification-states.png');
  });

  test('interactive toast generation', async ({ page }) => {
    await page.goto('/');

    // Create a form that will trigger toast notifications
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create an expense report form with submit button.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Try to interact with a submit button to trigger toast
    const submitButton = page.locator('button:has-text("Submit")').first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);

      // Take screenshot with any generated toast
      await expect(page).toHaveScreenshot('interactive-toast.png');
    } else {
      // Fallback screenshot if no interactive elements
      const previewSection = page.locator('div:has(h3:text("Preview"))');
      await expect(previewSection).toHaveScreenshot('form-without-toast.png');
    }
  });
});