import test, { expect, Page } from "@playwright/test";
import LoginPage from "../../models/pages/dekkpro/LoginPage";
import PurchaseOrderListPage from "../../models/pages/dekkpro/PurchaseOrderListPage";
import { poSearchByVendorNameData, poSearchByPhoneData } from "../../test_data/dekkpro/PurchaseOrderData";
import { THAO_USER } from "../../test_data/dekkpro/Credentials";

export class PoSearchFlow {

    private loginPage: LoginPage;
    private purchaseOrdersPage: PurchaseOrderListPage;
    private vendorData = poSearchByVendorNameData;
    private phoneData = poSearchByPhoneData;

    constructor(private page: Page) {
        this.loginPage = new LoginPage(page);
        this.purchaseOrdersPage = new PurchaseOrderListPage(page);
    }

    // ── Shared steps ──────────────────────────────────────────────────────

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

    async navigateToPurchaseOrders() {
        await test.step('Navigate to purchase orders list', async () => {
            await this.purchaseOrdersPage.navigate();
            await expect(this.page).toHaveURL(/.*\/app\/purchasing\/purchase-orders/);
        });
    }

    // ── Search by Vendor name ─────────────────────────────────────────────

    async searchByVendorName() {
        await test.step(`Search by Vendor name: ${this.vendorData.customer.name}`, async () => {
            await this.purchaseOrdersPage.searchFor(this.vendorData.customer.name);
        });
    }

    async verifyVendorNameResults() {
        await test.step(`Verify customer "${this.vendorData.customer.name}" appears in search results`, async () => {
            const row = this.purchaseOrdersPage.rowContainingCustomer(this.vendorData.customer.name);
            await expect(row).toBeVisible({ timeout: 15000 });
        });
    }

    // ── Search by Phone / Mobile ──────────────────────────────────────────

    async searchByPONumber() {
        await test.step(`Search by PO number: ${this.phoneData.poNumber}`, async () => {
            await this.purchaseOrdersPage.searchFor(this.phoneData.poNumber);
            const row = this.purchaseOrdersPage.rowContainingCustomer(this.phoneData.customer.name);
            await expect(row).toBeVisible({ timeout: 15000 });
        });
    }

    async searchByFullMobile() {
        await test.step(`Search by full mobile: ${this.phoneData.searchTerms.fullMobile}`, async () => {
            await this.purchaseOrdersPage.clearSearch();
            await this.purchaseOrdersPage.searchFor(this.phoneData.searchTerms.fullMobile);
            const row = this.purchaseOrdersPage.rowContainingCustomer(this.phoneData.customer.name);
            await expect(row).toBeVisible({ timeout: 15000 });
        });
    }

    async searchByPartialMobile() {
        await test.step(`Search by partial mobile: ${this.phoneData.searchTerms.partialMobile}`, async () => {
            await this.purchaseOrdersPage.clearSearch();
            await this.purchaseOrdersPage.searchFor(this.phoneData.searchTerms.partialMobile);
            const row = this.purchaseOrdersPage.rowContainingCustomer(this.phoneData.customer.name);
            await expect(row).toBeVisible({ timeout: 15000 });
        });
    }

    async searchByPhone() {
        await test.step(`Search by phone: ${this.phoneData.searchTerms.phone}`, async () => {
            await this.purchaseOrdersPage.clearSearch();
            await this.purchaseOrdersPage.searchFor(this.phoneData.searchTerms.phone);
            const row = this.purchaseOrdersPage.rowContainingCustomer(this.phoneData.customer.name);
            await expect(row).toBeVisible({ timeout: 15000 });
        });
    }
}
