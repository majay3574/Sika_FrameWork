/**
 * This file contains Cucumber hooks for test initialization and cleanup
 * It handles browser setup, screenshot capture, and test environment management
 */

import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from '@playwright/test';
import fs from 'fs-extra';
import { STEP_TIMEOUT, browserOptions, screenshotOptions, videoOptions, traceOptions } from '../config/config';
import { createLogger } from '../utils/logger';
import { CustomWorld } from './custom-world';

// Initialize logger for this module
const logger = createLogger('hooks');
// Set global timeout for all steps based on config value
setDefaultTimeout(STEP_TIMEOUT);

/**
 * BeforeAll hook - Runs once before any tests execute
 * Creates necessary directories for test artifacts
 */
BeforeAll(async function () {
  logger.info('Setting up test environment');
  // Ensure directories exist for storing test artifacts
  await fs.ensureDir('./reports/screenshots');  // Directory for screenshot storage
  await fs.ensureDir('./reports/videos');       // Directory for video recordings
  await fs.ensureDir('./reports/traces');       // Directory for Playwright traces
  //await fs.ensureDir('./reports/allure-results'); // Directory for Allure reports (currently disabled)
  logger.info('Test environment setup complete');
});

/**
 * AfterAll hook - Runs once after all tests have completed
 * Performs any final cleanup operations
 */
AfterAll(async function () {
  logger.info('Cleaning up test environment');
  // Placeholder for any cleanup operations needed after all tests
  logger.info('Test environment cleanup complete');
});

/**
 * Before hook - Runs before each scenario
 * Sets up browser instance and context based on configuration
 * 
 * @param {CustomWorld} this - The custom world instance for this scenario
 * @param {Object} scenario - The current scenario information
 * @param {Object} scenario.pickle - Contains scenario details
 * @param {string} scenario.pickle.name - Name of the current scenario
 */
Before(async function (this: CustomWorld, scenario) {
  // Record start time for duration calculation
  this.startTime = new Date();
  // Format test name for file naming (replace spaces with dashes)
  this.testName = scenario.pickle.name.replace(/\s+/g, '-');
  logger.info(`Starting scenario: ${this.testName}`);

  // Determine which browser to use - either from parameters or default to chrome
  const browserType = this.parameters.browser || "chrome";
  logger.info(`Using browser: ${browserType}`);
  
  // Launch appropriate browser based on browser type parameter
  switch (browserType) {
    case 'chrome':
      // Launch Chrome browser with options from config
      this.browser = await chromium.launch(browserOptions.chrome);
      break;
    case 'msedge':
      // Launch Edge browser with options from config (uses chromium engine)
      this.browser = await chromium.launch(browserOptions.msedge);
      break;
    case 'firefox':
      // Launch Firefox browser with options from config
      this.browser = await firefox.launch(browserOptions.firefox);
      break;
    case 'webkit':
      // Launch Safari/WebKit browser with options from config
      this.browser = await webkit.launch(browserOptions.webkit);
      break;
    default:
      // Throw error if unsupported browser specified
      throw new Error(`Unsupported browser type: ${browserType}`);
  }

  // Get browser type for viewport configuration
  const browser: any = this.parameters.browser;
  // Determine if viewport should be null (used for maximizing window in certain browsers)
  const shouldSetViewportNull = ["chrome", "msedge", "chromium", "firefox"].includes(browser);

  // Configure browser context options
  const contextOptions: any = {
    // Configure video recording based on config settings
    recordVideo: videoOptions.enabled ? { dir: videoOptions.path } : undefined,
    // Set viewport to null for specific browsers to enable maximized window
    ...(shouldSetViewportNull ? { viewport: null } : {})
  };

  // Create new browser context with the specified options
  this.context = await this.browser.newContext(contextOptions);

  // Start tracing if enabled in configuration
  if (traceOptions.enabled) {
    await this.context.tracing.start({
      screenshots: true,  // Include screenshots in trace
      snapshots: true,    // Include DOM snapshots in trace
    });
  }

  // Create a new page in the browser context
  this.page = await this.context.newPage();
});

/**
 * After hook - Runs after each scenario
 * Captures screenshots on failure, saves traces, and closes browser
 * 
 * @param {CustomWorld} this - The custom world instance for this scenario
 * @param {Object} scenario - The completed scenario information
 * @param {Object} scenario.result - Contains result details
 * @param {Status} scenario.result.status - Status of the scenario (PASSED, FAILED, etc.)
 */
After(async function (this: CustomWorld, scenario) {
  logger.info(`Finishing scenario: ${this.testName}`);

  // Take screenshot if scenario failed and screenshot on failure is enabled
  if (scenario.result?.status === Status.FAILED || Status.PASSED) {
    if (this.page && screenshotOptions.takeOnFailure) {
      // Generate timestamp for unique filename
      const timeStamp = Date.now();
      // Create screenshot path with scenario name and timestamp
      const screenshotPath = `${screenshotOptions.path}${this.testName}${timeStamp}-failure.png`;
      
      // Take screenshot and save to file
      await this.page.screenshot({ path: screenshotPath, fullPage: false });
      
      // Read screenshot file and attach to test report
      const screenshot = fs.readFileSync(screenshotPath);
      this.attach(screenshot, 'image/png');

      logger.info(`Screenshot saved to: ${screenshotPath}`);
    }
  }

  // Save trace file if tracing is enabled
  if (traceOptions.enabled && this.context) {
    // Generate timestamp for unique filename
    const timeStamp = Date.now();
    // Create trace path with scenario name and timestamp
    const tracePath = `${traceOptions.path}${this.testName}${timeStamp}.zip`;
    
    // Stop tracing and save trace file
    await this.context.tracing.stop({ path: tracePath });
    
    // Read trace file and attach to test report for Allure integration
    const trace = fs.readFileSync(tracePath);
    this.attach(trace, 'application/zip');
    
    logger.info(`Trace saved to: ${tracePath}`);
  }

  // Close browser instance
  if (this.browser) {
    await this.browser.close();
  }

  // Calculate and log test duration
  const endTime = new Date();
  const duration = endTime.getTime() - this.startTime.getTime();
  logger.info(`Scenario completed in ${duration}ms`);
});