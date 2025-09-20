import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for testing WITHOUT Tailwind CSS
 * Used to capture visual differences when Tailwind is disabled
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5175', // Different port for no-Tailwind server
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium-notw',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  /* Start the dev server WITHOUT Tailwind */
  webServer: {
    command: 'npm run tw:off',
    url: 'http://localhost:5175',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  expect: {
    toHaveScreenshot: {
      threshold: 0.2,
      mode: 'strict',
    },
  },
});