import test from "@playwright/test";
import { SubmitApiOrderFlow } from "../../test_flows/dekkpro/SubmitApiOrderFlow";

/**
 * WPR-0063: Submit API and check order
 *
 * 1. Use access token for thao@dekkpro.no
 * 2. POST to /api/Dekkpro/PostOrder with random WSID
 * 3. Verify response contains OrderNumber, ProductSkuId, SalePrice 1457.50
 * 4. Save the returned order number
 * 5. Verify order appears in the UI
 */
test("WPR-0063 - Submit API and check order", async ({ page, request }) => {
    const flow = new SubmitApiOrderFlow(page, request);

    // Steps 1-4: Submit PostOrder API, verify response, save order number
    await flow.submitOrder();

    // Step 5: Navigate to sales orders page
    await flow.navigateToSalesOrders();

    // Step 6: Click reset filter
    await flow.resetFilter();

    // Step 7: Select all Varelager
    await flow.selectAllVarelager();

    // Step 8: Search by API order number and verify
    await flow.searchAndVerifyOrder();
});
