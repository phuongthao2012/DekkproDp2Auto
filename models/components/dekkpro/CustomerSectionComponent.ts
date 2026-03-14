import { Locator } from "@playwright/test";

export default class CustomerSectionComponent {

    public static readonly LOCATOR = 'body';

    private customerSelectSel = 'ng-select#selectedCustomer\\.id';
    private customerContactDropdownSel = 'p-dropdown[inputid="customerContacts"]';
    private customerAddressDropdownSel = 'p-dropdown#customerAddresses';
    private customerInfoInputSel = 'input#customerInfo';

    constructor(private component: Locator) {
        this.component = component;
    }

    async searchAndSelectCustomer(customerName: string): Promise<void> {
        const ngSelect = this.component.locator(this.customerSelectSel);
        const ngSelectInput = ngSelect.locator('input[type="text"]');
        await ngSelectInput.click();
        await ngSelectInput.fill(customerName);
        // Wait for dropdown options to appear, then click the one matching the name
        const matchingOption = this.component.page().locator('.ng-option').filter({ hasText: customerName }).first();
        await matchingOption.waitFor({ state: 'visible', timeout: 15000 });
        await matchingOption.click();
    }

    async selectContact(contactName: string): Promise<void> {
        await this.component.locator(this.customerContactDropdownSel).click();
        await this.component.page().locator('.p-dropdown-item').filter({ hasText: contactName }).click();
    }

    async selectDeliveryAddress(addressLabel: string): Promise<void> {
        await this.component.locator(this.customerAddressDropdownSel).click();
        await this.component.page().locator('.p-dropdown-item').filter({ hasText: addressLabel }).click();
    }

    async fillCustomerInfo(info: string): Promise<void> {
        const infoInput = this.component.locator(this.customerInfoInputSel);
        await infoInput.clear();
        await infoInput.fill(info);
    }

    customerSelect(): Locator {
        return this.component.locator(this.customerSelectSel);
    }

    customerInfoInput(): Locator {
        return this.component.locator(this.customerInfoInputSel);
    }

    customerContactDropdown(): Locator {
        return this.component.locator(this.customerContactDropdownSel);
    }

    customerAddressDropdown(): Locator {
        return this.component.locator(this.customerAddressDropdownSel);
    }

    // ── WPR-0049: Alternative delivery address ────────────────────────────
    async expandCustomerCard(): Promise<void> {
        // Click the chevron/toggle to reveal delivery address options
        const toggler = this.component
            .locator('button[icon="pi pi-chevron-down"], .p-panel-toggler, [class*="toggle"], button.expand')
            .first();
        await toggler.click();
        await this.component.page().waitForTimeout(500);
    }

    async searchAlternativeDeliveryCustomer(customerName: string): Promise<void> {
        // The alternative delivery lookup is a second ng-select (not the main customer picker)
        const altSelect = this.component
            .locator('ng-select')
            .filter({ hasNot: this.component.locator('ng-select#selectedCustomer\\.id') })
            .first();
        const altInput = altSelect.locator('input[type="text"]');
        await altInput.click();
        await altInput.fill(customerName);
        const firstOption = this.component.page().locator('.ng-option').first();
        await firstOption.waitFor({ state: 'visible', timeout: 15000 });
        await firstOption.click();
    }

    alternativeDeliverySelect(): Locator {
        return this.component
            .locator('ng-select')
            .filter({ hasNot: this.component.locator('ng-select#selectedCustomer\\.id') })
            .first();
    }
}
