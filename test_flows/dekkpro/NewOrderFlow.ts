import test, { expect, Page } from "@playwright/test";
import { DekkproOrderData } from "../../test_data/dekkpro/OrderDataType";
import NewOrderPage from "../../models/pages/dekkpro/NewOrderPage";

export class NewOrderFlow {

    private newOrderPage: NewOrderPage;

    constructor(private page: Page, private orderData: DekkproOrderData) {
        this.page = page;
        this.orderData = orderData;
        this.newOrderPage = new NewOrderPage(page);
    }

    async navigateToNewOrder() {
        await test.step('Navigate to New Order page', async () => {
            await this.newOrderPage.navigate();
            await expect(this.page).toHaveURL(/.*\/app\/sales\/new-order/);
            await expect(this.newOrderPage.productSection().productSearchInput()).toBeVisible();
        });
    }

    async selectCustomer() {
        await test.step('Search and select customer', async () => {
            const { name, contact, deliveryAddress, info } = this.orderData.customer;
            const customerSection = this.newOrderPage.customerSection();

            await customerSection.searchAndSelectCustomer(name);
            await expect(customerSection.customerSelect()).toContainText(name);

            if (contact) {
                await customerSection.selectContact(contact);
            }
            if (deliveryAddress) {
                await customerSection.selectDeliveryAddress(deliveryAddress);
            }
            if (info) {
                await customerSection.fillCustomerInfo(info);
            }
        });
    }

    async searchAndAddProducts() {
        await test.step('Search and add products', async () => {
            const { searchTerm, season, category, sourceTab } = this.orderData.product;
            const productSection = this.newOrderPage.productSection();

            if (season) {
                await productSection.selectSeasonFilter(season);
            }
            if (category) {
                await productSection.selectCategoryFilter(category);
            }
            if (sourceTab) {
                await productSection.selectProductSourceTab(sourceTab);
            }

            // Dismiss any SweetAlert dialog that may have appeared
            const swalOk = this.page.locator('.swal2-confirm');
            if (await swalOk.isVisible().catch(() => false)) {
                await swalOk.click();
                await this.page.waitForTimeout(500);
            }

            await productSection.searchProduct(searchTerm);
            await expect(productSection.productSearchInput()).toHaveValue(searchTerm);

            // Click first product row to expand the inline add form
            const rows = productSection.productTableRows();
            await rows.first().click();

            // Fill quantity (Antall *) in the expanded inline form
            const quantity = this.orderData.product.quantity ?? 1;
            const antallInput = this.page.locator('td:has-text("Antall") input')
                .or(this.page.locator('td').filter({ hasText: /^Antall/ }).locator('input'))
                .first();
            await antallInput.waitFor({ state: 'visible', timeout: 10000 });
            await antallInput.fill(String(quantity));

            // Click Lagre (not "Lagre & Lukk")
            await this.page.locator('button').filter({ hasText: /^Lagre$/ }).first().click();
            await this.page.waitForTimeout(1500);
        });
    }

    async verifyOrderLine() {
        await test.step('Verify order line is added', async () => {
            const orderLineTable = this.newOrderPage.orderLineTable();
            const hasLines = await orderLineTable.hasOrderLines();
            expect(hasLines).toBeTruthy();
        });
    }

    async verifyPricing() {
        await test.step('Verify pricing fields are populated', async () => {
            const priceSummary = this.newOrderPage.priceSummary();
            await expect(priceSummary.totalBeforeTax()).toBeVisible();
            await expect(priceSummary.totalAfterTax()).toBeVisible();

            const totalBeforeTax = await priceSummary.getTotalBeforeTax();
            expect(totalBeforeTax).not.toBe('');
        });
    }

    async selectPrintMode() {
        await test.step('Select print mode', async () => {
            await this.newOrderPage.selectPrintMode(this.orderData.printMode);
        });
    }

    async submitOrder() {
        await test.step('Submit order', async () => {
            const actionButtons = this.newOrderPage.actionButtons();
            const actionMap: Record<string, () => Promise<void>> = {
                'Tilbud': () => actionButtons.clickTilbud(),
                'Reservasjon': () => actionButtons.clickReservasjon(),
                'Faktura': () => actionButtons.clickFaktura(),
                'Bankkort': () => actionButtons.clickBankkort(),
                'Lagre & Lukk': () => actionButtons.clickLagreOgLukk(),
            };
            await actionMap[this.orderData.submitAction]();
            await this.page.waitForTimeout(2000);
        });
    }
}
