import { Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class PurchaseOrdersPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    async navigate(): Promise<void> {
        await this.page.goto('/app/purchasing/purchase-orders');
        await this.page.waitForLoadState('networkidle');
    }

    newOrderButton(): Locator {
        return this.page.getByRole('button', { name: 'Ny bestilling' });
    }

    async clickNyBestilling(): Promise<void> {
        await this.newOrderButton().click();
        await this.page.waitForURL('**/app/purchasing/new-purchase-order**', { timeout: 15000 });
        await this.page.waitForLoadState('networkidle');
    }
}
