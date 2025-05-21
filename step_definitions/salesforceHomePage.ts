import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PlaywrightWrapper } from '../utils/wrapper';
import { createLogger } from '../utils/logger';
import { faker } from '@faker-js/faker';

const logger = createLogger('salesforce-app-steps');

const getWrapper = (world: any): PlaywrightWrapper =>
    new PlaywrightWrapper(world.page, world.context);

When('user clicks on the App Launcher', async function () {
    const wrapper = getWrapper(this);
    await wrapper.waitForVisible(".slds-icon-waffle");
    await wrapper.click(".slds-icon-waffle");
    logger.info("Clicked on App Launcher");
});

When('user clicks on View All button', async function () {
    const wrapper = getWrapper(this);
    await wrapper.page.waitForTimeout(2000);
    await wrapper.waitForVisible("//button[text()='View All']");
    await wrapper.click("//button[text()='View All']");
    logger.info("Clicked on View All button");
});

When('user searches for {string} app', async function (appName: string) {
    const wrapper = getWrapper(this);
    await wrapper.fill("one-app-launcher-modal input.slds-input", appName);
    logger.info(`Searched for app: ${appName}`);
});

When('user clicks on {string} app', async function (appName: string) {
    const wrapper = getWrapper(this);
    await wrapper.click(`//mark[text()='${appName}']`);
    logger.info(`Clicked on app: ${appName}`);
});
