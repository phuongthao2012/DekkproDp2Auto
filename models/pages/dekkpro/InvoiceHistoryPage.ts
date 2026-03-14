import { Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class InvoiceHistoryPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    async navigate(): Promise<void> {
        await this.page.goto('/app/invoice/invoice-history');
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(2000);
    }

    tab(name: string): Locator {
        return this.page.getByRole('tab', { name });
    }

    tableRows(): Locator {
        return this.page.locator('p-table tbody tr:visible');
    }

    rowCheckbox(row: Locator): Locator {
        return row.locator('td:first-child .p-checkbox');
    }

    headerCheckAll(): Locator {
        return this.page.locator('p-table thead tr:visible th:first-child .p-checkbox').first();
    }

    confirmUpdateButton(): Locator {
        return this.page.getByRole('button', { name: 'Bekreft oppdatering' });
    }
}
