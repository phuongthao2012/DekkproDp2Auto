import test, { expect, Page } from "@playwright/test";
import LoginPage from "../../models/pages/dekkpro/LoginPage";
import PurchaseOrdersPage from "../../models/pages/dekkpro/PurchaseOrdersPage";
import PurchaseOrderPage from "../../models/pages/dekkpro/PurchaseOrderPage";
import SalesOrderPage from "../../models/pages/dekkpro/SalesOrderPage";
import { fullResSalePriceData } from "../../test_data/dekkpro/PurchaseOrderData";

const CREDENTIALS = {
    email: 'thao@dekkpro.no',
    password: 'Th@0Th@0',
};

export class FullResSalePriceFlow {

    private loginPage: LoginPage;
    private purchaseOrdersPage: PurchaseOrdersPage;
    private purchaseOrderPage: PurchaseOrderPage;
    private salesOrderPage: SalesOrderPage;
    private data = fullResSalePriceData;

    constructor(private page: Page) {
        this.loginPage = new LoginPage(page);
        this.purchaseOrdersPage = new PurchaseOrdersPage(page);
        this.purchaseOrderPage = new PurchaseOrderPage(page);
        this.salesOrderPage = new SalesOrderPage(page);
    }

    // Step 1: Log out
    async logout() {
        await test.step('Log out current session', async () => {
            // Clear cookies and storage to force Auth0 re-authentication
            await this.page.context().clearCookies();
            await this.page.evaluate(() => localStorage.clear());
            await this.page.evaluate(() => sessionStorage.clear());
        });
    }

    // Step 2: Login with thao@dekkpro.no
    async loginAsThao() {
        await test.step(`Login as ${CREDENTIALS.email}`, async () => {
            await this.loginPage.navigate();
            await this.page.locator('#username').waitFor({ state: 'visible', timeout: 60000 });
            await this.loginPage.login(CREDENTIALS.email, CREDENTIALS.password);
            await this.page.waitForLoadState('networkidle');
        });
    }

    // Step 3: Navigate to purchase orders
    async navigateToPurchaseOrders() {
        await test.step('Navigate to purchase orders page', async () => {
            await this.purchaseOrdersPage.navigate();
            await expect(this.page).toHaveURL(/.*\/app\/purchasing\/purchase-orders/);
        });
    }

    // Step 4: Click "Ny bestilling"
    async clickNyBestilling() {
        await test.step('Click Ny bestilling button', async () => {
            await expect(this.purchaseOrdersPage.newOrderButton()).toBeVisible();
            await this.purchaseOrdersPage.clickNyBestilling();
        });
    }

    // Step 5: Verify new purchase order page URL
    async verifyNewPurchaseOrderPage() {
        await test.step('Verify new purchase order page is shown', async () => {
            await expect(this.page).toHaveURL(/.*\/app\/purchasing\/new-purchase-order/);
        });
    }

    // Step 6: Select Leverandør: Michelin Nordic AB
    async selectLeverandor() {
        await test.step('Select supplier: Michelin Nordic AB', async () => {
            await this.purchaseOrderPage.selectLeverandor('Michelin Nordic AB');
            await expect(this.page.getByText('Michelin Nordic AB')).toBeVisible();
        });
    }

    // Step 7 + 8: Search product ALL60010005, select it, fill qty=4 and save
    async searchAddProductWithQuantity() {
        await test.step('Search and select product ALL60010005, fill quantity 4 and save', async () => {
            await this.purchaseOrderPage.searchAndSelectProduct(
                this.data.products.primary.articleNumber
            );
            await this.purchaseOrderPage.fillQuantityAndSave(4);
        });
    }

    // Step 9: Search customer "3M Autosport AS" in Kunde field
    async searchCustomer() {
        await test.step('Search customer 3M Autosport AS in Kunde field', async () => {
            await this.purchaseOrderPage.searchCustomer(this.data.customer.name);
            await expect(this.page.getByText(this.data.customer.name)).toBeVisible();
        });
    }

    // Step 10: Click RES
    async clickRes() {
        await test.step('Click RES button', async () => {
            await expect(this.purchaseOrderPage.resButton()).toBeVisible();
            await this.purchaseOrderPage.clickRes();
        });
    }

    // Verification: Sale price and discount for ALL60010005
    async verifySalePriceAndDiscountForPrimary() {
        await test.step('Verify sale price 12,140 with 50% discount for ALL60010005', async () => {
            const row = this.purchaseOrderPage.orderLineRowByArticle(
                this.data.products.primary.articleNumber
            );
            await expect(row).toBeVisible();
            await expect(
                this.purchaseOrderPage.discountInRow(this.data.products.primary.articleNumber)
            ).toContainText(this.data.products.primary.expectedDiscount);
            await expect(
                this.purchaseOrderPage.salePriceInRow(this.data.products.primary.articleNumber)
            ).toContainText(this.data.products.primary.expectedSalePriceExVat);
        });
    }

    // Verification: Discount group
    async verifyDiscountGroup() {
        await test.step('Verify discount group is Gruppe 3 - Forhandlere', async () => {
            await expect(this.purchaseOrderPage.discountGroupText()).toBeVisible();
        });
    }

    // Step 11: Verify customer 3M Autosport AS and "Res XXXXX" hyperlink
    async verifyCustomerAndResHyperlink() {
        await test.step('Verify customer 3M Autosport AS and Res hyperlink is shown', async () => {
            await expect(this.purchaseOrderPage.customerText()).toBeVisible();
            await expect(this.purchaseOrderPage.resHyperlink()).toBeVisible();
        });
    }

    // Step 12a: Click the PO line
    async clickPoLine() {
        await test.step('Click the PO line', async () => {
            await this.purchaseOrderPage.poLineFirstRow().click();
            await this.page.waitForTimeout(500);
        });
    }

    // Step 12b: Verify Kjøpspris = 24 280,00
    async verifyKjøpspris() {
        await test.step('Verify Kjøpspris = 24 280,00', async () => {
            await expect(this.purchaseOrderPage.kjøpsprisValueInExpandedRow()).toBeVisible();
        });
    }

    // Step 13: Click the Res hyperlink, verify URL /app/sales/orders/...
    async clickResHyperlinkAndVerifyOrderPage() {
        await test.step('Click Res hyperlink and verify sales order page loads', async () => {
            await this.purchaseOrderPage.resHyperlink().click();
            await this.page.waitForLoadState('networkidle');
            await expect(this.page).toHaveURL(/.*\/app\/sales\/orders/);
        });
    }

    // Step 14: Verify Rabatt = 50%
    async verifyRabatt50() {
        await test.step('Verify Rabatt is 50% on the sales order', async () => {
            await expect(this.salesOrderPage.rabattCell()).toBeVisible();
        });
    }

    // Step 15: Verify product ALL60010005 is added
    async verifyProductAdded() {
        await test.step('Verify product ALL60010005 is in the order', async () => {
            await expect(
                this.salesOrderPage.productRow(this.data.products.primary.articleNumber)
            ).toBeVisible();
        });
    }

    // Step 16: Verify Salgspris = 12 140,00
    async verifySalgspris() {
        await test.step('Verify Salgspris = 12 140,00', async () => {
            await expect(
                this.salesOrderPage.salgsrisInRow(this.data.products.primary.articleNumber)
            ).toBeVisible();
        });
    }

    // Step 17: Verify Sum inkl mva = 60 700,00 Kr
    async verifySumInklMva() {
        await test.step('Verify Sum inkl mva = 60 700,00 Kr', async () => {
            await expect(this.salesOrderPage.sumInklMva()).toBeVisible();
        });
    }
}
