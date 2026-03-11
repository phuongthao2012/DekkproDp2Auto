import test from "@playwright/test";
import { AlternativeAddressFlow } from "../../test_flows/dekkpro/AlternativeAddressFlow";

/**
 * WPR-0049: Check Alternative Address
 *
 * Account  : thao@dekkpro.no
 * Customer : Bileko Car Parts Norway AS (240612)
 * Alt Addr : K 2000 Bilpleie Bergen avd Dekk & Felg
 *            Conrad Mohrsvei 25, 5072 Bergen — mob: 55206110
 * Bug refs : DP2-4191; DP2-17032; DP2-17971
 */
test("WPR-0049 - Check alternative address", async ({ page }) => {
    const flow = new AlternativeAddressFlow(page);

    // Step 1: Log out
    await flow.logout();

    // Step 2: Login as thao@dekkpro.no
    await flow.loginAsThao();

    // Step 3: Navigate to new order page
    await flow.navigateToNewOrder();

    // Step 4: Select primary customer Bileko Car Parts Norway AS (240612)
    await flow.selectPrimaryCustomer();

    // Step 5: Expand customer card to view delivery addresses
    await flow.expandCustomerCard();

    // Step 6: Search and select alternative delivery customer K 2000 Bilpleie Bergen avd Dekk & Felg
    await flow.selectAlternativeDeliveryCustomer();

    // Step 7: Add product to order
    await flow.addProduct();

    // Step 8: Click Faktura to create invoice
    await flow.clickFaktura();

    // Step 9: Verify delivery address Conrad Mohrsvei 25, 5072 Bergen appears on the invoice
    await flow.verifyDeliveryAddress();
});
