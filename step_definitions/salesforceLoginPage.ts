import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PlaywrightWrapper } from '../utils/wrapper';
import { createLogger } from '../utils/logger';
import { Selectors } from './selectors';
import { BASE_URL } from '../config/config';
import { credentialConstants } from '../config/credentialConstants';

const logger = createLogger('salesforceLoginPage');
const selectors = new Selectors();

const getWrapper = (world: any): PlaywrightWrapper => new PlaywrightWrapper(world.page, world.context);

Given('user navigates to Salesforce login page', async function () {
    const wrapper = getWrapper(this);
    await wrapper.navigateTo(BASE_URL);
    logger.info('Navigated to Salesforce login page');
});

When('user enters valid username and password', async function () {
    const wrapper = getWrapper(this);
    await wrapper.fill("input[id='username']", credentialConstants.USERNAME);
    await wrapper.fill("input[id='password']", credentialConstants.PASSWORD);
    logger.info('Entered username and password');
});

When('user clicks on login button', async function () {
    const wrapper = getWrapper(this);
    await wrapper.click("input[id='Login']");
    logger.info('Clicked on login button');
});

Then('user should be logged in successfully', async function () {
    const wrapper = getWrapper(this);
    await wrapper.page.waitForLoadState('load');
    await wrapper.page.waitForTimeout(6000);
    let pageTitle = await wrapper.page.title()
    expect(pageTitle).equals(`Home | Salesforce`)
    logger.info('User logged in successfully');
});