import test from "@playwright/test";
import { PoSearchByPhoneFlow } from "../../test_flows/dekkpro/PoSearchByPhoneFlow";

/**
 * DP2-23193: Purchase Order List — search by customer phone number
 *
 * Verifies that the search field in the Purchase Order List supports
 * filtering by the customer phone number from the linked reservation.
 *
 * Account  : thao@dekkpro.no
 * Customer : 3M Autosport AS
 * Phone    : 23456789  ← verify against demo.dekkpro.no customer record
 */
test("DP2-23193 - Search purchase orders by customer phone number", async ({ page }) => {
    const flow = new PoSearchByPhoneFlow(page);

    // Step 1: Log out
    await flow.logout();

    // Step 2: Login as thao@dekkpro.no
    await flow.loginAsThao();

    // Step 3: Navigate to Purchase Orders list
    await flow.navigateToPurchaseOrders();

    // Step 4: Type customer phone number in the search field
    await flow.searchByPhone();

    // Step 5: Verify matching customer's purchase orders appear in results
    await flow.verifyCustomerAppearsInResults();
});
