import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Page } from '@playwright/test';
import { PlaywrightWrapper } from '../utils/wrapper';
import { createLogger } from '../utils/logger';
import { Selectors } from './selectors';
import { BASE_URL } from '../config/config';

const logger = createLogger('airbnb-steps');
const selectors = new Selectors();


declare module '@cucumber/cucumber' {
  interface World {
    page: Page;
  }
}

const getWrapper = (world: any): PlaywrightWrapper => new PlaywrightWrapper(world.page, world.context);

Given('user navigates to the URL', async function () {
  const wrapper = getWrapper(this);
  await wrapper.navigateTo(BASE_URL);
  logger.info('Navigated to Airbnb URL');
});

When('user enters destination in the location field', async function () {
  const wrapper = getWrapper(this);
  await wrapper.page.waitForTimeout(2000);
  await wrapper.fill(selectors.destinationField, 'United States');
  logger.info('Entered destination: United States');
});

When('user clicks United States from the destination', async function () {
  const wrapper = getWrapper(this);
  await wrapper.waitForVisible(selectors.destinationDropdownOption);
  await wrapper.click(selectors.destinationDropdownOption);
  logger.info('Clicked on "United States" from the dropdown');
});

When('user chooses the check-in date', async function () {
  const wrapper = getWrapper(this);
  // await wrapper.click(selectors.checkinDateField);
  await wrapper.page.waitForTimeout(2000);
  await wrapper.click(`(//button[contains(@aria-label,'Available. Select as check-in date.')])[1]`);
  logger.info('Selected check-in date');
});

When('user chooses the checkout date', async function () {
  const wrapper = getWrapper(this);
  //await wrapper.click(selectors.checkoutDateField);
  await wrapper.page.waitForTimeout(2000);
  await wrapper.click(`(//button[contains(@aria-label,'Available. Select as checkout date.')])[1]`); // Example date
  logger.info('Selected checkout date');
});

When('user clicks add guest option', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click(selectors.addGuestButton);
  logger.info('Clicked on add guest button');
});

When('user clicks plus button to add the Adult guest', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click(selectors.addAdultButton);
  logger.info('Added an adult guest');
});

When('user clicks plus button again to add Children guest', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click(selectors.addChildButton);
  logger.info('Added a child guest');
});

When('user clicks plus button again to add Infant guest', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click(selectors.addInfantButton);
  logger.info('Added an infant guest');
});

When('user clicks search button for searching hotels', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click(selectors.searchButton);
  logger.info('Clicked search button');
});

Then('user verifies United States in the search page', async function () {
  const wrapper = getWrapper(this);
  await wrapper.page.waitForLoadState('domcontentloaded');
  await wrapper.page.waitForTimeout(5000);
  const resultText = await wrapper.page.title();
  console.log(resultText);

  // const resultText = await wrapper.getText(selectors.searchResults);
  expect(resultText).contains('Airbnb | United States');
  logger.info('Verified "United States" in search results');
});
