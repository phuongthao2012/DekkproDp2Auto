import { Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class PurchaseOrderPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ── Leverandør (Supplier) ──────────────────────────────────────────────
    leverandorInput(): Locator {
        return this.page.locator('p-autocomplete[formcontrolname="supplier"] input')
            .or(this.page.locator('input[placeholder*="Leverandør"]'))
            .or(this.page.locator('label:has-text("Leverandør") ~ * input'))
            .first();
    }

    async selectLeverandor(supplierName: string): Promise<void> {
        const input = this.leverandorInput();
        await input.click();
        await input.fill(supplierName);
        await this.page.waitForTimeout(800);
        await this.page.locator('.p-autocomplete-item', { hasText: supplierName }).first().click();
        await this.page.waitForTimeout(500);
    }

    // ── Product search ─────────────────────────────────────────────────────
    productSearchInput(): Locator {
        return this.page.locator('input#productFilter')
            .or(this.page.locator('input[placeholder*="Søk produkter"]'))
            .first();
    }

    productTableRows(): Locator {
        return this.page.locator('table tbody tr:visible');
    }

    async searchAndSelectProduct(articleNumber: string): Promise<void> {
        const input = this.productSearchInput();
        await input.waitFor({ state: 'visible', timeout: 15000 });
        await input.clear();
        await input.fill(articleNumber);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);
        await this.productTableRows().first().click();
    }

    // ── Quantity & Save ────────────────────────────────────────────────────
    quantityInput(): Locator {
        return this.page.locator('td:has-text("Antall") input')
            .or(this.page.locator('input[formcontrolname="quantity"]'))
            .or(this.page.locator('input[name*="antall"]'))
            .first();
    }

    saveButton(): Locator {
        return this.page.locator('button').filter({ hasText: /^Lagre$/ }).first();
    }

    async fillQuantityAndSave(quantity: number): Promise<void> {
        const input = this.quantityInput();
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.clear();
        await input.fill(String(quantity));
        await this.saveButton().click();
        await this.page.waitForTimeout(1500);
    }

    // ── Kunde (Customer) ───────────────────────────────────────────────────
    kundeInput(): Locator {
        return this.page.locator('p-autocomplete[formcontrolname="customer"] input')
            .or(this.page.locator('input[placeholder*="Kunde"]'))
            .or(this.page.locator('label:has-text("Kunde") ~ * input'))
            .first();
    }

    async searchCustomer(customerName: string): Promise<void> {
        const input = this.kundeInput();
        await input.waitFor({ state: 'visible', timeout: 15000 });
        await input.click();
        await input.fill(customerName);
        await this.page.waitForTimeout(800);
        await this.page.locator('.p-autocomplete-item', { hasText: customerName }).first().click();
        await this.page.waitForTimeout(500);
    }

    // ── RES button ─────────────────────────────────────────────────────────
    resButton(): Locator {
        return this.page.getByRole('button', { name: /^RES$/i });
    }

    async clickRes(): Promise<void> {
        await this.resButton().click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1500);
    }

    // ── Order line verification ────────────────────────────────────────────
    orderLineRowByArticle(articleNumber: string): Locator {
        return this.page.locator('table tbody tr').filter({ hasText: articleNumber });
    }

    salePriceInRow(articleNumber: string): Locator {
        return this.orderLineRowByArticle(articleNumber)
            .locator('td')
            .filter({ hasText: /\d[\d\s,\.]+/ })
            .nth(3);
    }

    discountInRow(articleNumber: string): Locator {
        return this.orderLineRowByArticle(articleNumber)
            .locator('td')
            .filter({ hasText: /%/ })
            .first();
    }

    discountGroupText(): Locator {
        return this.page.getByText(/Gruppe 3 - Forhandlere/i);
    }
}
