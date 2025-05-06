import { World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
export interface CustomWorld extends World {
    browser: Browser | null;
    context: BrowserContext | null;
    page: Page | null;
    testName: string;
    startTime: Date;
    parameters: {
        browser?: string;
    };
}