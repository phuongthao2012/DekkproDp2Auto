import { defineConfig, devices } from '@playwright/test';

// Shared browser config reused by all test projects
const sharedUse = {
    ...devices['Desktop Chrome'],
    baseURL          : 'https://demo.dekkpro.no',
    storageState     : 'fixtures/.auth/dekkpro-storageState.json',
    headless         : false,
    viewport         : null,
    deviceScaleFactor: undefined,
    launchOptions    : { args: ['--start-maximized'] },
    actionTimeout    : 15 * 1000,
    navigationTimeout: 60 * 1000,
    screenshot       : 'only-on-failure' as const,
    trace            : 'retain-on-failure' as const,
    video            : 'retain-on-failure' as const,
};

export default defineConfig({
    testDir     : './tests',
    fullyParallel: true,
    workers     : 2,   // worker 1 → Dekkpro project, worker 2 → FullResSalePrice project
    projects: [

        // ── Setup (runs once before any test project) ─────────────────────
        {
            name     : 'dekkpro-setup',
            testDir  : './fixtures',
            testMatch: /dekkpro\.setup\.ts/,
            use      : { ...devices['Desktop Chrome'] },
        },

        // ── Main suite — all specs EXCEPT FullResSalePrice ────────────────
        {
            name        : 'Dekkpro',
            testDir     : './tests/dekkpro',
            testIgnore  : ['**/FullResSalePrice.spec.ts'],
            timeout     : 300 * 1000,
            use         : { ...sharedUse },
            dependencies: ['dekkpro-setup'],
        },

        // ── Isolated project — FullResSalePrice on its own worker ─────────
        {
            name        : 'FullResSalePrice',
            testDir     : './tests/dekkpro',
            testMatch   : /FullResSalePrice\.spec\.ts/,
            timeout     : 300 * 1000,
            use         : { ...sharedUse },
            dependencies: ['dekkpro-setup'],
        },

    ],
    expect: {
        timeout: 15 * 1000,
    },
    reporter: [
        ['html', { open: 'never' }],
    ],
    globalSetup   : './fixtures/GlobalSetup.ts',
    globalTeardown: './fixtures/GlobalTearDown.ts',
})
