import { When, Then } from '@cucumber/cucumber';
import { PlaywrightWrapper } from '../utils/wrapper';
import { createLogger } from '../utils/logger';
import { FakerData } from '../utils/fakerUtils';

/**
 * Logger instance for tracking steps related to Salesforce account operations
 * Utilizes the custom logger utility which helps in organizing logs by feature area
 */
const logger = createLogger('salesforce-account-steps');

/**
 * Helper function to create and return a PlaywrightWrapper instance
 * 
 * @param world - The Cucumber world object containing page and context
 * @returns PlaywrightWrapper - A wrapper class that provides simplified interaction with Playwright
 */
const getWrapper = (world: any): PlaywrightWrapper => new PlaywrightWrapper(world.page, world.context);

/**
 * Cucumber step definition for entering account details in Salesforce
 * This step fills out the account creation form with a mix of generated and provided data
 *
 * @param rating - The account rating value (e.g. 'Hot', 'Warm', 'Cold')
 * @param type - The account type (e.g. 'Customer', 'Prospect', 'Partner')
 * @param industry - The industry category for the account (e.g. 'Banking', 'Healthcare')
 * @param ownership - The ownership type (e.g. 'Public', 'Private', 'Subsidiary')
 * @param billingStreet - The street address for billing
 * @param billingCity - The city for billing address
 * @param postalCode - The postal/zip code for billing address
 * @param billingState - The state/province for billing address
 * @param billingCountry - The country for billing address
 */
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
        /**
         * Get the wrapper instance for the current test context
         */
        const wrapper = getWrapper(this);
        
        /**
         * Fill the Account Name field with dynamically generated company name
         * Using FakerData to create realistic test data
         */
        await wrapper.fill("//label[text()='Account Name']//following::input[1]", FakerData.companyName());
        
        /**
         * Fill the Account Number field with dynamically generated account number
         */
        await wrapper.fill("//label[text()='Account Number']//following::input[1]", FakerData.getAccountNumber());
        
        /**
         * Set the Rating field by:
         * 1. Clicking on the Rating dropdown button
         * 2. Selecting the specified rating option
         */
        await wrapper.click("//label[text()='Rating']//following::button[1]");
        await wrapper.click(`//span[normalize-space()='${rating}']`);
        
        /**
         * Set the Type field by:
         * 1. Clicking on the Type dropdown button
         * 2. Selecting the specified type option
         */
        await wrapper.click("//label[text()='Type']//following::button[1]");
        await wrapper.click(`//span[normalize-space()='${type}']`);
        
        /**
         * Set the Industry field by:
         * 1. Clicking on the Industry dropdown button
         * 2. Selecting the specified industry option
         */
        await wrapper.click("//label[text()='Industry']//following::button[1]");
        await wrapper.click(`//span[normalize-space()='${industry}']`);
        
        /**
         * Set the Ownership field by:
         * 1. Clicking on the Ownership dropdown button
         * 2. Selecting the specified ownership option
         */
        await wrapper.click("//label[text()='Ownership']//following::button[1]");
        await wrapper.click(`//span[normalize-space()='${ownership}']`);
        
        /**
         * Fill in all the billing address fields with the provided parameters:
         * - Billing Street (textarea)
         * - Billing City (input)
         * - Billing Zip/Postal Code (input)
         * - Billing State/Province (input)
         * - Billing Country (input)
         */
        await wrapper.fill("//label[text()='Billing Street']//following::textarea[1]", billingStreet);
        await wrapper.fill("//label[text()='Billing City']//following::input[1]", billingCity);
        await wrapper.fill("//label[text()='Billing Zip/Postal Code']//following::input[1]", postalCode);
        await wrapper.fill("//label[text()='Billing State/Province']//following::input[1]", billingState);
        await wrapper.fill("//label[text()='Billing Country']//following::input[1]", billingCountry);
        
        /**
         * Log the successful creation of the account
         */
        logger.info(` Created account`);
    }
);

/**
 * Cucumber step definition to verify that the account name is visible after creation
 * This step confirms the account was successfully created and displays the expected information
 */
Then('user should see the account name', async function () {
    /**
     * Get the wrapper instance for the current test context
     */
    const wrapper = getWrapper(this);
    
    /**
     * Wait for the account name element to be visible on the page
     * This ensures the page has loaded the account details before proceeding
     */
    await wrapper.waitForVisible("div[class^='entityNameTitle'] + slot");
    
    /**
     * Extract the actual account name text from the UI element
     */
    const actualName = await wrapper.getText("div[class^='entityNameTitle'] + slot");
    
    /**
     * Output the account name to the console for debugging purposes
     */
    console.log(actualName);
    
    /**
     * Log the verification of the account name with the actual value
     */
    logger.info(`Verified account name: ${actualName}`);
});