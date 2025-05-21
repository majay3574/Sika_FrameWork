import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PlaywrightWrapper } from '../utils/wrapper';
import { createLogger } from '../utils/logger';
import { FakerData } from '../utils/fakerUtils';

/**
 * Logger instance for tracking steps related to Salesforce lead operations
 * Provides organized logging specifically for lead-related steps within the test suite
 * The logger helps in debugging and tracking the execution flow of lead management tests
 */
const logger = createLogger('salesforce-lead-steps');

/**
 * Generated first name for the lead using FakerData utility
 * Generated last name for the lead using FakerData utility
 * Generated company name for the lead using FakerData utility
 * Using FakerData ensures we have unique, realistic test data for each test run
 * This helps prevent data conflicts when tests are run multiple times
 */
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const companyName = FakerData.companyName();

/**
 * Helper function to create and return a PlaywrightWrapper instance
 * 
 * @param world - The Cucumber world object containing page and context objects
 * @returns PlaywrightWrapper - A wrapper class that provides simplified interaction with Playwright
 * The wrapper abstracts common browser operations and adds error handling and logging
 */
const getWrapper = (world: any): PlaywrightWrapper =>
  new PlaywrightWrapper(world.page, world.context);

/**
 * Cucumber step definition for clicking on the New button to create a lead
 * This step begins the lead creation process in Salesforce
 * 
 * This step:
 * 1. Waits for the New button to be visible on the page
 * 2. Clicks on the New button
 * 3. Logs the action
 */
When('user clicks on New button', async function () {
  /**
   * Get the wrapper instance for the current test context
   */
  const wrapper = getWrapper(this);
  await wrapper.waitForVisible("div:text-is('New')");
  await wrapper.click("div:text-is('New')");
  logger.info('Clicked on New Lead button');
});

/**
 * Cucumber step definition for entering lead details
 * This step fills out the lead creation form with required information
 * 
 * @param dataTable - Cucumber DataTable containing lead information (Salutation, etc.)
 * 
 * This step:
 * 1. Extracts lead data from the Cucumber DataTable
 * 2. Selects the salutation from dropdown
 * 3. Fills in first name, last name, and company fields
 * 4. Logs the entered lead information
 */
When('user enters lead details with following information', async function (dataTable) {
  /** 
   * Get the wrapper instance for the current test context
   */
  const wrapper = getWrapper(this);
  
  /**
   * Extract the first row of data from the Cucumber DataTable
   * The dataTable.hashes() converts the table into an array of objects
   * where each object represents a row with column names as keys
   */
  const leadData = dataTable.hashes()[0];
  
  /**
   * Click on the salutation dropdown button to open the dropdown menu
   */
  await wrapper.click("button[name='salutation']");
  
  /**
   * Select the specified salutation option from the dropdown
   * The value comes from the 'Salutation' column in the DataTable
   */
  await wrapper.click(`span:text-is('${leadData.Salutation}')`);
  
  /**
   * Fill in the First Name field using the generated firstName value
   * Using XPath selector to find the input field following the 'First Name' label
   */
  await wrapper.fill("//label[text()='First Name']//following::input[1]", firstName);
  
  /**
   * Fill in the Last Name field using the generated lastName value
   * Using XPath selector to find the input field following the 'Last Name' label
   */
  await wrapper.fill("//label[text()='Last Name']//following::input[1]", lastName);
  
  /**
   * Fill in the Company field using the generated companyName value
   * Using XPath selector to find the input field following the 'Company' label
   */
  await wrapper.fill("//label[text()='Company']//following::input[1]", companyName);
  
  /**
   * Log the lead information that was entered
   * Note: The log shows the generated firstName and lastName, but incorrectly references
   * leadData.Company which should be companyName. This appears to be a bug in the original code.
   */
  logger.info(`Entered Lead: ${firstName} ${lastName}, Company: ${leadData.Company}`);
});

/**
 * Cucumber step definition for clicking the Save button
 * This step saves the lead information and creates the lead record
 * 
 * This step:
 * 1. Clicks on the Save button
 * 2. Logs the action
 */
When('user clicks on Save button', async function () {
  /**
   * Get the wrapper instance for the current test context
   */
  const wrapper = getWrapper(this);
  
  /**
   * Click on the Save button using XPath selector
   * The selector finds a button element with exact text 'Save'
   */
  await wrapper.click("//button[text()='Save']");
  
  /**
   * Log the successful save action for debugging and reporting
   */
  logger.info('Clicked on Save button');
});

/**
 * Cucumber step definition for verifying lead creation
 * This step verifies that the lead was successfully created by checking the displayed name
 * 
 * This step:
 * 1. Waits for the lead name to be visible
 * 2. Gets the actual lead name from the page
 * 3. Verifies that it contains the expected first name
 * 4. Logs the verification result
 */
