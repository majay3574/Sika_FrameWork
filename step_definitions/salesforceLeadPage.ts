import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PlaywrightWrapper } from '../utils/wrapper';
import { createLogger } from '../utils/logger';
import { FakerData } from '../utils/fakerUtils';


const logger = createLogger('salesforce-lead-steps');
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const companyName = FakerData.companyName();
const getWrapper = (world: any): PlaywrightWrapper =>
  new PlaywrightWrapper(world.page, world.context);

When('user clicks on New button', async function () {
  const wrapper = getWrapper(this);
  await wrapper.waitForVisible("div:text-is('New')");
  await wrapper.click("div:text-is('New')");
  logger.info('Clicked on New Lead button');
});

When('user enters lead details with following information', async function (dataTable) {
  const wrapper = getWrapper(this);
  const leadData = dataTable.hashes()[0];

  await wrapper.click("button[name='salutation']");
  await wrapper.click(`span:text-is('${leadData.Salutation}')`);



  await wrapper.fill("//label[text()='First Name']//following::input[1]", firstName);
  await wrapper.fill("//label[text()='Last Name']//following::input[1]", lastName);
  await wrapper.fill("//label[text()='Company']//following::input[1]", companyName);

  logger.info(`Entered Lead: ${firstName} ${lastName}, Company: ${leadData.Company}`);
});

When('user clicks on Save button', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click("//button[text()='Save']");
  logger.info('Clicked on Save button');
});

Then('user should see lead created with name', async function () {
  const wrapper = getWrapper(this);
  await wrapper.waitForVisible("slot[name='primaryField'] lightning-formatted-name");
  const actualName = await wrapper.getText("slot[name='primaryField'] lightning-formatted-name");
  expect(actualName).to.contain(firstName);
  logger.info(`Verified created lead with name: ${actualName}`);
});

When('user searches for lead with name {string}', async function (leadName: string) {
  const wrapper = getWrapper(this);
  await wrapper.waitForVisible("div[class^='slds-form-element__control'] input");
  await wrapper.fill("div[class^='slds-form-element__control'] input", leadName);
  await wrapper.keyBoardpress("div[class^='slds-form-element__control'] input", "Enter");
  logger.info(`Searched for lead: ${leadName}`);
});

When('user clicks on lead record with name {string}', async function (leadName: string) {
  const wrapper = getWrapper(this);
  await wrapper.waitForVisible(`//a[@title='${leadName}']`);
  await wrapper.click(`//a[@title='${leadName}']`);
  logger.info(`Clicked on lead record: ${leadName}`);
});

When('user deletes the lead', async function () {
  const wrapper = getWrapper(this);
  await wrapper.click("[class^='menu-button-item'] button"); // expand
  await wrapper.waitForVisible("span:text-is('Delete')");
  await wrapper.click("span:text-is('Delete')");
  await wrapper.click("//button/span[text()='Delete']");
  logger.info('Lead deletion confirmed');
});

Then('user should not see the lead in the list', async function () {
  const wrapper = getWrapper(this);
  await wrapper.page.waitForLoadState('load');
  const resultText = await wrapper.getText("//span[text()='No items to display.']");
  expect(resultText).to.equal("No items to display.");
  logger.info("Verified the lead has been deleted");
});
