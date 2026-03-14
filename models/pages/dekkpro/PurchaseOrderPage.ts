import { Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class PurchaseOrderPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ── Leverandør (Supplier) — PrimeNG p-dropdown/p-select ────────────────
    leverandorCombobox(): Locator {
        return this.page.getByRole('combobox', { name: 'Leverandør' });
    }

    async selectLeverandor(supplierName: string): Promise<void> {
        // Click the combobox to open the dropdown panel
        const combobox = this.leverandorCombobox();
        await combobox.click();
        await this.page.waitForTimeout(500);
        // Type via keyboard to filter (combobox is not a native input)
        await this.page.keyboard.type(supplierName, { delay: 80 });
        await this.page.waitForTimeout(1000);
        // Click the matching option
        const option = this.page.getByRole('option', { name: supplierName })
            .or(this.page.locator('.p-dropdown-item, .p-select-option').filter({ hasText: supplierName }).first());
        await option.first().waitFor({ state: 'visible', timeout: 10000 });
        await option.first().click();
        await this.page.waitForTimeout(500);
    }

    // ── Product search ─────────────────────────────────────────────────────
    productSearchInput(): Locator {
        return this.page.locator('input#productFilter')
            .or(this.page.locator('input[placeholder*="Søk produkter, tjenester"]'))
            .first();
    }

    productTableRows(): Locator {
        return this.page.locator('table tbody tr:visible');
    }

    // Rows inside the advanced-product-lookup popup (virtual scroll)
    productLookupRows(): Locator {
        return this.page.locator('advanced-product-lookup table tbody tr');
    }

    async searchAndSelectProduct(articleNumber: string): Promise<void> {
        const input = this.productSearchInput();
        await input.waitFor({ state: 'visible', timeout: 15000 });
        // Step 1: Open the product search area by clicking the input
        await input.click();
        await this.page.waitForTimeout(300);

        // Step 2: Type the article number
        await input.clear();
        await input.pressSequentially(articleNumber, { delay: 80 });

        // Wait for loading overlay to clear after typing (results will be filtered)
        await this.page.locator('advanced-product-lookup .p-datatable-loading-overlay')
            .waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(1000);

        // Step 3: Click "Vis Alle" (View All) to search across all suppliers
        // Use text locator since the element may not be a native <button>
        const visAlleBtn = this.page.locator('advanced-product-lookup').locator('text=Vis Alle')
            .or(this.page.locator('text=Vis Alle')).first();
        await visAlleBtn.click({ timeout: 10000 });

        // Wait for loading overlay to clear after clicking Vis Alle
        await this.page.locator('advanced-product-lookup .p-datatable-loading-overlay')
            .waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(1000);

        // Step 4: Select the row matching the article number
        const matchingRow = this.page.locator('advanced-product-lookup table tbody tr')
            .filter({ hasText: articleNumber }).first();
        await matchingRow.waitFor({ state: 'visible', timeout: 15000 });

        // Force-click to bypass cdk-virtual-scroll-viewport pointer event interception
        await matchingRow.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // ── Quantity & Save ────────────────────────────────────────────────────
    quantityInput(): Locator {
        // After selecting a product, the inline quantity input appears in the PO lines table
        return this.page.locator('input[formcontrolname="quantity"]')
            .or(this.page.locator('input[formcontrolname="antal"]'))
            .or(this.page.locator('table tbody tr:visible input[type="number"]'))
            .or(this.page.locator('table tbody tr:visible input').first())
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

    // ── Kunde (Customer) — ng-select ─────────────────────────────────────
    kundeInput(): Locator {
        // Kunde is rendered as ng-select: placeholder lives in .ng-placeholder span,
        // not as an HTML placeholder attribute. The typeable input is .ng-input > input.
        return this.page.locator('ng-select')
            .filter({ has: this.page.locator('.ng-placeholder', { hasText: /^Kunde$/i }) })
            .locator('.ng-input input')
            .first();
    }

    async searchCustomer(customerName: string): Promise<void> {
        const input = this.kundeInput();
        await input.waitFor({ state: 'visible', timeout: 15000 });
        await input.click();
        await this.page.waitForTimeout(300);
        await input.clear();
        // Type character by character to trigger ng-select change detection
        await input.pressSequentially(customerName, { delay: 100 });
        await this.page.waitForTimeout(2000);
        // ng-select renders dropdown items as .ng-option rows
        const item = this.page.locator(
            'ng-select .ng-option, .ng-dropdown-panel .ng-option, li[role="option"]'
        ).filter({ hasText: customerName }).first();
        await item.waitFor({ state: 'visible', timeout: 8000 });
        await item.click();
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

    // ── Step 11: After RES — customer + Res hyperlink ──────────────────────
    customerText(): Locator {
        return this.page.getByText('3M Autosport AS').first();
    }

    resHyperlink(): Locator {
        // Link with text like "Res 1002795" next to the customer
        return this.page.locator('a').filter({ hasText: /^Res\s*\d+/i }).first();
    }

    // ── Step 12: Click PO line + verify Kjøpspris ─────────────────────────
    poLineFirstRow(): Locator {
        return this.page.locator('table tbody tr:visible').first();
    }

    kjøpsprisCell(): Locator {
        return this.page.locator('td').filter({ hasText: /24[\s.]280/ }).first()
            .or(this.page.locator('td:has-text("Kjøpspris") + td')).first();
    }

    kjøpsprisValueInExpandedRow(): Locator {
        return this.page.getByText(/24[\s\u00a0]280[,.]00/).first();
    }
}
