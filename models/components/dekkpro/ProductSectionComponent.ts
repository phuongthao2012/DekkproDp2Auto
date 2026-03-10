import { Locator } from "@playwright/test";

export default class ProductSectionComponent {

    public static readonly LOCATOR = 'body';

    private productSearchInputSel = 'input#productFilter';
    private productClearBtnSel = 'button[icon="pi pi-times"]';
    private productExpandBtnSel = 'button[icon="pi pi-caret-down"]';
    private seasonContainerSel = '.should-not-close-product-search.p-selectbutton';
    private productSourceTabsSel = 'p-selectbutton#filterStoreWarehouse';
    private productTableSel = '.order-detail-card table';
    private productTableHeadersSel = 'th:visible';
    private productTableRowsSel = 'table tbody tr:visible';

    constructor(private component: Locator) {
        this.component = component;
    }

    async searchProduct(searchText: string): Promise<void> {
        const searchInput = this.component.locator(this.productSearchInputSel);
        await searchInput.clear();
        await searchInput.fill(searchText);
        await this.component.page().keyboard.press('Enter');
        await this.component.page().waitForTimeout(1000);
    }

    async clearProductSearch(): Promise<void> {
        await this.component.locator(this.productClearBtnSel).first().click();
    }

    async selectSeasonFilter(season: 'Alle' | 'Sommer' | 'M+S' | 'M+S Pigg'): Promise<void> {
        const seasonContainer = this.component.locator(this.seasonContainerSel);
        const buttonMap: Record<string, Locator> = {
            'Alle': seasonContainer.locator('div.p-button', { hasText: 'Alle' }).first(),
            'Sommer': seasonContainer.locator('div.p-button', { hasText: 'Sommer' }),
            'M+S': seasonContainer.locator('div.p-button', { hasText: /^M\+S$/ }),
            'M+S Pigg': seasonContainer.locator('div.p-button', { hasText: 'M+S Pigg' }),
        };
        await buttonMap[season].click();
    }

    async selectCategoryFilter(category: 'Diverse' | 'Arbeid'): Promise<void> {
        const page = this.component.page();
        const buttonMap: Record<string, Locator> = {
            'Diverse': page.locator('button.m-FilterProductButtons', { hasText: 'Diverse' }).or(page.locator('button:has-text("Diverse")')).first(),
            'Arbeid': page.locator('button.m-FilterProductButtons', { hasText: 'Arbeid' }).or(page.locator('button:has-text("Arbeid")')).first(),
        };
        await buttonMap[category].click();
    }

    async selectProductSourceTab(tabName: string): Promise<void> {
        await this.component.locator(this.productSourceTabsSel).locator(`div:has-text("${tabName}")`).click();
    }

    productSearchInput(): Locator {
        return this.component.locator(this.productSearchInputSel);
    }

    productTable(): Locator {
        return this.component.locator(this.productTableSel).first();
    }

    productTableHeaders(): Locator {
        return this.component.locator(this.productTableHeadersSel);
    }

    productTableRows(): Locator {
        return this.component.locator(this.productTableRowsSel);
    }

    seasonAlleButton(): Locator {
        return this.component.locator(this.seasonContainerSel).locator('div.p-button', { hasText: 'Alle' }).first();
    }

    seasonSommerButton(): Locator {
        return this.component.locator(this.seasonContainerSel).locator('div.p-button', { hasText: 'Sommer' });
    }

    seasonMSButton(): Locator {
        return this.component.locator(this.seasonContainerSel).locator('div.p-button', { hasText: /^M\+S$/ });
    }

    seasonMSPiggButton(): Locator {
        return this.component.locator(this.seasonContainerSel).locator('div.p-button', { hasText: 'M+S Pigg' });
    }

    productSourceTabs(): Locator {
        return this.component.locator(this.productSourceTabsSel);
    }
}
