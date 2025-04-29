Feature: Filter AirBnB

  Background:
    Given user navigates to the URL

  @filterAirBnB
  Scenario: Filter AirBnB by price and rating
    When user click on the filter button
    Then user verifies that the filter options are displayed
    When user click on the Room type filter
    When user enter the minimum price as <minPrice>
    When user enter the maximum price as <maxPrice>
    When user click on the Showrooms Button

    Examples:
      | minPrice | maxPrice |
      |     5000 |    10000 |
    #   |    10000 |    20000 |
    #   |    15000 |    25000 |
    #   |    20000 |    30000 |
