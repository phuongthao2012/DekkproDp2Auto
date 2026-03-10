import test, { expect, Page } from "@playwright/test";
import InvoiceHistoryPage from "../../models/pages/dekkpro/InvoiceHistoryPage";

export class InvoiceHistoryFlow {

    private invoiceHistoryPage: InvoiceHistoryPage;

    constructor(private page: Page) {
        this.invoiceHistoryPage = new InvoiceHistoryPage(page);
    }

    async navigateToInvoiceHistory() {
        await test.step('Navigate to Invoice History page', async () => {
            await this.invoiceHistoryPage.navigate();
            await expect(this.page).toHaveURL(/.*\/app\/invoice\/invoice-history/);
        });
    }

    async selectUtestaaendeTab() {
        await test.step('Select Utestående tab', async () => {
            await this.invoiceHistoryPage.tab('Utestående').click();
            await this.page.waitForLoadState('networkidle');
        });
    }

    async selectOppdaterTab() {
        await test.step('Select Oppdater tab', async () => {
            await this.invoiceHistoryPage.tab('Oppdater').click();
            await this.page.waitForLoadState('networkidle');
        });
    }

    async selectFirstThreeRows() {
        await test.step('Select first 3 rows', async () => {
            const rows = this.invoiceHistoryPage.tableRows();
            await expect(rows.first()).toBeVisible();
            for (let i = 0; i < 3; i++) {
                await this.invoiceHistoryPage.rowCheckbox(rows.nth(i)).click();
            }
        });
    }

    async verifyOppdaterShowsThreeRows() {
        await test.step('Verify Oppdater tab shows 3 rows', async () => {
            const rows = this.invoiceHistoryPage.tableRows();
            await expect(rows).toHaveCount(3);
        });
    }

    async verifyCheckAllIsFalse() {
        await test.step('Verify check-all is not checked (no rows selected yet)', async () => {
            const headerCheckAll = this.invoiceHistoryPage.headerCheckAll();
            await expect(headerCheckAll).not.toHaveClass(/p-checkbox-checked/);
        });
    }

    async selectEachRowIndividually() {
        await test.step('Select each of the 3 rows one by one', async () => {
            const rows = this.invoiceHistoryPage.tableRows();
            for (let i = 0; i < 3; i++) {
                await this.invoiceHistoryPage.rowCheckbox(rows.nth(i)).click();
            }
        });
    }

    async verifyConfirmUpdateButtonVisible() {
        await test.step('Verify Bekreft oppdatering button is visible', async () => {
            await expect(this.invoiceHistoryPage.confirmUpdateButton()).toBeVisible();
        });
    }
}
