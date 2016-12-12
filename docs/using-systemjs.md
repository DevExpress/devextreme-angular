# Using the DevExtreme Angular 2 components with the SystemJS module loader

**:red_circle: This is not the perfect arrangement for your application. It is not designed for production. 
It exists primarily to get you started quickly with learning and prototyping in Angular and DevExtreme.**

We will use [Angular 2 quick-start tutorial](https://angular.io/docs/ts/latest/quickstart.html) as a base project for this guide. Please follow the
[original tutorial steps](https://github.com/angular/quickstart/blob/master/README.md) to bootstrap the application.

Once the application is ready and works install the devextreme-angular npm package as follows:

```bash
npm install --save devextreme@16.2 devextreme-angular@16.2
```

Modify the references in the index.html file as follows:

```html
<link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.common.css" />
<link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.light.css" />

<!-- Polyfill(s) for older browsers -->
<script src="node_modules/core-js/client/shim.min.js"></script>

<script src="node_modules/zone.js/dist/zone.js"></script>
<script src="node_modules/reflect-metadata/Reflect.js"></script>
<script src="node_modules/systemjs/dist/system.src.js"></script>

<script src="systemjs.config.js"></script>
```

Make sure your html document has DOCTYPE specified:

```html
<!DOCTYPE html>
<html>
  ...
```

Modify the 'systemjs.config.js' file as follows:

```js
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
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
    // devextreme & devextreme deps
    'devextreme': 'npm:devextreme',                   // <== add this line
    'jquery': 'npm:jquery/dist/jquery.min.js',        // <== add this line
    'jszip': 'npm:jszip/dist/jszip.min.js',           // <== add this line
    'devextreme-angular': 'npm:devextreme-angular', // <== add this line
    // other libraries
    'rxjs': 'npm:rxjs',
    'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api'
},
packages: {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'devextreme-angular':         { main: 'index.js', defaultExtension: 'js' }, // <== add this line
    'devextreme':                 { defaultExtension: 'js' }                    // <== add this line
}
```

Add the required DevExtreme modules to the **/app/app.module.ts** file and add them to the imports section of the application module:

```js
import { DxButtonModule } from 'devextreme-angular';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        DxButtonModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
Note, you can import the **DevExtremeModule** module to include all the DevExtreme components at once.  

Now you can use a DevExteme component within the main component's template.

```js
@Component({
    selector: 'my-app',
    template: '<dx-button text="Press me" (onClick)="helloWorld()"></dx-button>'
})
export class AppComponent {
    helloWorld() {
        alert('Hello world!');
    }
}
```

Run the application:

```bash
npm start
```
