import test, { expect, Page } from "@playwright/test";
import LoginPage from "../../models/pages/dekkpro/LoginPage";
import NewOrderPage from "../../models/pages/dekkpro/NewOrderPage";
import SalesOrderPage from "../../models/pages/dekkpro/SalesOrderPage";
import { alternativeAddressData } from "../../test_data/dekkpro/PurchaseOrderData";
import { THAO_USER } from "../../test_data/dekkpro/Credentials";

export class AlternativeAddressFlow {

    private loginPage: LoginPage;
    private newOrderPage: NewOrderPage;
    private salesOrderPage: SalesOrderPage;
    private data = alternativeAddressData;

    constructor(private page: Page) {
        this.loginPage = new LoginPage(page);
        this.newOrderPage = new NewOrderPage(page);
        this.salesOrderPage = new SalesOrderPage(page);
    }

    // Step 1: Log out — clear all auth state then navigate to force re-login
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

    // Step 3: Navigate to new order page
    async navigateToNewOrder() {
        await test.step('Navigate to new order page', async () => {
            await this.newOrderPage.navigate();
            await expect(this.page).toHaveURL(/.*\/app\/sales\/new-order/);
        });
    }

    // Step 4: Select primary customer Bileko Car Parts Norway AS
    async selectPrimaryCustomer() {
        await test.step(`Select customer ${this.data.customer.primary}`, async () => {
            const customerSection = this.newOrderPage.customerSection();
            await customerSection.searchAndSelectCustomer(this.data.customer.primary);
            await expect(customerSection.customerSelect()).toContainText(this.data.customer.primary);
        });
    }

    // Step 5: Expand customer card to view delivery addresses
    async expandCustomerCard() {
        await test.step('Expand customer card to view delivery addresses', async () => {
            const customerSection = this.newOrderPage.customerSection();
            await customerSection.expandCustomerCard();
        });
    }

    // Step 6: Search and select alternative delivery customer K 2000 Bilpleie Bergen
    async selectAlternativeDeliveryCustomer() {
        await test.step(`Search alternative delivery customer: ${this.data.customer.alternativeDelivery}`, async () => {
            const customerSection = this.newOrderPage.customerSection();
            await customerSection.searchAlternativeDeliveryCustomer(this.data.customer.alternativeDelivery);
            await expect(customerSection.alternativeDeliverySelect()).toContainText(
                this.data.customer.alternativeDelivery
            );
        });
    }

    // Step 7: Add a product to the order
    async addProduct() {
        await test.step('Add product to order', async () => {
            const productSection = this.newOrderPage.productSection();
            await productSection.searchProduct(this.data.product.searchTerm);

            const rows = productSection.productTableRows();
            await rows.first().click();

            const antallInput = this.page.locator('td:has-text("Antall") input')
                .or(this.page.locator('td').filter({ hasText: /^Antall/ }).locator('input'))
                .first();
            await antallInput.waitFor({ state: 'visible', timeout: 10000 });
            await antallInput.fill('1');

            await this.page.locator('button').filter({ hasText: /^Lagre$/ }).first().click();
            await this.page.waitForTimeout(1500);
        });
    }

    // Step 8: Click Faktura to create invoice
    async clickFaktura() {
        await test.step('Click Faktura to create invoice', async () => {
            const actionButtons = this.newOrderPage.actionButtons();
            await expect(actionButtons.fakturaButton()).toBeVisible();
            await actionButtons.clickFaktura();
            await this.page.waitForLoadState('networkidle').catch(() => {});
        });
    }

    // Step 9: Verify alternative delivery address on the invoice/order
    async verifyDeliveryAddress() {
        await test.step(`Verify delivery address: ${this.data.expectedAddress.street} ${this.data.expectedAddress.postalCity}`, async () => {
            await expect(this.page.getByText(this.data.expectedAddress.street)).toBeVisible();
            await expect(this.page.getByText(this.data.expectedAddress.postalCity)).toBeVisible();
        });
    }
}
