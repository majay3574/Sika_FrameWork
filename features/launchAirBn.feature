Feature: AirBnb Login and Check-in

  Background: 
    Given user navigates to the URL

  @requiresLogin
  Scenario: Login and Check-in
    When user enters destination in the location field
    And user clicks United States from the destination
    And user chooses the check-in date
    And user chooses the checkout date
    And user clicks add guest option
    And user clicks plus button to add the Adult guest
    And user clicks plus button again to add Children guest
    And user clicks plus button again to add Infant guest
    And user clicks search button for searching hotels
    Then user verifies United States in the search page
