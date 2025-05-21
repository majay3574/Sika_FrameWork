import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PlaywrightWrapper } from '../utils/wrapper';
import { createLogger } from '../utils/logger';
import { faker } from '@faker-js/faker';

/**
 * Logger instance for tracking steps related to Salesforce app navigation and interactions
 * Uses the createLogger utility to create a named logger specifically for Salesforce app steps
 * The logger helps in organizing logs and debugging test executions
 */
const logger = createLogger('salesforce-app-steps');

/**
 * Helper function to create and return a PlaywrightWrapper instance
 * 
 * @param world - The Cucumber world object containing page and context objects
 * @returns PlaywrightWrapper - A wrapper class that provides simplified interaction with Playwright
 * This wrapper abstracts common Playwright operations like click, fill, etc. with added logging and error handling
 */
const getWrapper = (world: any): PlaywrightWrapper =>
    new PlaywrightWrapper(world.page, world.context);

/**
 * Cucumber step definition for clicking on the App Launcher in Salesforce
 * The App Launcher is the waffle icon in the top left of Salesforce that gives access to all apps
 * 
 * This step:
 * 1. Waits for the App Launcher icon to be visible
 * 2. Clicks on the App Launcher icon
 * 3. Logs the action
 */
When('user clicks on the App Launcher', async function () {
    /**
     * Get the wrapper instance for the current test context
     */
    const wrapper = getWrapper(this);
    
    /**
     * Wait for the App Launcher icon (waffle icon) to be visible on the page
     * The selector targets the specific Salesforce Lightning Design System class for the waffle icon
     */
    await wrapper.waitForVisible(".slds-icon-waffle");
    
    /**
     * Click on the App Launcher icon once it's visible
     */
    await wrapper.click(".slds-icon-waffle");
    
    /**
     * Log the successful click action for debugging and reporting
     */
    logger.info("Clicked on App Launcher");
});

/**
 * Cucumber step definition for clicking on the "View All" button
 * This button appears after clicking the App Launcher and shows all available apps
 * 
 * This step:
 * 1. Waits a fixed time for the menu to stabilize
 * 2. Waits for the "View All" button to be visible
 * 3. Clicks on the "View All" button
 * 4. Logs the action
 */
When('user clicks on View All button', async function () {
    /**
     * Get the wrapper instance for the current test context
     */
    const wrapper = getWrapper(this);
    
    /**
     * Wait for a fixed timeout to allow the App Launcher menu to fully render
     * This helps prevent flaky tests by ensuring the menu is stable before proceeding
     */
    await wrapper.page.waitForTimeout(2000);
    
    /**
     * Wait for the "View All" button to be visible in the App Launcher menu
     * Using XPath selector to precisely target the button with exact text
     */
    await wrapper.waitForVisible("//button[text()='View All']");
    
    /**
     * Click on the "View All" button once it's visible
     */
    await wrapper.click("//button[text()='View All']");
    
    /**
     * Log the successful click action for debugging and reporting
     */
    logger.info("Clicked on View All button");
});

/**
 * Cucumber step definition for searching for a specific app in the App Launcher
 * This step occurs after clicking "View All" when the full app launcher modal is displayed
 * 
 * @param appName - The name of the app to search for (provided in the Cucumber step)
 * 
 * This step:
 * 1. Fills the search input field with the specified app name
 * 2. Logs the search action with the app name
 */
When('user searches for {string} app', async function (appName: string) {
    /**
     * Get the wrapper instance for the current test context
     */
    const wrapper = getWrapper(this);
    
    /**
     * Fill the search input field with the specified app name
     * The selector targets the input field within the one-app-launcher-modal component
     */
    await wrapper.fill("one-app-launcher-modal input.slds-input", appName);
    
    /**
     * Log the search action with the specific app name for debugging and reporting
     */
    logger.info(`Searched for app: ${appName}`);
});

/**
 * Cucumber step definition for clicking on a specific app in the App Launcher results
 * This step occurs after searching for an app and selects the app from the search results
 * 
 * @param appName - The name of the app to click on (provided in the Cucumber step)
 * 
 * This step:
 * 1. Clicks on the app with the specified name in the search results
 * 2. Logs the click action with the app name
 */
When('user clicks on {string} app', async function (appName: string) {
    /**
     * Get the wrapper instance for the current test context
     */
    const wrapper = getWrapper(this);
    
    /**
     * Click on the app name in the search results
     * The XPath selector targets the <mark> element that contains the highlighted search term
     * Salesforce wraps matched search terms with <mark> tags for highlighting
     */
    await wrapper.click(`//mark[text()='${appName}']`);
    
    /**
     * Log the click action with the specific app name for debugging and reporting
     */
    logger.info(`Clicked on app: ${appName}`);
});