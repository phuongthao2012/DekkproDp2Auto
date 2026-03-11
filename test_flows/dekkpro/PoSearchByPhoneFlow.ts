import test, { expect, Page } from "@playwright/test";
import LoginPage from "../../models/pages/dekkpro/LoginPage";
import PurchaseOrderListPage from "../../models/pages/dekkpro/PurchaseOrderListPage";
import { poSearchByPhoneData } from "../../test_data/dekkpro/PurchaseOrderData";
import { THAO_USER } from "../../test_data/dekkpro/Credentials";

export class PoSearchByPhoneFlow {

    private loginPage: LoginPage;
    private purchaseOrdersPage: PurchaseOrderListPage;
    private data = poSearchByPhoneData;

    constructor(private page: Page) {
        this.loginPage = new LoginPage(page);
        this.purchaseOrdersPage = new PurchaseOrderListPage(page);
    }

    // Step 1: Log out
    async logout() {
        await test.step('Log out current session', async () => {
            await this.page.goto('https://demo.dekkpro.no/app/dashboard');
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.evaluate(() => localStorage.clear());
            await this.page.evaluate(() => sessionStorage.clear());
            await this.page.context().clearCookies();
            await this.page.goto('https://demo.dekkpro.no');
            await this.page.waitForURL(/auth0|login/i, { timeout: 30000 });
        });
    }

    // Step 2: Login as thao@dekkpro.no
    async loginAsThao() {
        await test.step(`Login as ${THAO_USER.email}`, async () => {
            await this.page.locator('#username').waitFor({ state: 'visible', timeout: 60000 });
            await this.page.locator('#username').fill(THAO_USER.email);
            await this.page.locator('#password').fill(THAO_USER.password);
            await this.page.locator('button[type="submit"]').click();
            await this.page.waitForURL('**/app/**', { timeout: 90000 });
            await this.page.waitForLoadState('networkidle').catch(() => {});
        });
    }

    // Step 3: Navigate to Purchase Orders list
    async navigateToPurchaseOrders() {
        await test.step('Navigate to purchase orders list', async () => {
            await this.purchaseOrdersPage.navigate();
            await expect(this.page).toHaveURL(/.*\/app\/purchasing\/purchase-orders/);
        });
    }

    // Step 4: Search by customer phone number
    async searchByPhone() {
        await test.step(`Search by phone number: ${this.data.customer.phone}`, async () => {
            await this.purchaseOrdersPage.searchFor(this.data.customer.phone);
        });
    }

    // Step 5: Verify results contain the matching customer
    async verifyCustomerAppearsInResults() {
        await test.step(`Verify customer "${this.data.customer.name}" appears in search results`, async () => {
            const row = this.purchaseOrdersPage.rowContainingCustomer(this.data.customer.name);
            await expect(row).toBeVisible({ timeout: 15000 });
        });
    }
}
