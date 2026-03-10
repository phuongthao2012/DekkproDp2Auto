import test, { expect, Page } from "@playwright/test";
import PurchaseOrderPage from "../../models/pages/dekkpro/PurchaseOrderPage";
import FullResOrderPage from "../../models/pages/dekkpro/FullResOrderPage";
import { fullResSalePriceData } from "../../test_data/dekkpro/PurchaseOrderData";

export class FullResSalePriceFlow {

    private purchaseOrderPage: PurchaseOrderPage;
    private fullResOrderPage: FullResOrderPage;
    private data = fullResSalePriceData;

    constructor(private page: Page) {
        this.purchaseOrderPage = new PurchaseOrderPage(page);
        this.fullResOrderPage = new FullResOrderPage(page);
    }

    async createManualPurchaseOrder() {
        await test.step('Create manual PO with product ALL60010005 (env. tax 500)', async () => {
            await this.purchaseOrderPage.navigateToNewManualPO();
            await expect(this.page).toHaveURL(/.*\/app\/innkjop\/manuell-innkjop/);
            await this.purchaseOrderPage.searchAndAddProduct(this.data.products.primary.articleNumber, 1);
        });
    }

    async clickFullRes() {
        await test.step('Click FULL RES button on the purchase order', async () => {
            await expect(this.purchaseOrderPage.fullResButton()).toBeVisible();
            await this.purchaseOrderPage.clickFullRes();
        });
    }

    async selectCustomerOnFullRes() {
        await test.step('Select customer 3M Autosport AS on FULL RES order', async () => {
            await this.fullResOrderPage.selectCustomer(this.data.customer.name);
            await expect(this.page.getByText(this.data.customer.name)).toBeVisible();
        });
    }

    async verifySalePriceAndDiscountForPrimary() {
        await test.step('Verify sale price 12,140 with 50% discount for ALL60010005', async () => {
            const primaryRow = this.fullResOrderPage.productRowByArticle(this.data.products.primary.articleNumber);
            await expect(primaryRow).toBeVisible();

            // Verify discount is 50%
            const discountCell = this.fullResOrderPage.discountInRow(this.data.products.primary.articleNumber);
            await expect(discountCell).toContainText(this.data.products.primary.expectedDiscount);

            // Verify sale price no VAT is 12,140
            const salePriceCell = this.fullResOrderPage.salePriceInRow(this.data.products.primary.articleNumber);
            await expect(salePriceCell).toContainText(this.data.products.primary.expectedSalePriceExVat);
        });
    }

    async verifyDiscountGroup() {
        await test.step('Verify discount group is Gruppe 3 - Forhandlere', async () => {
            await expect(this.fullResOrderPage.discountGroupText()).toBeVisible();
        });
    }

    async addSameProductAndVerifyPrice() {
        await test.step('Add same product ALL60010005 again and verify price stays 12,140 with 50%', async () => {
            await this.fullResOrderPage.searchAndAddProductOnOrder(this.data.products.primary.articleNumber);

            const rows = this.fullResOrderPage.productRowByArticle(this.data.products.primary.articleNumber);
            await expect(rows.last()).toBeVisible();

            const salePriceCell = rows.last().locator('td').filter({ hasText: /\d/ }).nth(3);
            await expect(salePriceCell).toContainText(this.data.products.primary.expectedSalePriceExVat);

            const discountCell = rows.last().locator('td').filter({ hasText: /%/ }).first();
            await expect(discountCell).toContainText(this.data.products.primary.expectedDiscount);
        });
    }

    async addDifferentProductAndVerifyPrice() {
        await test.step('Add product BIDSTA20A/24 and verify 37% discount with sale price 15,75', async () => {
            await this.fullResOrderPage.searchAndAddProductOnOrder(this.data.products.secondary.articleNumber);

            const secondaryRow = this.fullResOrderPage.productRowByArticle(this.data.products.secondary.articleNumber);
            await expect(secondaryRow).toBeVisible();

            // Verify discount is 37%
            const discountCell = this.fullResOrderPage.discountInRow(this.data.products.secondary.articleNumber);
            await expect(discountCell).toContainText(this.data.products.secondary.expectedDiscount);

            // Verify sale price no VAT is 15,75
            const salePriceCell = this.fullResOrderPage.salePriceInRow(this.data.products.secondary.articleNumber);
            await expect(salePriceCell).toContainText(this.data.products.secondary.expectedSalePriceExVat);
        });
    }
}
