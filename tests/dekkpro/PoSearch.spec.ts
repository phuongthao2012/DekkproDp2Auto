import test from "@playwright/test";
import { PoSearchFlow } from "../../test_flows/dekkpro/PoSearchFlow";

/**
 * DP2-23193: Purchase Order List — search by vendor name
 *
 * Account  : thao@dekkpro.no
 * Customer : 3M Autosport AS
 */
test("DP2-23193 - Search purchase orders by Vendor name", async ({ page }) => {
    const flow = new PoSearchFlow(page);

    await flow.logout();
    await flow.loginAsThao();
    await flow.navigateToPurchaseOrders();
    await flow.searchByVendorName();
    await flow.verifyVendorNameResults();
});

/**
 * DP2-23193: Purchase Order List — search by customer mobile phone / telephone
 *
 * Account  : thao@dekkpro.no
 * Customer : 3M Autosport AS
 * PO       : 99900
 * Mobile   : 4784948
 * Phone    : 880404
 */
test("DP2-23193 - Search purchase orders by Customer mobile phone, telephone", async ({ page }) => {
    const flow = new PoSearchFlow(page);

    await flow.logout();
    await flow.loginAsThao();
    await flow.navigateToPurchaseOrders();

    // Step 1: Find PO 99900 that has customer "3M Autosport AS"
    await flow.searchByPONumber();

    // Step 3: Type full mobile number 4784948
    await flow.searchByFullMobile();

    // Step 4: Type partial mobile number 84948
    await flow.searchByPartialMobile();

    // Step 5: Type phone number 880404
    await flow.searchByPhone();
});
