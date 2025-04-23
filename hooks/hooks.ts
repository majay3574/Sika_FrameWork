import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserContext, Page } from '@playwright/test';
import fs from 'fs-extra';
import { BASE_URL, DEFAULT_TIMEOUT, SET_BROWSER, STEP_TIMEOUT, browserOptions, screenshotOptions, videoOptions, traceOptions } from '../config/config';
import { createLogger } from '../utils/logger';

const logger = createLogger('hooks');


export interface CustomWorld {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  testName: string;
  startTime: Date;
  parameters: {
    browser?: string;
  };
}

// Set default timeout
setDefaultTimeout(STEP_TIMEOUT);

// Ensure reports directories exist
BeforeAll(async function () {
  logger.info('Setting up test environment');
  // Create necessary directories
  await fs.ensureDir('./reports/screenshots');
  await fs.ensureDir('./reports/videos');
  await fs.ensureDir('./reports/traces');
  // await fs.ensureDir('./reports/allure-results');
  logger.info('Test environment setup complete');
});

// Cleanup after all tests
AfterAll(async function () {
  logger.info('Cleaning up test environment');
  logger.info('Test environment cleanup complete');
});

// Initialize browser before each scenario
Before(async function (this: CustomWorld, scenario) {
  this.startTime = new Date();
  this.testName = scenario.pickle.name.replace(/\s+/g, '-');
  logger.info(`Starting scenario: ${this.testName}`);
  // Get browser type from parameter or default to chromium
  const browserType = this.parameters.browser || "chrome";
  //const browserType = this.SET_BROWSER;

  logger.info(`Using browser: ${browserType}`);
  // Launch browser based on type
  switch (browserType) {
    case 'chrome':
      this.browser = await chromium.launch(browserOptions.chrome);
      break;
    case 'msedge':
      this.browser = await chromium.launch(browserOptions.msedge);
      break;
    case 'firefox':
      this.browser = await firefox.launch(browserOptions.firefox);
      break;
    case 'webkit':
      this.browser = await webkit.launch(browserOptions.webkit);
      break;
    default:
      throw new Error(`Unsupported browser type: ${browserType}`);
  }
  /*  // Create browser context
   switch (this.parameters.browser) {
     case "chrome":
     case "msedge":
     case "chromium":
     case "firefox":
 
       this.context = await this.browser.newContext({
         recordVideo: videoOptions.enabled ? { dir: videoOptions.path } : undefined, viewport: null
       });
 
       // Start tracing if enabled
       if (traceOptions.enabled) {
         await this.context.tracing.start({ screenshots: true, snapshots: true });
       }
       // Create page
       this.page = await this.context.newPage();
       break;
 
     case 'webkit':
       this.context = await this.browser.newContext({
         recordVideo: videoOptions.enabled ? { dir: videoOptions.path } : undefined
       });
 
       // Start tracing if enabled
       if (traceOptions.enabled) {
         await this.context.tracing.start({ screenshots: true, snapshots: true });
       }
       // Create page
       this.page = await this.context.newPage();
       break;
   } */
  const browser: any = this.parameters.browser;
  // Determine if viewport should be set
  const shouldSetViewportNull = ["chrome", "msedge", "chromium", "firefox"].includes(browser);

  // Prepare context options
  const contextOptions: any = {
    recordVideo: videoOptions.enabled ? { dir: videoOptions.path } : undefined,
    ...(shouldSetViewportNull ? { viewport: null } : {})
  };

  // Create browser context
  this.context = await this.browser.newContext(contextOptions);

  // Start tracing if enabled
  if (traceOptions.enabled) {
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
    });
  }

  // Create page
  this.page = await this.context.newPage();

});

// Cleanup after each scenario
After(async function (this: CustomWorld, scenario) {
  logger.info(`Finishing scenario: ${this.testName}`);
  // Take screenshot on failure
  if (scenario.result?.status === Status.FAILED && screenshotOptions.takeOnFailure) {
    if (this.page) {
      const screenshotPath = `${screenshotOptions.path}${this.testName}-failure.png`;
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      logger.info(`Screenshot saved to: ${screenshotPath}`);
    }
  }
  // Stop tracing if enabled
  if (traceOptions.enabled && this.context) {
    const tracePath = `${traceOptions.path}${this.testName}.zip`;
    await this.context.tracing.stop({ path: tracePath });
    logger.info(`Trace saved to: ${tracePath}`);
  }
  // Close browser
  if (this.browser) {
    await this.browser.close();
  }
  const endTime = new Date();
  const duration = endTime.getTime() - this.startTime.getTime();
  logger.info(`Scenario completed in ${duration}ms`);
});