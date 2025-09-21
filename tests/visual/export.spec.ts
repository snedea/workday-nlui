import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import JSZip from 'jszip';

test.describe('Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Generate a simple preview by using a template or typing a prompt
    // First try clicking "Use" on an existing template
    const useButton = page.locator('[data-testid="library-item-use"]').first();
    if (await useButton.isVisible()) {
      await useButton.click();
    } else {
      // Fallback: type a simple prompt
      await page.fill('textarea[placeholder*="prompt"]', 'Create a simple worker profile page with name and status');
    }

    // Click Generate button
    await page.getByRole('button', { name: /generate/i }).click();

    // Wait for the preview to be generated
    await page.waitForSelector('[data-testid="nlui-preview-root"]', { timeout: 30000 });

    // Wait for the Export menu to appear (it only shows when generatedUI exists)
    await page.waitForSelector('[data-testid="export-menu"]', { timeout: 5000 });
  });

  test('should display Export menu when preview is available', async ({ page }) => {
    // Check that Export menu is visible
    const exportMenu = page.locator('[data-testid="export-menu"]');
    await expect(exportMenu).toBeVisible();

    // Check Export button has correct text and icon
    await expect(exportMenu).toContainText('Export');

    // Click to open menu
    await exportMenu.click();

    // Check menu items are visible
    await expect(page.locator('[data-testid="export-png"]')).toBeVisible();
    await expect(page.locator('[data-testid="export-zip"]')).toBeVisible();

    // Check menu item text
    await expect(page.locator('[data-testid="export-png"]')).toContainText('PNG Snapshot');
    await expect(page.locator('[data-testid="export-zip"]')).toContainText('Workday Extend Bundle (.zip)');
  });

  test('should not show Export menu when no preview is available', async ({ page }) => {
    // Go to fresh page
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');

    // Export menu should not be visible when no preview
    const exportMenu = page.locator('[data-testid="export-menu"]');
    await expect(exportMenu).not.toBeVisible();
  });

  test('should download PNG when PNG export is clicked', async ({ page }) => {
    // Set up download handling
    const downloadPromise = page.waitForDownload();

    // Open export menu and click PNG export
    await page.locator('[data-testid="export-menu"]').click();
    await page.locator('[data-testid="export-png"]').click();

    // Wait for download
    const download = await downloadPromise;

    // Check filename pattern
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/^nlui-preview-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.png$/);

    // Save download to temp location for verification
    const downloadPath = path.join(__dirname, 'temp', filename);
    await download.saveAs(downloadPath);

    // Verify file exists and has content
    expect(fs.existsSync(downloadPath)).toBe(true);
    const stats = fs.statSync(downloadPath);
    expect(stats.size).toBeGreaterThan(1000); // PNG should be at least 1KB

    // Clean up
    fs.unlinkSync(downloadPath);
  });

  test('should download ZIP when Workday export is clicked', async ({ page }) => {
    // Set up download handling
    const downloadPromise = page.waitForDownload();

    // Open export menu and click ZIP export
    await page.locator('[data-testid="export-menu"]').click();
    await page.locator('[data-testid="export-zip"]').click();

    // Wait for download
    const download = await downloadPromise;

    // Check filename pattern
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/^nlui-extend-bundle-0\.1\.7\.zip$/);

    // Save download to temp location for verification
    const downloadPath = path.join(__dirname, 'temp', filename);
    await download.saveAs(downloadPath);

    // Verify file exists and has content
    expect(fs.existsSync(downloadPath)).toBe(true);
    const stats = fs.statSync(downloadPath);
    expect(stats.size).toBeGreaterThan(100); // ZIP should have some content

    // Verify ZIP contents
    const zipData = fs.readFileSync(downloadPath);
    const zip = await JSZip.loadAsync(zipData);

    // Check required files exist in ZIP
    const expectedFiles = [
      'workday/AMD.json',
      'workday/PMD.json',
      'workday/SMD.json',
      'workday/mock-data.json'
    ];

    for (const expectedFile of expectedFiles) {
      expect(zip.file(expectedFile)).toBeTruthy();

      // Verify JSON structure is valid
      const fileContent = await zip.file(expectedFile)!.async('text');
      expect(() => JSON.parse(fileContent)).not.toThrow();

      const jsonData = JSON.parse(fileContent);
      expect(jsonData.schema).toMatch(/^https:\/\/schemas\.workday\.com\/extend\//);
    }

    // Clean up
    fs.unlinkSync(downloadPath);
  });

  test('should show success toast after PNG export', async ({ page }) => {
    // Set up download handling
    const downloadPromise = page.waitForDownload();

    // Open export menu and click PNG export
    await page.locator('[data-testid="export-menu"]').click();
    await page.locator('[data-testid="export-png"]').click();

    // Wait for download
    await downloadPromise;

    // Check for success toast
    await expect(page.locator('text=Preview exported as PNG successfully')).toBeVisible();
  });

  test('should show success toast after ZIP export', async ({ page }) => {
    // Set up download handling
    const downloadPromise = page.waitForDownload();

    // Open export menu and click ZIP export
    await page.locator('[data-testid="export-menu"]').click();
    await page.locator('[data-testid="export-zip"]').click();

    // Wait for download
    await downloadPromise;

    // Check for success toast
    await expect(page.locator('text=Workday Extend bundle exported successfully')).toBeVisible();
  });

  test('should have proper keyboard accessibility', async ({ page }) => {
    // Focus the Export button with Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Find and focus the Export menu button
    let exportMenuFocused = false;
    let maxTabs = 20; // Prevent infinite loop

    while (!exportMenuFocused && maxTabs > 0) {
      const focusedElement = await page.evaluate(() => document.activeElement);
      const isExportMenu = await page.evaluate((el) =>
        el?.getAttribute?.('data-testid') === 'export-menu', focusedElement);

      if (isExportMenu) {
        exportMenuFocused = true;
        break;
      }

      await page.keyboard.press('Tab');
      maxTabs--;
    }

    expect(exportMenuFocused).toBe(true);

    // Open menu with Enter
    await page.keyboard.press('Enter');

    // Check menu items are visible
    await expect(page.locator('[data-testid="export-png"]')).toBeVisible();
    await expect(page.locator('[data-testid="export-zip"]')).toBeVisible();

    // Close menu with Escape
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="export-png"]')).not.toBeVisible();

    // Verify menu can also be opened with Space key
    await page.keyboard.press(' '); // Space key
    await expect(page.locator('[data-testid="export-png"]')).toBeVisible();

    // Close with Escape again
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="export-png"]')).not.toBeVisible();
  });
});

// Ensure temp directory exists for test artifacts
test.beforeAll(async () => {
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
});

// Clean up temp directory after tests
test.afterAll(async () => {
  const tempDir = path.join(__dirname, 'temp');
  if (fs.existsSync(tempDir)) {
    const files = fs.readdirSync(tempDir);
    for (const file of files) {
      fs.unlinkSync(path.join(tempDir, file));
    }
    fs.rmdirSync(tempDir);
  }
});