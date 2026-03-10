import test from "@playwright/test";
import { InvoiceHistoryFlow } from "../../test_flows/dekkpro/InvoiceHistoryFlow";

test("Dekkpro - Invoice History Row Selection", async ({ page }) => {
    const flow = new InvoiceHistoryFlow(page);

    // Step 1: Launch invoice page
    await flow.navigateToInvoiceHistory();

    // Step 2: Select Utestående tab
    await flow.selectUtestaaendeTab();

    // Step 3: Select Oppdater tab
    await flow.selectOppdaterTab();

    // Step 4: Select Utestående tab again
    await flow.selectUtestaaendeTab();

    // Step 5: Select 3 first rows
    await flow.selectFirstThreeRows();

    // Step 6: Select Oppdater tab
    await flow.selectOppdaterTab();

    // Step 7: Observe 3 selected rows display with check all = false
    await flow.verifyOppdaterShowsThreeRows();
    await flow.verifyCheckAllIsFalse();

    // Step 8: Select one by one 3 rows
    await flow.selectEachRowIndividually();

    // Step 9: Verify Bekreft oppdatering button is shown
    await flow.verifyConfirmUpdateButtonVisible();
});
