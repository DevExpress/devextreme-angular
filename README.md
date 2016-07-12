[![Run Status](https://api.shippable.com/projects/575802872a8192902e22e62a/badge?branch=master)](https://app.shippable.com/projects/575802872a8192902e22e62a)

# Angular 2 UI and Visualization Components Based on DevExtreme Widgets

Project status: **CTP**

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) in [Angular 2](https://angular.io/) applications.

## Getting started

You can start either with [running examples](#running-examples) or with [creating a new Angular 2 application](#create-application).

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
[original tutorial steps](https://github.com/angular/quickstart/blob/master/README.md) to bootstarp the application.

Once the application is ready and works install the devextreme-angular2 npm package as follows:

```
npm install devextreme-angular2
```

Modify the references in the index.html file as follows:

```html
    <link rel="stylesheet" type="text/css" href="../node_modules/devextreme/dist/css/dx.common.css" />
    <link rel="stylesheet" type="text/css" href="../node_modules/devextreme/dist/css/dx.light.css" />

    <script src="../node_modules/core-js/client/shim.min.js"></script>
    <script src="../node_modules/zone.js/dist/zone.js"></script>
    <script src="../node_modules/reflect-metadata/Reflect.js"></script>
    <script src="../node_modules/systemjs/dist/system.src.js"></script>

    <script src="../node_modules/jquery/dist/jquery.min.js"></script>
    <script src="../node_modules/devextreme/dist/js/dx.all.js"></script>

    <script src="systemjs.config.js"></script>
```

Make sure your html document has DOCTYPE specified:

```html
<!DOCTYPE html>
<html>
  ...
```

Modify the 'system.config.js' file as follows:

```js
  var map = {
    'app':                        'app',
    '@angular':                   'node_modules/@angular',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs':                       'node_modules/rxjs',
    'devextreme-angular2':        'node_modules/devextreme-angular2' // <== add this line
  };

  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'devextreme-angular2':        { main: 'index.js', defaultExtension: 'js' } // <== add this line
  };
```

In the **/app/app.component.ts** file import the necessary devextreme component:

```js
import { DxButton } from 'devextreme-angular2';
```

Add the imported components as directives to the host component. Now you can use the widget in the component's template.

```js
@Component({
    selector: 'my-app',
    template: '<dx-button text="Press me" (onClick)="helloWorld()"></dx-button>',
    directives: [ DxButton ]
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
    <div *dxTemplate="let item = data of 'itemTemplate'">
        {{item.someProperty}}
    </div>
    <div *dxTemplate="let group = data of 'groupTemplate'">
        {{group.someProperty}}
    </div>
</dx-list>
```
The local 'item' and 'group' variables (that are declared via the 'let' keyword) expose the corresponding item data object. You can use it to
render the data where you need inside the template.

### Angular 2 Forms

The DevExtreme Angular 2 editors support the 'ngModel' binding as well as the 'ngControl' directive, which are necessary for the
[Angular 2 forms](https://angular.io/docs/ts/latest/guide/forms.html) features.

```html
<form  [ngFormModel]="form">
        <dx-text-box
            [(ngModel)]="email"
            [isValid]="emailRef.valid || emailRef.pristine"
            [validationError]="{ message: 'Email is invalid'}"
            ngControl="email"
            #emailRef="ngForm">
        </dx-text-box>
</form>
```


```js
@Component({
   selector: 'my-app',
   templateUrl: "app/app.component.html",
   directives: [
       DxTextBox,
       DxTextBoxValueAccessor,
   ]
})
export class AppComponent implements OnInit {
   email: string;
   form: ControlGroup;
   ngOnInit() {
       this.form = new ControlGroup({
           email: new Control('', Validators.compose([Validators.required, CustomValidator.mailFormat]))
       });
   }
}
```

### Accessing a DevExtreme Widget Instance

You can access a DevExtreme widget instance by using the Angular 2 component query syntax and the component's
'instance' property. In the example below, the
[refresh](http://jsserver:8080/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/?version=16_1#refresh)
method of the dxDataGrid is called:


```js
import { Component, ViewChild } from '@angular/core';
import { DxDataGrid, DxButton } from "devextreme-angular2";

@Component({
    selector: 'my-app',
    template: `
        <dx-data-grid [dataSource]="dataSource"></dx-data-grid>
        <dx-button text="Refresh data" (onClick)="refresh()"></dx-button>
    `,
    directives: [ DxDataGrid, DxButton ]
})
export class AppComponent implements OnChanges {
    @ViewChild(DxDataGrid) dataGrid:DxDataGrid
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
