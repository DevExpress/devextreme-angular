[![Run Status](https://api.shippable.com/projects/575802872a8192902e22e62a/badge?branch=master)](https://app.shippable.com/projects/575802872a8192902e22e62a) [![npm version](https://badge.fury.io/js/devextreme-angular2.svg)](https://badge.fury.io/js/devextreme-angular2)

### If you are looking for the 16.1 branch, please forward the following [link](https://github.com/DevExpress/devextreme-angular2/tree/16.1).

# Angular 2 UI and Visualization Components Based on DevExtreme Widgets

Project status: **CTP**

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) in [Angular 2](https://angular.io/) applications.

## Getting started

You can start either with [running examples](#running-examples) or with [creating a new Angular 2 application](#create-application).

Also we have a simple application on [Plunker](http://plnkr.co/edit/HNf0vB).

### Prerequisites

<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">Node.js and npm</a> are
required and essential to Angular 2 development.

<a href="https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md" target="_blank" title="Installing Gulp">Gulp</a> is
required to build the project and run tests.


### <a name="running-examples"></a>Running examples

Install the required node packages and run an http server:

```
npm install
npm start
```

Navigate to [http://127.0.0.1:8875/examples/](http://127.0.0.1:8875/examples/) in the opened browser window. Explore the **examples** folder of this repository for the examples source code.

### <a name="create-application"></a>Adding DevExteme widgets to an Angular 2 application

We will use [Angular 2 quick-start tutorial](https://angular.io/docs/ts/latest/quickstart.html) as a base project for this guide. Please follow the
[original tutorial steps](https://github.com/angular/quickstart/blob/master/README.md) to bootstrap the application.

Once the application is ready and works install the devextreme-angular2 npm package as follows:

```
npm install devextreme-angular2
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
    'devextreme-angular2': 'npm:devextreme-angular2', // <== add this line
    // other libraries
    'rxjs': 'npm:rxjs',
    'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api'
},
packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'devextreme-angular2':        { main: 'index.js', defaultExtension: 'js' }, // <== add this line
    'devextreme':                 { defaultExtension: 'js' }                    // <== add this line
}
```

Add the required DevExtreme modules to the **/app/app.module.ts** file and add them to the imports section of the application module:

```js
import { DevExtremeModule } from 'devextreme-angular2';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        DevExtremeModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

Now you can use the widget within the component's template.

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

```
npm start
```

## API Reference

DevExtreme Angular 2 components mirror
[DevExtreme JavaScript API](http://js.devexpress.com/Documentation/ApiReference/) but use
Angular 2 syntax for specifying widget options, subscribing to events and custom templates declaration.

## Usage Samples

### Static option value

To specify a widget's option statically
(the [text](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/?version=15_2#text)
option of dxButton):

```html
<dx-button text="Simple button"></dx-button>
```

### Event handling

To bind the dxButton’s [click](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Events/?version=15_2#click) event:

```html
<dx-button (onClick)="handler()"></dx-button>
```

### One-way option binding

If we want changes to the value of ‘bindingProperty’ of the host component to propagate to the
[value](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/?version=15_2#value) of the dxTextBox widget,
a one-way binding approach is used:

```html
<dx-text-box [value]="bindingProperty"></dx-text-box>
```

### Two-way option binding

In addition to the one-way binding, we can also perform two-way binding, which propagates changes from the bindingProperty to the widget
or vice versa from the widget to the bindingProperty:

```html
<dx-text-box [(value)]="bindingProperty"></dx-text-box>
```

### Custom Templates

In case you want to customize the rendering of a DevExtreme widget, we support custom templates. For instance, we can specify
the [itemTemplate](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxList/Configuration/?version=15_2#itemTemplate)
and [groupTemplate](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxList/Configuration/?version=15_2#groupTemplate)
of the dxList widget as follows:

```html
<dx-list [grouped]="true" [items]="grouppedItems">
    <div *dxTemplate="let item of 'itemTemplate'">
        {{item.someProperty}}
    </div>
    <div *dxTemplate="let group of 'groupTemplate'">
        {{group.someProperty}}
    </div>
</dx-list>
```
The local 'item' and 'group' variables (that are declared via the 'let' keyword) expose the corresponding item data object. You can use it to
render the data where you need inside the template.

### Widgets with transcluded content

In addition to using dxTemplate, it is possible to put the content of the following widgets directly into the markup: 
[DxResizable](https://js.devexpress.com/Documentation/16_1/ApiReference/UI_Widgets/dxResizable/), 
[DxScrollView](https://js.devexpress.com/Documentation/16_1/ApiReference/UI_Widgets/dxScrollView/), 
[DxPopup](https://js.devexpress.com/Documentation/16_1/ApiReference/UI_Widgets/dxPopup/), 
[DxPopover](https://js.devexpress.com/Documentation/16_1/ApiReference/UI_Widgets/dxPopover/).
For instance, we can set the content for 
the [DxScrollView](https://js.devexpress.com/Documentation/16_1/ApiReference/UI_Widgets/dxScrollView/) widget as shown below: 

```html
<dx-scroll-view>
    <div>Some scrollable content</div>
</dx-scroll-view>
```

### Angular 2 Forms

The DevExtreme Angular 2 editors support the 'ngModel' binding as well as the 'formControlName' directive, which are necessary for the
[Angular 2 forms](https://angular.io/docs/ts/latest/guide/forms.html) features.

```html
<form [formGroup]="form">
        <dx-text-box
            name="email"
            [(ngModel)]="email"
            [isValid]="emailControl.valid || emailControl.pristine"
            [validationError]="{ message: 'Email is invalid'}">
        </dx-text-box>
</form>
```


```js
@Component({
   selector: 'my-app',
   templateUrl: 'app/app.component.html'
})
export class AppComponent implements OnInit {
   email: string;
   emailControl: AbstractControl;
   form: FormGroup;
   ngOnInit() {
       this.form = new FormGroup({
           email: new FormControl('', Validators.compose([Validators.required, CustomValidator.mailFormat]))
       });
       this.emailControl = this.form.controls['email'];
   }
}
```

### Using DevExtreme validation features 

You can use the [built-in validators](https://js.devexpress.com/Documentation/16_1/ApiReference/UI_Widgets/dxValidator/Validation_Rules/), 
validation summary and other DevExtreme validation features with Angular 2 DevExtreme editors.


```html
<dx-validation-group>

    <dx-text-box [(value)]="email">
        <dx-validator [validationRules]="validationRules.email"></dx-validator>
    </dx-text-box>
    <dx-text-box [(value)]="password" mode="password">
        <dx-validator [validationRules]="validationRules.password"></dx-validator>
    </dx-text-box>

    <dx-validation-summary></dx-validation-summary>

    <dx-button (onClick)="validate($event)" text="Submit"></dx-button>

</dx-validation-group>
```


```js
@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    email: string;
    password: string;
    validationRules = {
        email: [
            { type: 'required', message: 'Email is required.' },
            { type: 'email', message: 'Email is invalid.' }
        ],
        password: [
            { type: 'required', message: 'Email is required.' }
        ]
    };
    validate(params) {
        let result = params.validationGroup.validate();
        if (result.isValid) {
            // form data is valid
            // params.validationGroup.reset();
        }
    }
}
```


### Accessing a DevExtreme Widget Instance

You can access a DevExtreme widget instance by using the Angular 2 component query syntax and the component's
'instance' property. In the example below, the
[refresh](https://js.devexpress.com/Documentation/16_1/ApiReference/UI_Widgets/dxDataGrid/Methods/#refresh)
method of the dxDataGrid is called:


```js
import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular2";

@Component({
    selector: 'my-app',
    template: `
        <dx-data-grid [dataSource]="dataSource"></dx-data-grid>
        <dx-button text="Refresh data" (onClick)="refresh()"></dx-button>
    `
})
export class AppComponent implements OnChanges {
    @ViewChild(DxDataGridComponent) dataGrid:DxDataGridComponent
    refresh() {
        this.dataGrid.instance.refresh();
    }
}
```

## License

Familiarize yourself with the
[DevExtreme Commercial License](https://www.devexpress.com/Support/EULAs/DevExtreme.xml).
[Free trial is available!](http://js.devexpress.com/Buy/)

**DevExtreme Angular 2 components are released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

## Support & Feedback

* For general Angular 2 topics, follow [these guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md)
* For questions regarding DevExtreme libraries and JavaScript API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
* For DevExtreme Angular 2 integration bugs, questions and suggestions, use the [GitHub issue tracker](https://github.com/DevExpress/devextreme-angular2/issues)
