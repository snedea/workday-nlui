import { test, expect } from '@playwright/test';

test.describe('Form Components Visual Tests', () => {
  test('generated form with various input types', async ({ page }) => {
    await page.goto('/');

    // Fill in a form-focused prompt
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create an employee information form with text fields for first name, last name, email, dropdown for department (Engineering, Sales, Marketing), and a submit button.');

    // Generate the UI
    await page.click('button:has-text("Generate")');

    // Wait for generation to complete
    await expect(page.locator('text=Preview')).toBeVisible();
    await page.waitForTimeout(3000);

    // Take screenshot of the generated form
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('generated-form.png');
  });

  test('form in static mode', async ({ page }) => {
    await page.goto('/');

    // Create a form
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a contact form with name, email, message textarea, and submit button.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Ensure we're in view mode
    const viewButton = page.locator('button:has-text("👁️ View")');
    if (await viewButton.isVisible()) {
      // Already in view mode
    } else {
      // Switch to view mode
      await page.click('button:has-text("✏️ Edit")');
      await page.waitForTimeout(1000);
    }

    // Take screenshot in static mode
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('form-static-mode.png');
  });

  test('form with validation states', async ({ page }) => {
    await page.goto('/');

    // Create a form with various field types
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a registration form with required fields: username, password, confirm password, email, and a dropdown for country selection.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Take screenshot of form fields
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('form-validation-fields.png');
  });
});