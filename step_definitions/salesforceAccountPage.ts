import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PlaywrightWrapper } from '../utils/wrapper';
import { createLogger } from '../utils/logger';
import { FakerData } from '../utils/fakerUtils';

const logger = createLogger('salesforce-account-steps');
const getWrapper = (world: any): PlaywrightWrapper => new PlaywrightWrapper(world.page, world.context);

When(
    'user enters account details {string} {string} {string} {string} {string} {string} {string} {string} {string}',
    async function (
        rating,
        type,
        industry,
        ownership,
        billingStreet,
        billingCity,
        postalCode,
        billingState,
        billingCountry
    ) {
        const wrapper = getWrapper(this);
        await wrapper.fill("//label[text()='Account Name']//following::input[1]", FakerData.companyName());
        await wrapper.fill("//label[text()='Account Number']//following::input[1]", FakerData.getAccountNumber());

        await wrapper.click("//label[text()='Rating']//following::button[1]");
        await wrapper.click(`//span[normalize-space()='${rating}']`);

        await wrapper.click("//label[text()='Type']//following::button[1]");
        await wrapper.click(`//span[normalize-space()='${type}']`);

        await wrapper.click("//label[text()='Industry']//following::button[1]");
        await wrapper.click(`//span[normalize-space()='${industry}']`);

        await wrapper.click("//label[text()='Ownership']//following::button[1]");
        await wrapper.click(`//span[normalize-space()='${ownership}']`);

        await wrapper.fill("//label[text()='Billing Street']//following::textarea[1]", billingStreet);
        await wrapper.fill("//label[text()='Billing City']//following::input[1]", billingCity);
        await wrapper.fill("//label[text()='Billing Zip/Postal Code']//following::input[1]", postalCode);
        await wrapper.fill("//label[text()='Billing State/Province']//following::input[1]", billingState);
        await wrapper.fill("//label[text()='Billing Country']//following::input[1]", billingCountry);

        logger.info(` Created account`);
    }
);

Then('user should see the account name', async function () {
    const wrapper = getWrapper(this);
    await wrapper.waitForVisible("div[class^='entityNameTitle'] + slot");
    const actualName = await wrapper.getText("div[class^='entityNameTitle'] + slot");
    console.log(actualName);
    logger.info(`Verified account name: ${actualName}`);
});

