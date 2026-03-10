import { Locator } from "@playwright/test";

export default class OrderLineTableComponent {

    public static readonly LOCATOR = 'body';

    constructor(private component: Locator) {
        this.component = component;
    }

    orderLineTable(): Locator {
        // Angular table uses <td> for headers (not <th>), so filter by td content
        return this.component.page().locator('table')
            .filter({ has: this.component.page().locator('td:has-text("Salgspris")') })
            .first();
    }

    async getOrderLineRows(): Promise<Locator[]> {
        // Table structure: rowgroup 1 (header) + rowgroup(s) (data) + rowgroup (summary)
        // Count all tr, then exclude header row (first) and summary row (last)
        const allRows = await this.orderLineTable().locator('tr').all();
        return allRows.slice(1, allRows.length - 1);
    }

    async getOrderLineCount(): Promise<number> {
        const rows = await this.getOrderLineRows();
        return rows.length;
    }

    async hasOrderLines(): Promise<boolean> {
        const count = await this.getOrderLineCount();
        return count > 0;
    }
}
