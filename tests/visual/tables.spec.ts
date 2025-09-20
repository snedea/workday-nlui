import { test, expect } from '@playwright/test';

test.describe('Table Components Visual Tests', () => {
  test('employee data table', async ({ page }) => {
    await page.goto('/');

    // Create a table-heavy prompt
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create an employee directory with a table showing Name, Department, Position, Status, and Actions. Include 5 sample employees with different status badges (Active, On Leave, Terminated).');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Take screenshot of the table
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('employee-table.png');
  });

  test('data table with status indicators', async ({ page }) => {
    await page.goto('/');

    // Create table with status badges
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a project status dashboard with a table containing Project Name, Status (Active, Completed, On Hold), Progress, and Due Date columns.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Take screenshot focusing on status indicators
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('table-status-indicators.png');
  });

  test('table in draggable mode', async ({ page }) => {
    await page.goto('/');

    // Create a table
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a simple inventory table with Item, Quantity, Price, and Category columns.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Switch to draggable mode
    const draggableButton = page.locator('button:has-text("📋 Static")');
    if (await draggableButton.isVisible()) {
      await draggableButton.click();
      await page.waitForTimeout(1000);
    }

    // Take screenshot in draggable mode
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('table-draggable-mode.png');
  });

  test('complex table with mixed content', async ({ page }) => {
    await page.goto('/');

    // Create complex table
    const textarea = page.locator('textarea[placeholder*="Describe the page"]');
    await textarea.fill('Create a comprehensive report table with Employee Name, Avatar, Department, Performance Rating (with badges), Actions (buttons), and Notes columns.');

    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);

    // Take screenshot of complex table
    const previewSection = page.locator('.bg-white.border.border-gray-200.rounded-2xl').filter({ hasText: 'Preview' });
    await expect(previewSection).toHaveScreenshot('table-complex-content.png');
  });
});