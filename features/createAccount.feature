Feature: Salesforce Create Account

  Background:
    Given user navigates to Salesforce login page
    When user enters valid username and password
    And user clicks on login button
    Then user should be logged in successfully

  @salesforceAccount
  Scenario: Create a new case in Salesforce and create Account
    When user clicks on the App Launcher
    And user clicks on View All button
    When user searches for "Accounts" app
    When user clicks on "Accounts" app
    When user clicks on New button
    And user enters account details "<Rating>" "<Type>" "<Industry>" "<Ownership>" "<BillingStreet>" "<BillingCity>" "<PostalCode>" "<BillingState>" "<BillingCountry>"
    When user clicks on Save button
    Then user should see the account name
    
    Examples:
      | Rating | Type                 | Industry    | Ownership | BillingStreet | BillingCity | PostalCode | BillingState | BillingCountry |
      | Hot    | Customer - Channel   | Banking     | Public    | 123 Tech Rd   | Chennai     | 600001     | Tamil Nadu   | India          |
      | Warm   | Installation Partner | Engineering | Private   | 456 Tech Rd   | Chennai     | 600002     | Tamil Nadu   | India          |
