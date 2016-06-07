// /*global jasmine, __karma__, window*/
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

__karma__.loaded = function () {
};

function isSpecFile(path) {
  return /\.spec\.js$/.test(path);
}

var allSpecFiles = Object.keys(window.__karma__.files)
  .filter(isSpecFile);

System.config({
  baseURL: '/base',
  packageWithIndex: true
});

System.import('karma.systemjs.conf.js')
  .then(function () {
    return Promise.all([
      System.import('@angular/core/testing'),
      System.import('@angular/platform-browser-dynamic/testing')
    ])
  })
  .then(function (providers) {
    var testing = providers[0];
    var testingBrowser = providers[1];

    testing.setBaseTestProviders(
      testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
      testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);
  })
  .then(function() {
    return Promise.all(
      allSpecFiles.map(function (moduleName) {
        return System.import(moduleName);
      }));
  })
  .then(__karma__.start, __karma__.error);
