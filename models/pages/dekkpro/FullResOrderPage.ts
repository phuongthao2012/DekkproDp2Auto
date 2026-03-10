import { Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class FullResOrderPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    customerSelect(): Locator {
        return this.page.locator('p-autocomplete').filter({ hasText: '' }).first()
            .or(this.page.locator('[formcontrolname="customer"]'))
            .first();
    }

    async selectCustomer(customerName: string): Promise<void> {
        const input = this.page.locator('p-autocomplete input').first()
            .or(this.page.locator('input[placeholder*="kunde"]').first());
        await input.clear();
        await input.fill(customerName);
        await this.page.waitForTimeout(800);
        await this.page.locator('.p-autocomplete-item', { hasText: customerName }).first().click();
        await this.page.waitForTimeout(500);
    }

    orderLineTable(): Locator {
        return this.page.locator('table').filter({ has: this.page.locator('td:has-text("Salgspris")') }).first();
    }

    orderLineRows(): Locator {
        return this.orderLineTable().locator('tbody tr:visible');
    }

    salePriceCell(row: Locator): Locator {
        return row.locator('td').filter({ hasText: /^\d/ }).nth(3);
    }

    discountCell(row: Locator): Locator {
        return row.locator('td').filter({ hasText: /%/ }).first();
    }

    discountGroupText(): Locator {
        return this.page.getByText(/Gruppe 3 - Forhandlere/i);
    }

    salePriceByLabel(): Locator {
        return this.page.locator('td:has-text("Salgspris") + td, [data-field="salePriceExVat"]').first();
    }

    productRowByArticle(articleNumber: string): Locator {
        return this.page.locator('table tbody tr').filter({ hasText: articleNumber });
    }

    salePriceInRow(articleNumber: string): Locator {
        return this.productRowByArticle(articleNumber).locator('td').filter({ hasText: /\d/ }).nth(3);
    }

    discountInRow(articleNumber: string): Locator {
        return this.productRowByArticle(articleNumber).locator('td').filter({ hasText: /%/ }).first();
    }

    async searchAndAddProductOnOrder(articleNumber: string): Promise<void> {
        const input = this.page.locator('input#productFilter').or(this.page.locator('input[placeholder*="Søk"]')).first();
        await input.clear();
        await input.fill(articleNumber);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);

        await this.page.locator('table tbody tr:visible').first().click();

        const antallInput = this.page.locator('td:has-text("Antall") input').first();
        await antallInput.waitFor({ state: 'visible', timeout: 10000 });
        await antallInput.fill('1');

        await this.page.locator('button').filter({ hasText: /^Lagre$/ }).first().click();
        await this.page.waitForTimeout(1500);
    }
}
