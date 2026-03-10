import { Locator } from "@playwright/test";

export default class ActionButtonsComponent {

    public static readonly LOCATOR = 'body';

    constructor(private component: Locator) {
        this.component = component;
    }

    private buttonByText(text: string): Locator {
        return this.component.locator('button').filter({ hasText: text }).first();
    }

    async clickTilbud(): Promise<void> {
        await this.buttonByText('Tilbud').click();
    }

    async clickReservasjon(): Promise<void> {
        await this.buttonByText('Reservasjon').click();
    }

    async clickFaktura(): Promise<void> {
        await this.buttonByText('Faktura').click();
    }

    async clickBankkort(): Promise<void> {
        await this.buttonByText('Bankkort').click();
    }

    async clickLagreOgLukk(): Promise<void> {
        await this.buttonByText('Lagre & Lukk').click();
    }

    tilbudButton(): Locator {
        return this.buttonByText('Tilbud');
    }

    reservasjonButton(): Locator {
        return this.buttonByText('Reservasjon');
    }

    fakturaButton(): Locator {
        return this.buttonByText('Faktura');
    }

    bankkortButton(): Locator {
        return this.buttonByText('Bankkort');
    }

    lagreOgLukkButton(): Locator {
        return this.buttonByText('Lagre & Lukk');
    }
}
