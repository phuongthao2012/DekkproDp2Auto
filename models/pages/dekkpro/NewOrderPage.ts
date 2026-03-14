import { Page } from "@playwright/test";
import BasePage from "../BasePage";
import CustomerSectionComponent from "../../components/dekkpro/CustomerSectionComponent";
import ProductSectionComponent from "../../components/dekkpro/ProductSectionComponent";
import PriceSummaryComponent from "../../components/dekkpro/PriceSummaryComponent";
import ActionButtonsComponent from "../../components/dekkpro/ActionButtonsComponent";
import OrderLineTableComponent from "../../components/dekkpro/OrderLineTableComponent";

export default class NewOrderPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    customerSection(): CustomerSectionComponent {
        return new CustomerSectionComponent(this.page.locator(CustomerSectionComponent.LOCATOR));
    }

    productSection(): ProductSectionComponent {
        return new ProductSectionComponent(this.page.locator(ProductSectionComponent.LOCATOR));
    }

    priceSummary(): PriceSummaryComponent {
        return new PriceSummaryComponent(this.page.locator(PriceSummaryComponent.LOCATOR));
    }

    actionButtons(): ActionButtonsComponent {
        return new ActionButtonsComponent(this.page.locator(ActionButtonsComponent.LOCATOR));
    }

    orderLineTable(): OrderLineTableComponent {
        return new OrderLineTableComponent(this.page.locator(OrderLineTableComponent.LOCATOR));
    }

    async navigate(): Promise<void> {
        await this.page.goto('/app/sales/new-order');
        await this.page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
        await this.page.waitForTimeout(2000);
    }

    async selectPrintMode(mode: 'preview' | 'auto' | 'none'): Promise<void> {
        const radioMap: Record<string, string> = {
            'preview': 'p-radiobutton[inputid="printModePreview"]',
            'auto': 'p-radiobutton[inputid="printModeAuto"]',
            'none': 'p-radiobutton[inputid="printModeNone"]',
        };
        const radio = this.page.locator(radioMap[mode]);
        // Print mode radios may not exist in current UI version — skip if absent
        if (await radio.count() === 0) return;
        const box = radio.locator('.p-radiobutton-box');
        if (await box.count() > 0) {
            await box.click();
        } else {
            await radio.click();
        }
    }
}
