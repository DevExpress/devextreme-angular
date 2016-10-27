// /*global jasmine, __karma__, window*/
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

__karma__.loaded = function () {};

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
    var coreTesting = providers[0];
    var browserTesting = providers[1];

    coreTesting.TestBed.initTestEnvironment(
            browserTesting.BrowserDynamicTestingModule,
            browserTesting.platformBrowserDynamicTesting());
  })
  .then(function() {
    return System.import('jquery').then(function($) {
      $.noConflict(true); 
    });
  })
  .then(function() {
    return Promise.all(
      allSpecFiles.map(function (moduleName) {
        return System.import(moduleName);
      }));
  })
  .then(__karma__.start, __karma__.error);