Then('user should see lead created with name', async function () {
  /**
   * Get the wrapper instance for the current test context
   */
  const wrapper = getWrapper(this);
  
  /**
   * Wait for the lead name element to be visible on the page
   * The selector targets the formatted name component within the primary field slot
   */
  await wrapper.waitForVisible("slot[name='primaryField'] lightning-formatted-name");
  
  /**
   * Extract the actual lead name text from the UI element
   */
  const actualName = await wrapper.getText("slot[name='primaryField'] lightning-formatted-name");
  
  /**
   * Verify that the displayed name contains the expected first name
   * Using Chai's expect for the assertion
   */
  expect(actualName).to.contain(firstName);
  
  /**
   * Log the verification result with the actual name for debugging and reporting
   */
  logger.info(`Verified created lead with name: ${actualName}`);
});

/**
 * Cucumber step definition for searching for a lead by name
 * This step searches for a lead record using the global search functionality
 * 
 * @param leadName - The name of the lead to search for
 * 
 * This step:
 * 1. Waits for the search input field to be visible
 * 2. Enters the lead name in the search field
 * 3. Presses Enter to execute the search
 * 4. Logs the search action
 */
When('user searches for lead with name {string}', async function (leadName: string) {
  /**
   * Get the wrapper instance for the current test context
   */
  const wrapper = getWrapper(this);
  
  /**
   * Wait for the search input field to be visible
   * The selector targets an input within a div with class starting with 'slds-form-element__control'
   */
  await wrapper.waitForVisible("div[class^='slds-form-element__control'] input");
  
  /**
   * Fill the search input field with the specified lead name
   */
  await wrapper.fill("div[class^='slds-form-element__control'] input", leadName);
  
  /**
   * Press Enter key to execute the search
   * Using keyBoardpress method to simulate keyboard interaction
   */
  await wrapper.keyBoardpress("div[class^='slds-form-element__control'] input", "Enter");
  
  /**
   * Log the search action with the specific lead name for debugging and reporting
   */
  logger.info(`Searched for lead: ${leadName}`);
});

/**
 * Cucumber step definition for clicking on a specific lead record
 * This step selects a lead from the search results by clicking on its name
 * 
 * @param leadName - The name of the lead to click on
 * 
 * This step:
 * 1. Waits for the lead record link to be visible
 * 2. Clicks on the lead record link
 * 3. Logs the click action
 */
When('user clicks on lead record with name {string}', async function (leadName: string) {
  /**
   * Get the wrapper instance for the current test context
   */
  const wrapper = getWrapper(this);
  
  /**
   * Wait for the lead record link to be visible
   * The XPath selector targets an anchor tag with title attribute equal to the lead name
   */
  await wrapper.waitForVisible(`//a[@title='${leadName}']`);
  
  /**
   * Click on the lead record link
   */
  await wrapper.click(`//a[@title='${leadName}']`);
  
  /**
   * Log the click action with the specific lead name for debugging and reporting
   */
  logger.info(`Clicked on lead record: ${leadName}`);
});

/**
 * Cucumber step definition for deleting a lead
 * This step deletes the currently displayed lead record
 * 
 * This step:
 * 1. Clicks on the dropdown menu button
 * 2. Waits for the Delete option to be visible
 * 3. Clicks on the Delete option
 * 4. Confirms the deletion by clicking the Delete button in the confirmation dialog
 * 5. Logs the deletion action
 */
When('user deletes the lead', async function () {
  /**
   * Get the wrapper instance for the current test context
   */
  const wrapper = getWrapper(this);
  
  /**
   * Click on the dropdown menu button to expand options
   * The selector targets a button within an element with class starting with 'menu-button-item'
   */
  await wrapper.click("[class^='menu-button-item'] button"); // expand
  
  /**
   * Wait for the Delete option to be visible in the expanded menu
   * The selector targets a span element with exact text 'Delete'
   */
  await wrapper.waitForVisible("span:text-is('Delete')");
  
  /**
   * Click on the Delete option
   */
  await wrapper.click("span:text-is('Delete')");
  
  /**
   * Click on the Delete button in the confirmation dialog
   * The XPath selector targets a button containing a span with text 'Delete'
   */
  await wrapper.click("//button/span[text()='Delete']");
  
  /**
   * Log the successful deletion confirmation for debugging and reporting
   */
  logger.info('Lead deletion confirmed');
});

/**
 * Cucumber step definition for verifying lead deletion
 * This step verifies that the lead has been successfully deleted by checking for "No items" message
 * 
 * This step:
 * 1. Waits for the page to finish loading
 * 2. Gets the text indicating no items are displayed
 * 3. Verifies that the text matches the expected "No items to display." message
 * 4. Logs the verification result
 */
Then('user should not see the lead in the list', async function () {
  /**
   * Get the wrapper instance for the current test context
   */
  const wrapper = getWrapper(this);
  
  /**
   * Wait for the page to finish loading after deletion
   * This ensures the UI has been updated to reflect the deletion
   */
  await wrapper.page.waitForLoadState('load');
  
  /**
   * Extract the text from the "No items" message element
   * The XPath selector targets a span with exact text 'No items to display.'
   */
  const resultText = await wrapper.getText("//span[text()='No items to display.']");
  
  /**
   * Verify that the displayed message matches the expected text
   * Using Chai's expect for the assertion
   */
  expect(resultText).to.equal("No items to display.");
  
  /**
   * Log the verification result for debugging and reporting
   */
  logger.info("Verified the lead has been deleted");
});