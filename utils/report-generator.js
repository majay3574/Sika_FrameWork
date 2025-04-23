const reporter = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

// Generate timestamp
const currentDate = new Date();
const timestamp = currentDate.toISOString().replace(/[:.]/g, '-');

// Check if cucumber report exists
const cucumberReportPath = path.join(__dirname, '../reports/cucumber-report.json');
if (!fs.existsSync(cucumberReportPath)) {
  console.error('Cucumber report not found. Please run tests first.');
  process.exit(1);
}

// Read report data
const reportData = JSON.parse(fs.readFileSync(cucumberReportPath, 'utf8'));

// Generate report
reporter.generate({
  jsonDir: 'reports',
  reportPath: `reports/cucumber-html-report-${timestamp}`,
  metadata: {
    browser: {
      name: this.parameters.browser,
      version: '100'
    },
    device: 'Local test machine',
    platform: {
      name: 'windows',
      version: '10'
    }
  },
  customData: {
    title: 'Test Execution Info',
    data: [
      { label: 'Project', value: 'Playwright Cucumber TypeScript Framework' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Execution Start Time', value: new Date(reportData[0].elements[0].steps[0].result.start).toLocaleString() },
      { label: 'Execution End Time', value: new Date().toLocaleString() }
    ]
  }
});

console.log(`Report generated at: reports/cucumber-html-report-${timestamp}`);