import test from "@playwright/test";
import { NewOrderFlow } from "../../test_flows/dekkpro/NewOrderFlow";
import { defaultOrderData } from "../../test_data/dekkpro/OrderData";
import { PrintModes } from "../../test_data/dekkpro/OrderData";
import { DekkproOrderData } from "../../test_data/dekkpro/OrderDataType";

test("Dekkpro - Full New Order Flow", async ({ page }) => {
    const orderFlow = new NewOrderFlow(page, defaultOrderData);
    await orderFlow.navigateToNewOrder();
    await orderFlow.selectCustomer();
    await orderFlow.searchAndAddProducts();
    await orderFlow.verifyOrderLine();
    await orderFlow.verifyPricing();
    await orderFlow.selectPrintMode();
    await orderFlow.submitOrder();
});

const reservationOrderData: DekkproOrderData = {
    customer: {
        name: 'Thao',
    },
    product: {
        searchTerm: 'GoodYear',
        quantity: 1,
    },
    printMode: PrintModes.none,
    submitAction: 'Reservasjon',
};

test("Dekkpro - Reservation Order Flow", async ({ page }) => {
    const orderFlow = new NewOrderFlow(page, reservationOrderData);
    await orderFlow.navigateToNewOrder();
    await orderFlow.selectCustomer();
    await orderFlow.searchAndAddProducts();
    await orderFlow.verifyOrderLine();
    await orderFlow.verifyPricing();
    await orderFlow.selectPrintMode();
    await orderFlow.submitOrder();
});
