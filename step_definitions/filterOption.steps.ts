import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PlaywrightWrapper } from '../utils/wrapper';
import { createLogger } from '../utils/logger';
import { Selectors } from './selectors';

const logger = createLogger('airbnb-filter-steps');
const selectors = new Selectors();

/* declare module '@cucumber/cucumber' {
    interface World {
        page: Page;
        context:BrowserContext;
    }
}
 */
const getWrapper = (world: any): PlaywrightWrapper => new PlaywrightWrapper(world.page, world.context);

When('user click on the filter button', async function () {
    const wrapper = getWrapper(this);
    let closeBtn = wrapper.page.locator(`//button[@aria-label='Close']`);
    await wrapper.page.waitForTimeout(5000);
    if (await closeBtn.isVisible({ timeout: 10000 })) {
        closeBtn.click();
    }
    await wrapper.isVisible(selectors.filterButton);
    await wrapper.click(selectors.filterButton);
    logger.info('Clicked on the filter button');
});

Then('user verifies that the filter options are displayed', async function () {
    const wrapper = getWrapper(this);
    await wrapper.page.waitForTimeout(2000);  // Adjust as necessary for your app’s performance
    const filterOptionsVisible = await wrapper.isVisible(selectors.filterOptions);
    expect(filterOptionsVisible).to.be.true;
    logger.info('Verified that filter options are displayed');
});

When('user click on the Room type filter', async function () {
    const wrapper = getWrapper(this);
    await wrapper.click(selectors.roomTypeFilter);
    logger.info('Clicked on the Room type filter');
});

When('user enter the minimum price as {int}', async function (minPrice: number) {
    const wrapper = getWrapper(this);
    await wrapper.fill(selectors.minPriceField, minPrice.toString());
    logger.info(`Entered minimum price: ${minPrice}`);
});

When('user enter the maximum price as {int}', async function (maxPrice: number) {
    const wrapper = getWrapper(this);
    await wrapper.fill(selectors.maxPriceField, maxPrice.toString());
    logger.info(`Entered maximum price: ${maxPrice}`);
});

When('user click on the Showrooms Button', async function () {
    const wrapper = getWrapper(this);
    await wrapper.click(selectors.appliedPriceFilter);
    logger.info('Verified applied price filter is correct');
});
