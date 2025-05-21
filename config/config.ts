import dotenv from 'dotenv';
import { LaunchOptions } from '@playwright/test';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://login.salesforce.com/?locale=in';

// Timeout values
const DEFAULT_TIMEOUT = 30000;
const STEP_TIMEOUT = 60000;

// use chromium | chrome | msedge | firefox | webkit
const SET_BROWSER = 'msedge'

// Browser configuration
const browserOptions: Record<string, LaunchOptions> = {
  chrome: {
    channel: 'chrome',
    headless: false,
    args: [
      '--start-maximized',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-proxy-server'
    ],
    slowMo: 20
  },
  msedge: {
    channel: 'msedge',
    headless: false,
    args: [
      '--start-maximized',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-proxy-server'
    ],
    slowMo: 20
  },
  firefox: {
    headless: false,
    slowMo: 20,
    args: ['--kiosk'],
  },
  webkit: {
    headless: false,
    slowMo: 20,
    args: ['--start-maximized'],
  },
};

// Screenshot, video, and trace options
const screenshotOptions = {
  takeOnFailure: true,
  takeOnSuccess: true,
  path: './reports/screenshots/'
};

const videoOptions = {
  enabled: true,
  path: './reports/videos/'
};

const traceOptions = {
  enabled: true,
  path: './reports/traces/'
};

// Data storage paths
const dataPaths = {
  csv: './test-data/',
  json: './test-data/',
  excel: './test-data/'
};

export {
  BASE_URL,
  SET_BROWSER,
  DEFAULT_TIMEOUT,
  STEP_TIMEOUT,
  browserOptions,
  screenshotOptions,
  videoOptions,
  traceOptions,
  dataPaths
};