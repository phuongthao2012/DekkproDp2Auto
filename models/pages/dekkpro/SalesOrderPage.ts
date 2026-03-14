import { Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class SalesOrderPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ── Step 14: Verify Rabatt 50% ─────────────────────────────────────────
    rabattCell(): Locator {
        // Discount cell in the order line table — "50,00 %" (two decimals)
        return this.page.locator('table tbody tr td')
            .filter({ hasText: /50[,.]?\d*[\s\u00a0]*%/ })
            .first();
    }

    // ── Step 15: Verify product ALL60010005 is added ───────────────────────
    productRow(articleNumber: string): Locator {
        return this.page.locator('table tbody tr').filter({ hasText: articleNumber }).first();
    }

    // ── Step 16: Verify Salgspris 12 140,00 ───────────────────────────────
    salgsrisInRow(articleNumber: string): Locator {
        return this.productRow(articleNumber)
            .locator('td')
            .filter({ hasText: /12[\s\u00a0]140/ })
            .first();
    }

    // ── Step 17: Verify Sum inkl mva 60 700,00 Kr ─────────────────────────
    sumInklMva(): Locator {
        // Use first() to avoid strict-mode violation when multiple elements contain the value
        return this.page.getByText(/60[\s\u00a0]700[,.]00/).first();
    }

    // ── WPR-0049: Delivery address verification ───────────────────────────
    deliveryAddressContaining(text: string): Locator {
        return this.page.locator('*').filter({ hasText: text }).last();
    }

    sumInklMvaRow(): Locator {
        return this.page.locator('tr, div')
            .filter({ hasText: /inkl.*mva/i })
            .filter({ hasText: /60[\s\u00a0]700/ })
            .first();
    }
}
