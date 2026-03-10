import test from "@playwright/test";
import { FullResSalePriceFlow } from "../../test_flows/dekkpro/FullResSalePriceFlow";

/**
 * WPR-0048: Check full res sale price
 *
 * Account   : thao@dekkpro.no
 * Customer  : 3M Autosport AS (Gruppe 3 - Forhandlere, 50% discount)
 * Product   : ALL60010005 — Salgspris 12 140,00 ex VAT, Kjøpspris 24 280,00
 * Qty       : 4  →  Sum inkl mva 60 700,00 Kr
 */
test("WPR-0048 - Check full res sale price", async ({ page }) => {
    const flow = new FullResSalePriceFlow(page);

    // Step 1: Log out
    await flow.logout();

    // Step 2: Login as thao@dekkpro.no / Th@0Th@0
    await flow.loginAsThao();

    // Step 3: Navigate to purchase orders
    await flow.navigateToPurchaseOrders();

    // Step 4: Click "Ny bestilling"
    await flow.clickNyBestilling();

    // Step 5: Verify new purchase order page URL
    await flow.verifyNewPurchaseOrderPage();

    // Step 6: Select Leverandør: Michelin Nordic AB
    await flow.selectLeverandor();

    // Step 7 + 8: Search product ALL60010005, select, qty=4, save
    await flow.searchAddProductWithQuantity();

    // Step 9: Search customer "3M Autosport AS" in Kunde field
    await flow.searchCustomer();

    // Step 10: Click RES
    await flow.clickRes();

    // Step 11: Verify customer 3M Autosport AS and "Res XXXXX" hyperlink
    await flow.verifyCustomerAndResHyperlink();

    // Step 12: Click the PO line
    await flow.clickPoLine();

    // Step 12: Verify Kjøpspris = 24 280,00
    await flow.verifyKjøpspris();

    // Step 13: Click Res hyperlink → verify /app/sales/orders URL
    await flow.clickResHyperlinkAndVerifyOrderPage();

    // Step 14: Verify Rabatt = 50%
    await flow.verifyRabatt50();

    // Step 15: Verify product ALL60010005 is added
    await flow.verifyProductAdded();

    // Step 16: Verify Salgspris = 12 140,00
    await flow.verifySalgspris();

    // Step 17: Verify Sum inkl mva = 60 700,00 Kr
    await flow.verifySumInklMva();
});
