import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from '@playwright/test';
import fs from 'fs-extra';
import { STEP_TIMEOUT, browserOptions, screenshotOptions, videoOptions, traceOptions } from '../config/config';
import { createLogger } from '../utils/logger';
import { CustomWorld } from './custom-world';

const logger = createLogger('hooks');
/* export interface CustomWorld extends World {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  testName: string;
  startTime: Date;
  parameters: {
    browser?: string;
  };
} */

// Set default timeout
setDefaultTimeout(STEP_TIMEOUT);

BeforeAll(async function () {
  logger.info('Setting up test environment');
  await fs.ensureDir('./reports/screenshots');
  await fs.ensureDir('./reports/videos');
  await fs.ensureDir('./reports/traces');
  await fs.ensureDir('./reports/allure-results');
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
  logger.info(`Using browser: ${browserType}`);
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

  const browser: any = this.parameters.browser;
  const shouldSetViewportNull = ["chrome", "msedge", "chromium", "firefox"].includes(browser);

  const contextOptions: any = {
    recordVideo: videoOptions.enabled ? { dir: videoOptions.path } : undefined,
    ...(shouldSetViewportNull ? { viewport: null } : {})
  };

  this.context = await this.browser.newContext(contextOptions);

  if (traceOptions.enabled) {
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
    });
  }

  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function (this: CustomWorld, scenario) {
  logger.info(`Finishing scenario: ${this.testName}`);

  if (scenario.result?.status === Status.FAILED || Status.PASSED) {
    if (this.page && screenshotOptions.takeOnFailure) {
      const timeStamp = Date.now();
      const screenshotPath = `${screenshotOptions.path}${this.testName}${timeStamp}-failure.png`;
      await this.page.screenshot({ path: screenshotPath, fullPage: false });
      const screenshot = fs.readFileSync(screenshotPath);
      this.attach(screenshot, 'image/png');

      logger.info(`Screenshot saved to: ${screenshotPath}`);
    }
  }


  if (traceOptions.enabled && this.context) {
    const timeStamp = Date.now();
    const tracePath = `${traceOptions.path}${this.testName}${timeStamp}.zip`;
    await this.context.tracing.stop({ path: tracePath });
    // For Allure reporting, attach the trace to the scenario result
    // This uses built-in cucumber attachment mechanism which Allure reporter picks up
    const trace = fs.readFileSync(tracePath);
    this.attach(trace, 'application/zip');
    logger.info(`Trace saved to: ${tracePath}`);
  }

  if (this.browser) {
    await this.browser.close();
  }

  const endTime = new Date();
  const duration = endTime.getTime() - this.startTime.getTime();
  logger.info(`Scenario completed in ${duration}ms`);
});