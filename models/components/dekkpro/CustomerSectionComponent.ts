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
        // Wait for dropdown options to appear before clicking
        const firstOption = this.component.page().locator('.ng-option').first();
        await firstOption.waitFor({ state: 'visible', timeout: 15000 });
        await firstOption.click();
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
}
