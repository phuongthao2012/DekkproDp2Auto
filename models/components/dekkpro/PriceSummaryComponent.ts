import { Locator } from "@playwright/test";

export default class PriceSummaryComponent {

    public static readonly LOCATOR = 'body';

    private suggestedPriceBeforeTaxSel = 'input#suggestedPriceBeforeTax';
    private suggestedPriceAfterTaxSel = 'input#suggestedPriceAfterTax';
    private totalDiscountBeforeTaxSel = 'input#totalDiscountBeforeTax';
    private totalDiscountAfterTaxSel = 'input#totalDiscountAfterTax';
    private creditAmountSel = 'input#creditAmount';
    private totalBeforeTaxLabel = 'Sum ekskl mva:';
    private totalAfterTaxLabel = 'Sum inkl mva:';
    private profitSel = 'input#profit';
    private profitPercentSel = 'input#profitPercent';

    constructor(private component: Locator) {
        this.component = component;
    }

    async getSuggestedPriceBeforeTax(): Promise<string> {
        return await this.component.locator(this.suggestedPriceBeforeTaxSel).inputValue();
    }

    async getSuggestedPriceAfterTax(): Promise<string> {
        return await this.component.locator(this.suggestedPriceAfterTaxSel).inputValue();
    }

    async getTotalDiscountBeforeTax(): Promise<string> {
        return await this.component.locator(this.totalDiscountBeforeTaxSel).inputValue();
    }

    async getTotalDiscountAfterTax(): Promise<string> {
        return await this.component.locator(this.totalDiscountAfterTaxSel).inputValue();
    }

    async getCreditAmount(): Promise<string> {
        return await this.component.locator(this.creditAmountSel).inputValue();
    }

    async getTotalBeforeTax(): Promise<string> {
        return await this.totalBeforeTax().textContent() ?? '';
    }

    async getTotalAfterTax(): Promise<string> {
        return await this.totalAfterTax().textContent() ?? '';
    }

    async getProfit(): Promise<string> {
        return await this.component.locator(this.profitSel).inputValue();
    }

    async getProfitPercent(): Promise<string> {
        return await this.component.locator(this.profitPercentSel).inputValue();
    }

    suggestedPriceBeforeTax(): Locator {
        return this.component.locator(this.suggestedPriceBeforeTaxSel);
    }

    totalBeforeTax(): Locator {
        return this.component.page().getByText(/Sum ekskl mva:/).first();
    }

    totalAfterTax(): Locator {
        return this.component.page().getByText(/Sum inkl mva:/).first();
    }

    profit(): Locator {
        return this.component.locator(this.profitSel);
    }

    profitPercent(): Locator {
        return this.component.locator(this.profitPercentSel);
    }
}
