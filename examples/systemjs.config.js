(function (global) {
  const widgets = [
      'accordion',
      'action-sheet',
      'autocomplete',
      'bar-gauge',
      'box',
      'bullet',
      'button',
      'button-group',
      'calendar',
      'chart',
      'check-box',
      'circular-gauge',
      'color-box',
      'context-menu',
      'data-grid',
      'date-box',
      'defer-rendering',
      'drawer',
      'drop-down-box',
      'drop-down-button',
      'file-uploader',
      'filter-builder',
      'form',
      'funnel',
      'gallery',
      'html-editor',
      'linear-gauge',
      'list',
      'load-indicator',
      'load-panel',
      'lookup',
      'map',
      'menu',
      'multi-view',
      'nav-bar',
      'nested',
      'number-box',
      'pie-chart',
      'pivot-grid',
      'pivot-grid-field-chooser',
      'polar-chart',
      'popover',
      'popup',
      'progress-bar',
      'radio-group',
      'range-selector',
      'range-slider',
      'recurrence-editor',
      'resizable',
      'responsive-box',
      'sankey',
      'scheduler',
      'scroll-view',
      'select-box',
      'slide-out',
      'slide-out-view',
      'slider',
      'sparkline',
      'speed-dial-action',
      'switch',
      'tab-panel',
      'tabs',
      'tag-box',
      'text-area',
      'text-box',
      'tile-view',
      'toast',
      'toolbar',
      'tooltip',
      'tree-list',
      'tree-map',
      'tree-view',
      'validation-group',
      'validation-summary',
      'validator',
      'vector-map'
  ].reduce((acc, item) => {
    acc[`devextreme-angular/ui/${item}`] = `../npm/dist/bundles/devextreme-angular-ui-${item}.umd.js`;
    return acc;
  }, {});

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

      'devextreme-angular': '../npm/dist/bundles/devextreme-angular.umd.js',
      'devextreme-angular/core': '../npm/dist/bundles/devextreme-angular-core.umd.js',
      ...widgets,
      // devextreme & devextreme deps
      'devextreme': 'npm:devextreme',
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
      }
    }
  });
})(this);
