(function (global) {
  System.config({
    transpiler: 'ts',
    typescriptOptions: {
        module: "commonjs",
        emitDecoratorMetadata: true,
        experimentalDecorators: true
    },
    meta: {
        'typescript': {
            "exports": "ts"
        }
    },
    paths: {
      // paths serve as alias
      'npm:': '../node_modules/'
    },
    map: {
      'ts': 'npm:plugin-typescript/lib/plugin.js',
      'typescript': 'npm:typescript/lib/typescript.js',
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
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      'devextreme-angular': '../npm/dist',

      // devextreme & devextreme deps
      'devextreme': 'npm:devextreme',
      'devexpress-diagram': 'npm:devexpress-diagram',
      'devexpress-gantt': 'npm:devexpress-gantt/dist/dx-gantt.js',
      'jszip': 'npm:jszip/dist/jszip.min.js',
      'quill-delta-to-html': 'npm:quill-delta-to-html/dist/browser/QuillDeltaToHtmlConverter.bundle.js',
      'quill': 'npm:quill/dist/quill.min.js',
      // other libraries
      'rxjs': 'npm:rxjs'
    },
    packages: {
      app: {
        main: './main.ts',
        defaultExtension: 'ts'
      },
      rxjs: {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'rxjs/operators': {
        main: 'index.js', 
        defaultExtension: 'js'
      },
      'devextreme': {
        defaultExtension: 'js'
      },
      'devextreme/events/utils': {
        main: 'index'
      },
      'devextreme/events': {
        main: 'index'
      },
    },
    packageConfigPaths: [
      '../npm/*/package.json',
      '../npm/dist/*/package.json',
      '../npm/dist/ui/*/package.json',
    ]
  });
})(this);
