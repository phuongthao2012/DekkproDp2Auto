import { Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class LoginPage extends BasePage {

    private usernameSel = '#username';
    private passwordSel = '#password';
    private loginBtnSel = 'button[type="submit"]';

    constructor(page: Page) {
        super(page);
    }

    async navigate(): Promise<void> {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }

    async login(email: string, password: string): Promise<void> {
        await this.page.locator(this.usernameSel).fill(email);
        await this.page.locator(this.passwordSel).fill(password);
        await this.page.locator(this.loginBtnSel).click();
        await this.page.waitForURL('**/app/**', { timeout: 30000 });
    }
}
