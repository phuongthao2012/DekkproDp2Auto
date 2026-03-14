import test, { expect, Page, APIRequestContext } from "@playwright/test";
import { API_BASE_URL, buildOrderBody } from "../../test_data/dekkpro/ApiOrderData";
import { getApiToken } from "../../models/helpers/ApiTokenHelper";

export class SubmitApiOrderFlow {

    private wsid: string;
    private apiOrderNumber: string = '';

    constructor(
        private page: Page,
        private request: APIRequestContext,
    ) {
        // Generate a random WSID for this test run
        this.wsid = String(Math.floor(100000 + Math.random() * 900000));
    }

    getWsid(): string {
        return this.wsid;
    }

    getApiOrderNumber(): string {
        return this.apiOrderNumber;
    }

    // Step 1 + 2: Get token and submit the PostOrder API
    async submitOrder() {
        await test.step(`Submit PostOrder API with WSID=${this.wsid}`, async () => {
            // Step 1: Get a fresh access token
            const token = await getApiToken(this.request);

            const body = buildOrderBody(this.wsid);

            const response = await this.request.post(
                `${API_BASE_URL}/api/Dekkpro/PostOrder`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    data: body,
                },
            );

            expect(response.ok(), `API responded with status ${response.status()}`).toBeTruthy();

            const json = await response.json();

            // Step 3: Verify response structure
            expect(json).toHaveProperty('OrderNumber');
            expect(JSON.stringify(json)).toContain('ProductSkuId');
            expect(JSON.stringify(json)).toContain('1457.5');

            // Step 4: Save the order number
            this.apiOrderNumber = String(json.OrderNumber);
            expect(this.apiOrderNumber).not.toBe('');
        });
    }

    // Step 5: Navigate to sales orders page
    async navigateToSalesOrders() {
        await test.step('Navigate to Sales Orders page', async () => {
            await this.page.goto('https://demo.dekkpro.no/app/sales/orders');
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.waitForTimeout(2000);
        });
    }

    // Step 6: Click reset filter button
    async resetFilter() {
        await test.step('Click reset filter (Nullstille søk)', async () => {
            const resetBtn = this.page.locator('[title="Nullstille søk"]');
            await resetBtn.waitFor({ state: 'visible', timeout: 15000 });
            await resetBtn.click();
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.waitForTimeout(2000);
        });
    }

    // Step 7: Select all items under Varelager multiselect
    async selectAllVarelager() {
        await test.step('Select all Varelager items', async () => {
            // Click the multiselect dropdown to open it
            const multiselect = this.page.locator('.p-multiselect-dropdown').first();
            await multiselect.waitFor({ state: 'visible', timeout: 15000 });
            await multiselect.click();
            await this.page.waitForTimeout(1000);

            // Click "Select All" checkbox or header checkbox if available
            const selectAll = this.page.locator('.p-multiselect-header .p-checkbox, .p-multiselect-select-all .p-checkbox').first();
            if (await selectAll.isVisible().catch(() => false)) {
                await selectAll.click();
            } else {
                // Try clicking all individual items
                const items = this.page.locator('.p-multiselect-item .p-checkbox');
                const count = await items.count();
                for (let i = 0; i < count; i++) {
                    await items.nth(i).click();
                    await this.page.waitForTimeout(200);
                }
            }
            await this.page.waitForTimeout(500);

            // Close dropdown by clicking outside or pressing Escape
            await this.page.keyboard.press('Escape');
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.waitForTimeout(2000);
        });
    }

    // Step 8: Search by API order number and verify result
    async searchAndVerifyOrder() {
        await test.step(`Search and verify order ${this.apiOrderNumber}`, async () => {
            // Find the search input (placeholder="SØK")
            const searchInput = this.page.getByPlaceholder('SØK').first();
            await searchInput.click({ force: true });
            await searchInput.clear({ force: true });
            await searchInput.pressSequentially(this.apiOrderNumber, { delay: 80 });
            await this.page.keyboard.press('Enter');
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.waitForTimeout(3000);

            // Verify the order number appears in the results
            const orderRow = this.page.locator('table tbody tr, p-table tbody tr')
                .filter({ hasText: this.apiOrderNumber }).first();
            await expect(orderRow).toBeVisible({ timeout: 15000 });
        });
    }
}
