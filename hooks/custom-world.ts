/**
 * This file defines the CustomWorld interface which extends Cucumber's World
 * It provides TypeScript typing for the test automation framework
 */

// Import World from Cucumber for extension
import { World } from '@cucumber/cucumber';
// Import Playwright types for browser automation
import { Browser, BrowserContext, Page } from '@playwright/test';

/**
 * CustomWorld interface - extends the base Cucumber World
 * Provides type definitions for browser automation properties and test metadata
 * Used as the context for each Cucumber scenario
 */
export interface CustomWorld extends World {
    /**
     * The Playwright Browser instance
     * Represents the browser being automated (Chrome, Firefox, etc.)
     * Set to null initially and instantiated in Before hook
     */
    browser: Browser | null;

    /**
     * The Playwright BrowserContext instance
     * Represents an isolated browser context with its own cache, cookies, etc.
     * Set to null initially and instantiated in Before hook
     */
    context: BrowserContext | null;

    /**
     * The Playwright Page instance
     * Represents a single tab or window within the browser
     * Set to null initially and instantiated in Before hook
     */
    page: Page | null;

    /**
     * The name of the current test/scenario
     * Used for naming artifacts like screenshots, videos, and traces
     * Formatted version of the Cucumber scenario name (spaces replaced with dashes)
     */
    testName: string;

    /**
     * The timestamp when the test started
     * Used to calculate test duration
     * Set in the Before hook when scenario starts
     */
    startTime: Date;

    /**
     * Custom parameters passed to the test
     * Can be provided through Cucumber's parameterType or command line
     */
    parameters: {
        /**
         * Optional browser parameter
         * Specifies which browser to use for the test
         * Examples: "chrome", "firefox", "webkit", "msedge"
         * If not provided, defaults to "chrome" in the Before hook
         */
        browser?: string;
    };
}