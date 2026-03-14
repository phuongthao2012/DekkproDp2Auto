import { Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class PurchaseOrderListPage extends BasePage {

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

    // ── Search (DP2-23193) ──────────────────────────────────────────────────

    searchInput(): Locator {
        return this.page.getByPlaceholder('Vennligst oppgi minst 3 tegn').last();
    }

    async searchFor(text: string): Promise<void> {
        const input = this.searchInput();
        await input.click({ force: true, timeout: 15000 });
        await input.clear({ force: true });
        await input.pressSequentially(text, { delay: 80 });
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
    }

    async clearSearch(): Promise<void> {
        const input = this.searchInput();
        await input.click({ force: true, timeout: 15000 });
        await input.clear({ force: true });
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
    }

    rowContainingPOLink(poNumber: string): Locator {
        return this.page.locator('p-table tbody tr').filter({
            has: this.page.locator('a', { hasText: poNumber }),
        }).first();
    }

    tableRows(): Locator {
        return this.page.locator('p-table tbody tr:visible');
    }

    rowContainingCustomer(customerName: string): Locator {
        return this.page.locator('p-table tbody tr').filter({ hasText: customerName }).first();
    }
}
