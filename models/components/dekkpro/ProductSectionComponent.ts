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
        const page = this.component.page();
        const buttonMap: Record<string, Locator> = {
            'Alle': page.getByRole('button', { name: 'Alle', exact: true }),
            'Sommer': page.getByRole('button', { name: 'Sommer', exact: true }),
            'M+S': page.getByRole('button', { name: 'M+S', exact: true }),
            'M+S Pigg': page.getByRole('button', { name: 'M+S Pigg', exact: true }),
        };
        const btn = buttonMap[season];
        // Skip if already selected (pressed)
        const isPressed = await btn.getAttribute('aria-pressed').catch(() => null)
            ?? await btn.getAttribute('data-p-active').catch(() => null);
        if (isPressed === 'true') return;
        await btn.click();
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
