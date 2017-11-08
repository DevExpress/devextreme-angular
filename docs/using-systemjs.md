# Using the DevExtreme Angular Components with SystemJS

**:red_circle: This is not the perfect arrangement for your application. It is not designed for production. 
It exists primarily to get you started quickly with learning and prototyping in Angular and DevExtreme.**

## Create a new Application ##

We will use [Angular quick-start tutorial](https://angular.io/docs/ts/latest/quickstart.html) as a base project for this guide. Please follow the
[original tutorial steps](https://github.com/angular/quickstart/blob/master/README.md) to bootstrap the application.

## Add DevExtreme ##

Follow the [installation](https://github.com/DevExpress/devextreme-angular#installation) section in our Readme.

## <a name="configuration"></a>Reference DevExtreme Stylesheets ##

Modify the references in the index.html file as follows:

```html
<!-- DevExtreme stylesheets -->
<link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.common.css" />
<link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.light.css" />

<!-- Polyfill(s) for older browsers -->
<script src="node_modules/core-js/client/shim.min.js"></script>

<script src="node_modules/zone.js/dist/zone.js"></script>
<script src="node_modules/systemjs/dist/system.src.js"></script>

<script src="systemjs.config.js"></script>
```

Make sure your html document has DOCTYPE specified:

```html
<!DOCTYPE html>
<html>
  ...
```

## Configure SystemJS ##

Modify the 'systemjs.config.js' file as follows:

```js
paths: {
    // paths serve as alias
    'npm:': 'node_modules/'
},
map: {
    // our app is within the app folder
    app: 'app',
    // angular bundles
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
    // devextreme & devextreme deps
    'devextreme': 'npm:devextreme',                   // <== add this line
    'jszip': 'npm:jszip/dist/jszip.min.js',           // <== add this line
    'devextreme-angular': 'npm:devextreme-angular',   // <== add this line
    // other libraries
    'rxjs': 'npm:rxjs',
    'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
},
packages: {
    'app':                        { defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'devextreme-angular':         { main: 'index.js', defaultExtension: 'js' }, // <== add this line
    'devextreme':                 { defaultExtension: 'js' }                    // <== add this line
}
```
