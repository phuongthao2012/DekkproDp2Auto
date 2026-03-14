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
    fullyParallel: false,
    projects: [

        // ── Setup (runs once before any test project) ─────────────────────
        {
            name     : 'dekkpro-setup',
            testDir  : './fixtures',
            testMatch: /dekkpro\.setup\.ts/,
            use      : { ...devices['Desktop Chrome'] },
        },
                // ── ALL cases ─────────────────────────
        {
            name        : 'ALL',
            testDir     : './tests/dekkpro',
            testMatch   : /.*\.spec\.ts/,
            timeout     : 300 * 1000,
            use         : { ...sharedUse },
            dependencies: ['dekkpro-setup'],
        },

        // // ── PurchaseOrders: WPR-0048 + DP2-23193 ─────────────────────────
        // {
        //     name        : 'PurchaseOrders',
        //     testDir     : './tests/dekkpro',
        //     testMatch   : /FullResSalePrice\.spec\.ts|PoSearchByVendorName\.spec\.ts/,
        //     timeout     : 300 * 1000,
        //     use         : { ...sharedUse },
        //     dependencies: ['dekkpro-setup'],
        // },

        // ── Dekkpro: Invoice History + New Order (Reservation Flow) ───────
        {
            name        : 'Dekkpro',
            testDir     : './tests/dekkpro',
            testIgnore  : ['**/FullResSalePrice.spec.ts', '**/PoSearchByVendorName.spec.ts'],
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
