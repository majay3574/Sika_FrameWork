// filepath: c:\Users\AjayMichael\Downloads\sakura_framework\cucumber.js
const common = {
  requireModule: ['ts-node/register'],
  require: [
    'step_definitions/**/*.ts',
    'hooks/**/*.ts'
  ],
  format: [
    'progress',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    //'allure-cucumberjs:reports/allure-results/' // Ensure this ends with a slash
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  }
};
module.exports = {

  chrome: {
    ...common,
    worldParameters: {
      browser: 'chrome'
    }
  },

  msedge: {
    ...common,
    worldParameters: {
      browser: 'msedge'
    }
  },
  firefox: {
    ...common,
    worldParameters: {
      browser: 'firefox'
    }
  },
  webkit: {
    ...common,
    worldParameters: {
      browser: 'webkit'
    }
  },
  default: {
    ...common,
    worldParameters: {
      browser: 'chrome'
    }
  }
};