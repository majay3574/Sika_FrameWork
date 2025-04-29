export class Selectors {
  destinationField = "//*[@id='bigsearch-query-location-input']";
  destinationDropdownOption = "text=United States";
  checkinDateField = "//*[@data-testid='structured-search-input-field-split-dates-0']";
  checkoutDateField = "//*[@data-testid='structured-search-input-field-split-dates-1']";
  addGuestButton = "//*[@data-testid='structured-search-input-field-guests-button']";
  addAdultButton = "//*[@data-testid='stepper-adults-increase-button']";
  addChildButton = "//*[@data-testid='stepper-children-increase-button']";
  addInfantButton = "//*[@data-testid='stepper-infants-increase-button']";
  searchButton = "//*[@class='c1nkokj4 atm_9s_116y0ak atm_l8_exct8b atm_mk_h2mmj6 atm_wq_kb7nvz dir dir-ltr']";
  searchResults = ".search-results";
  filterButton = "button[data-testid='category-bar-filter-button']";
  filterOptions = "//div[text()='Filters']";
  roomTypeFilter = "//span[text()='Room']";
  minPriceField = "input[id='price_filter_min']";
  maxPriceField = "input[id='price_filter_max']";
  appliedPriceFilter = "//footer/div/a[contains(text(),'Show')]";
}
