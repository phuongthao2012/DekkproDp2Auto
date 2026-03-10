import test from "@playwright/test";
import { FullResSalePriceFlow } from "../../test_flows/dekkpro/FullResSalePriceFlow";

/**
 * WPR-0048: Check full res sale price
 *
 * Verifies that when making a FULL RES from a manual purchase order,
 * the sale prices and discounts are correctly applied based on
 * the customer's best price / discount group.
 *
 * - Customer: 3M Autosport AS (Gruppe 3 - Forhandlere, 50% discount)
 * - Product ALL60010005: sale price 12,140 ex VAT, 50% discount
 * - Product BIDSTA20A/24: sale price 15,75 ex VAT, 37% discount
 */
test("WPR-0048 - Check full res sale price", async ({ page }) => {
    const flow = new FullResSalePriceFlow(page);

    // Step 1: Create a manual PO with product ALL60010005 (env. tax 500)
    await flow.createManualPurchaseOrder();

    // Step 2: Click FULL RES on the PO
    await flow.clickFullRes();

    // Step 3: Select customer 3M Autosport AS
    await flow.selectCustomerOnFullRes();

    // Step 4: Verify sale price 12,140 (no VAT) and 50% discount for ALL60010005
    await flow.verifySalePriceAndDiscountForPrimary();

    // Step 5: Verify discount group is Gruppe 3 - Forhandlere
    await flow.verifyDiscountGroup();

    // Step 6: Add same product again — verify price stays 12,140 with 50% discount
    await flow.addSameProductAndVerifyPrice();

    // Step 7: Add different product BIDSTA20A/24 — verify 37% discount, sale price 15,75
    await flow.addDifferentProductAndVerifyPrice();
});
