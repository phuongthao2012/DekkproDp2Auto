import { test as setup } from '@playwright/test';
import { SETUP_USER } from '../test_data/dekkpro/Credentials';

setup('Dekkpro Auth0 Login', async ({ page }) => {
    setup.setTimeout(180000);

    // Navigate to Dekkpro - Angular app will redirect to Auth0 login
    await page.goto('https://demo.dekkpro.no', { timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});

    // Wait for Auth0 login form to appear
    await page.locator('#username').waitFor({ state: 'visible', timeout: 120000 });

    await page.locator('#username').fill(SETUP_USER.email);
    await page.locator('#password').fill(SETUP_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/app/**', { timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});

    // Save storage state (cookies, localStorage) for reuse in tests
    await page.context().storageState({ path: SETUP_USER.storageStatePath });
});
