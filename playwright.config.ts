import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    projects: [
        {
            name: 'dekkpro-setup',
            testDir: './fixtures',
            testMatch: /dekkpro\.setup\.ts/,
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'Dekkpro',
            testDir: './tests/dekkpro',
            timeout: 180 * 1000,
            use: {
                ...devices['Desktop Chrome'],
                baseURL: 'https://demo.dekkpro.no',
                storageState: 'fixtures/.auth/dekkpro-storageState.json',
                headless: false,
                viewport: null,
                deviceScaleFactor: undefined,
                launchOptions: {
                    args: ['--start-maximized'],
                },
                actionTimeout: 15 * 1000,
                navigationTimeout: 60 * 1000,
                screenshot: 'only-on-failure',
                trace: 'retain-on-failure',
                video: 'retain-on-failure',
            },
            dependencies: ['dekkpro-setup'],
        },
    ],
    expect: {
        timeout: 15 * 1000,
    },
    reporter: [
        ['html', { open: 'never' }],
    ],
    globalSetup: './fixtures/GlobalSetup.ts',
    globalTeardown: './fixtures/GlobalTearDown.ts',
})
