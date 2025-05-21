# Playwright Cucumber TypeScript Framework

A comprehensive test automation framework built with Playwright, Cucumber, and TypeScript that includes reporting, data handling, and utility wrappers.

## Features

- TypeScript integration
- Cucumber BDD implementation
- Multiple browser support (Chrome, Firefox, WebKit)
- HTML, JSON, and Allure reporting
- Video recording of test execution
- Screenshots on failure
- Trace recording for debugging
- CSV, JSON, and Excel data handling
- Wrapper methods for common interactions
- Tab handling utilities

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file and configure as needed:

```bash
cp .env.example .env
```

## Running Tests

Run all tests with Chrome (default):

```bash
npm test
```

Run with specific browser:

```bash
npm run test:chrome  or npx cucumber-js -p chrome
npm run test:firefox or npx cucumber-js -p firefox
npm run test:webkit  or npx cucumber-js -p webkit
```
run parallel execution

```bash
npx cucumber-js --parallel 4
```

run using tag Name:

```bash
npx cucumber-js --tags "@salesforceAccount"
npx cucumber-js -p chrome --tags "@smoke"



## Generating Reports

Generate HTML reports:

```bash
npm run report:generate
```

Generate Allure reports:

```bash
npm run allure:generate
npm run allure:open
```

## Project Structure

```
├── config
│   └── config.ts              # Configuration settings
├── features
│   └── sample.feature         # Cucumber feature files
├── hooks
│   └── hooks.ts               # Cucumber hooks
├── reports                    # Test reports
│   ├── allure-results
│   ├── screenshots
│   ├── traces
│   └── videos
├── step_definitions
│   └── sample.steps.ts        # Step definitions
├── test-data                  # Test data files
│   ├── test.csv
│   └── users.json
└── utils                      # Utility functions
    ├── data-reader.ts         # Data reading utilities
    ├── logger.ts              # Logging utilities
    ├── report-generator.js    # Report generation
    └── wrapper.ts             # Playwright wrapper
```

## Writing Tests

### Feature Files

Create feature files in the `features` directory:

```gherkin
Feature: Example feature

  Scenario: Example scenario
    Given I navigate to the application
    When I perform an action
    Then I should see expected results
```

### Step Definitions

Create step definition files in the `step_definitions` directory:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';

Given('I navigate to the application', async function() {
  // Implementation
});
```

## Configuration

Edit the `.env` file to configure:

- Base URL
- Headless mode
- Video recording
- Trace recording
- Log level

## Advanced Usage

### Data-Driven Testing

Use external data files for data-driven testing:

```gherkin
Scenario: Login with credentials from data file
  Given I have user credentials from "users.json"
  When I login with the first user
  Then I should be successfully logged in
```

### Custom Wrapper Methods

The `PlaywrightWrapper` class provides helper methods for common actions:

```typescript
const wrapper = new PlaywrightWrapper(page);
await wrapper.navigateTo(url);
await wrapper.fill('#username', 'testuser');
await wrapper.click('#login-button');
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.