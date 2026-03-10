import test from "@playwright/test";
import { FullResSalePriceFlow } from "../../test_flows/dekkpro/FullResSalePriceFlow";

/**
 * WPR-0048: Check full res sale price
 *
 * Verifies that when making a RES from a manual purchase order,
 * the sale prices and discounts are correctly applied based on
 * the customer's best price / discount group.
 *
 * Account: thao@dekkpro.no
 * Customer: 3M Autosport AS (Gruppe 3 - Forhandlere, 50% discount)
 * Product ALL60010005: sale price 12,140 ex VAT, 50% discount
 */
test("WPR-0048 - Check full res sale price", async ({ page }) => {
    const flow = new FullResSalePriceFlow(page);

    // Step 1: Log out
    await flow.logout();

    // Step 2: Login as thao@dekkpro.no
    await flow.loginAsThao();

    // Step 3: Navigate to purchase orders
    await flow.navigateToPurchaseOrders();

    // Step 4: Click "Ny bestilling"
    await flow.clickNyBestilling();

    // Step 5: Verify new purchase order page is shown
    await flow.verifyNewPurchaseOrderPage();

    // Step 6: Select Leverandør: Michelin Nordic AB
    await flow.selectLeverandor();

    // Step 7 + 8: Search product ALL60010005, select, fill qty=4, save
    await flow.searchAddProductWithQuantity();

    // Step 9: Search customer "3M Autosport AS" in Kunde field
    await flow.searchCustomer();

    // Step 10: Click RES
    await flow.clickRes();

    // Verify: Sale price 12,140 (no VAT) and 50% discount
    await flow.verifySalePriceAndDiscountForPrimary();

    // Verify: Discount group Gruppe 3 - Forhandlere
    await flow.verifyDiscountGroup();
});
