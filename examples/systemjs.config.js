(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': '../node_modules/'
    },
    map: {
      // our app is within the app folder
      app: 'app',
      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/common/http': 'npm:@angular/common/bundles/common-http.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      'tslib': 'npm:tslib/tslib.js',
      // devextreme & devextreme deps
      'devextreme': 'npm:devextreme',
      'jszip': 'npm:jszip/dist/jszip.min.js',
      '../../dist': '../../dist',
      // other libraries
      'rxjs': 'npm:rxjs'
    },
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      '../../dist': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'devextreme': {
        defaultExtension: 'js'
      }
    }
  });
})(this);
