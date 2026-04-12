// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'always' }]],
  use: {
    baseURL: 'http://localhost:5173', // Pointing to your Vite dev server
    trace: 'on-first-retry',
    /* This makes the browser visible and slow enough to follow */
    launchOptions: {
      slowMo: 500,
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});