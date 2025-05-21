Feature: Salesforce Create Lead

  Background:
    Given user navigates to Salesforce login page
    When user enters valid username and password
    And user clicks on login button
    Then user should be logged in successfully

  @salesforceLead
  Scenario: Create a new case in Salesforce and update chatter
    When user clicks on the App Launcher
    And user clicks on View All button
    When user searches for "Leads" app
    When user clicks on "Leads" app
    When user clicks on New button
    When user enters lead details with following information
      | Salutation |
      | Mr.        |
    When user clicks on Save button
    Then user should see lead created with name
    
