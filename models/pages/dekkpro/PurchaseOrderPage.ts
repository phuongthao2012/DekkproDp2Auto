import { Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class PurchaseOrderPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    async navigate(): Promise<void> {
        await this.page.goto('/app/innkjop/manuell-innkjop');
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToNewManualPO(): Promise<void> {
        await this.page.goto('/app/innkjop/manuell-innkjop');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1500);
    }

    productSearchInput(): Locator {
        return this.page.locator('input#productFilter').or(this.page.locator('input[placeholder*="Søk"]')).first();
    }

    productTableRows(): Locator {
        return this.page.locator('table tbody tr:visible');
    }

    fullResButton(): Locator {
        return this.page.getByRole('button', { name: /FULL RES/i });
    }

    async searchAndAddProduct(articleNumber: string, quantity: number = 1): Promise<void> {
        const input = this.productSearchInput();
        await input.clear();
        await input.fill(articleNumber);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);

        await this.productTableRows().first().click();

        const antallInput = this.page.locator('td:has-text("Antall") input')
            .or(this.page.locator('input[name*="antall"]'))
            .first();
        await antallInput.waitFor({ state: 'visible', timeout: 10000 });
        await antallInput.fill(String(quantity));

        await this.page.locator('button').filter({ hasText: /^Lagre$/ }).first().click();
        await this.page.waitForTimeout(1500);
    }

    async clickFullRes(): Promise<void> {
        await this.fullResButton().click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1500);
    }
}
