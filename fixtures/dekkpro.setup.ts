import { test as setup } from '@playwright/test';

const STORAGE_STATE_PATH = 'fixtures/.auth/dekkpro-storageState.json';

const CREDENTIALS = {
    email: 'phuongthao2012@gmail.com',
    password: 'Dekkpro1!',
};

setup('Dekkpro Auth0 Login', async ({ page }) => {
    setup.setTimeout(180000);

    // Navigate to Dekkpro - Angular app will redirect to Auth0 login
    await page.goto('https://demo.dekkpro.no', { timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});

    // Wait for Auth0 login form to appear
    await page.locator('#username').waitFor({ state: 'visible', timeout: 120000 });

    await page.locator('#username').fill(CREDENTIALS.email);
    await page.locator('#password').fill(CREDENTIALS.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/app/**', { timeout: 120000 });
    await page.waitForLoadState('networkidle');

    // Save storage state (cookies, localStorage) for reuse in tests
    await page.context().storageState({ path: STORAGE_STATE_PATH });
});
