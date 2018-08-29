[![CircleCI](https://img.shields.io/circleci/project/github/DevExpress/devextreme-angular/master.svg)](https://circleci.com/gh/DevExpress/devextreme-angular) [![npm version](https://badge.fury.io/js/devextreme-angular.svg)](https://badge.fury.io/js/devextreme-angular)

### If you are looking for the v18.1 branch, please follow this link: [https://github.com/DevExpress/devextreme-angular/tree/18.1](https://github.com/DevExpress/devextreme-angular/tree/18.1).

# Angular UI and Visualization Components Based on DevExtreme Widgets #

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) in [Angular](https://angular.io/) applications.

* [Getting started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [DevExtreme installation](#add-to-existing-app)
  * [Starting a new application](#create-application)
  * [Server-side Rendering](#server-side-rendering)
  * [Running the local examples](#running-examples)
  * [Include jQuery integration](#jquery-integration)
* [Usage samples](#usage-samples)
  * [Static string option value](#static-option)
  * [Static non-string option value](#static-non-string-option)
  * [Event handling](#event-handling)
  * [Callback functions](#callback-functions)
  * [One-way option binding](#one-way-binding)
  * [Two-way option binding](#two-way-binding)
  * [Custom templates](#custom-templates)
  * [Data layer](#data-layer)
  * [DevExtreme utils](#devextreme-utils)
  * [Components with transcluded content](#components-with-transcluded-content)
  * [Angular forms](#angular-forms)
  * [Using DevExtreme validation features](#devextreme-validation-features)
  * [Configuration components](#configuration-components)
  * [Accessing a DevExtreme widget instance](#accessing-widget-instance)
  * [Angular change detection](#angular-change-detection)
* [Demos](#demos)
* [API reference](#api-reference)
* [Bundle size optimization](#bundle-optimization)
* [License](#license)
* [Support & feedback](#support-feedback)
* [Version history](#version-history)

## <a name="getting-started"></a>Getting Started ##

You have the following options to start:

* Play around with our [Plunker](http://next.plnkr.co/edit/XuAPDd?preview) or [Stackblitz](https://stackblitz.com/edit/angular-c2djgn) without installing anything
* [Add DevExtreme to your existing Angular application](#add-to-existing-app)
* [Creating a new Angular application](#create-application) and install DevExtreme
* [Run the local examples](#running-examples)

### <a name="prerequisites"></a>Prerequisites ###

**Starting with v18.1, DevExtreme-Angular requires [Angular](https://angular.io/) version 5 or later**

<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">Node.js and npm</a> are
required and essential to Angular development.

<a href="https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md" target="_blank" title="Installing Gulp">Gulp</a> is
required to build the project and run tests.

### <a name="add-to-existing-app"></a>Adding DevExteme to an Existing Angular Application ###

#### <a name="installation"></a>Install DevExtreme ####

Install the **devextreme** and **devextreme-angular** npm packages:

```bash
npm install --save devextreme devextreme-angular
```

#### <a name="additional-configuration"></a>Additional Configuration ####

The further configuration steps depend on which build tool, bundler or module loader you are using. Please choose the one you need:

* [Configuring SystemJS](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-systemjs.md#configuration)
* [Configuring Angular CLI](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-angular-cli.md#configuration)
    - [Third-party dependencies registration in Angular CLI 6+](https://github.com/DevExpress/devextreme-angular/blob/master/docs/setup-3rd-party-dependencies.md)
* [Configuring Webpack](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-webpack.md#configuration)
* [Configuring Rollup](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-rollup.md#configuration)
* [Configuring Ionic 2](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-ionic2.md#configuration)

#### <a name="import-modules"></a>Import DevExtreme Modules ####

Go to your main .ts file (usually *src/app.module.ts*) and import the required modules to your app:

```js
...
import { DxButtonModule } from 'devextreme-angular';

@NgModule({
    ...
    imports: [
        ...
        DxButtonModule,
        ...
    ]
})
export class AppModule {}
```

Note, you can import the **DevExtremeModule** module to include all the DevExtreme components at once, but it might affect the final bundle size and startup time.
Check the [bundle optimization](#bundle-optimization) section for more info.

#### Use DevExtreme Components  ####

Now you can use a DevExteme component in your application:

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

### <a name="create-application"></a>Create a new Angular Application ###

Depending on your requirements you can choose one of the following ways to start:

* [Start with SystemJS](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-systemjs.md)
* [Start with Angular CLI](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-angular-cli.md)
    - [Third-party dependencies registration in Angular CLI 6+](https://github.com/DevExpress/devextreme-angular/blob/master/docs/setup-3rd-party-dependencies.md)
* [Start with Webpack](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-webpack.md)
* [Start with Rollup](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-rollup.md)
* [Start with Ionic 2](https://github.com/DevExpress/devextreme-angular/blob/master/docs/using-ionic2.md)

### <a name="server-side-rendering"></a>Server-side Rendering ###

Angular Universal provides [server-side rendering](https://angular.io/guide/universal#angular-universal-server-side-rendering) that significantly reduces the application's loading time. You can use DevExtreme widgets in Angular Universal applications in the same manner as in other Angular apps.

**Note: DevExtreme-angular does not support [dynamic theme loading](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/#Themes_in_DevExtreme_Apps) in the Server-side rendering mode due to technical restrictions. You can only use a single static theme by linking the corresponding CSS file.**

You can [create a new Angular Universal app](https://github.com/angular/angular-cli/wiki/stories-universal-rendering#angular-universal-integration) and [add DevExtreme widgets](#add-to-existing-app) to it, or add the Universal module to an existing Angular application with DevExtreme. Use the following command to add the Universal module to an existing app:

```bash
ng generate universal my-app
```

See [Angular 5.1 & More Now Available](https://blog.angular.io/angular-5-1-more-now-available-27d372f5eb4e) for more information.

[This example](https://github.com/DevExpress/devextreme-examples/tree/18_1/universal-angular) demonstrates the use of DevExtreme Angular controls in an Angular Universal application.

#### <a name="cache-requests"></a>Cache Requests on the Server ####

DevExtreme-angular supports caching requests on the server in the server-side rendering mode. This avoids repeatedly requesting data from the browser and renders widgets using data that is initially applied when the page is loaded for the first time.

To enable caching, import the `DxServerTransferStateModule` module in the module's .ts file (usually *src/app.module.ts*):

```js
import { DxServerTransferStateModule } from 'devextreme-angular';

@NgModule({
    ...
    imports: [
        ...
        DxServerTransferStateModule,
        ...
    ]
})
export class AppModule {}
```

and import the the `ServerTransferStateModule` module in the server module's .ts file (usually *src/app.server.module.ts*):

```js
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

@NgModule({
    imports: [
        AppModule,
        ServerModule,
        ServerTransferStateModule,
        ModuleMapLoaderModule
    ],
    bootstrap: [AppComponent],
})
```

Also, ensure that the application module is bootstrapped when the document has been loaded (the *main.ts* file should contain the code below). Otherwise, caching does not work correctly.

```js
document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.log(err));
});
```

### <a name="running-examples"></a>Running the Local Examples ###

```bash
# clone our repo
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/DevExpress/devextreme-angular.git

# change directory to our repo
cd devextreme-angular

# install the repo with npm
npm install

# start the web-server
npm start

```

Navigate to [http://127.0.0.1:8875/examples/](http://127.0.0.1:8875/examples/) in the opened browser window. Explore the **examples** folder of this repository for the examples source code.

### <a name="jquery-integration"></a>Include jQuery integration ###
Starting with version 17.2, DevExtreme doesn't depend on jQuery. It means that our widgets work without jQuery elements. If you need to use jQuery, you can manually install the jquery npm package and include the jQuery integration as described below:

```bash
npm install --save jquery
```

```js
import 'devextreme/integration/jquery';
```

## <a name="usage-samples"></a>Usage Samples ##

### <a name="static-option"></a>Static String Option Value ###

To specify a string widget's option statically
(the [text](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/#text)
option of dxButton):

```html
<dx-button text="Simple button"></dx-button>
```

### <a name="static-non-string-option"></a>Static Non-string Option Value ###

To specify a non-string widget's option statically
(the [disabled](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/#disabled)
option of dxButton):

```html
<dx-button [disabled]="false"></dx-button>
```

### <a name="event-handling"></a>Event Handling ###

To bind the dxButton’s [click](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Events/#click) event:

```html
<dx-button (onClick)="handler()"></dx-button>
```

### <a name="callback-functions"></a>Callback Functions ###

To specify a widget's option using a callback function (the [layer.customize](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxVectorMap/Configuration/layers/#customize)
option of dxVectorMap):

```html
<dx-vector-map>
    ...
    <dxi-layer
        ...
        [customize]="customizeLayers">
    </dxi-layer>
</dx-vector-map>
```

Note that callback functions are executed _outside_ the context of the component, but if the context is important, you can explicitly bind it to the callback function in the constructor.

```js
constructor() {
    this.customizeLayers = this.customizeLayers.bind(this);
}

customizeLayers(elements) {
    let country = this.myCountry;
    ...
}
```

### <a name="one-way-binding"></a>One-way Option Binding ###

If we want changes to the value of ‘bindingProperty’ of the host component to propagate to the
[value](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#value) of the dxTextBox widget,
a one-way binding approach is used:

```html
<dx-text-box [value]="bindingProperty"></dx-text-box>
```

### <a name="two-way-binding"></a>Two-way Option Binding ###

In addition to the one-way binding, we can also perform two-way binding, which propagates changes from the bindingProperty to the widget
or vice versa from the widget to the bindingProperty:

```html
<dx-text-box [(value)]="bindingProperty"></dx-text-box>
```

### <a name="custom-templates"></a>Custom Templates ###

In case you want to customize the rendering of a DevExtreme widget, we support custom templates. For instance, we can specify
the [itemTemplate](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxList/Configuration/#itemTemplate)
and [groupTemplate](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxList/Configuration/#groupTemplate)
of the dxList widget as follows:

```html
<dx-list [grouped]="true" [items]="grouppedItems">
    <div *dxTemplate="let itemData of 'item'; let itemIndex = index">
        {{itemIndex}} - {{itemData.someProperty}}
    </div>
    <div *dxTemplate="let groupData of 'group'">
        {{groupData.someProperty}}
    </div>
</dx-list>
```
The local 'itemData' and 'groupData' variables (that are declared via the 'let' keyword) expose the corresponding item data object. You can use it to
render the data where you need inside the template.

The 'item' and 'group' names are default template names for the 'itemTemplate' and 'groupTemplate' options of the dxList widget.

### <a name="data-layer"></a>Data Layer ###

The DevExtreme framework includes a data layer, which is a set of complementary components that enable you to read and write data.
For more details please refer to [the documentation on the official website](https://js.devexpress.com/Documentation/Guide/Data_Layer/Data_Layer/).

### <a name="devextreme-utils"></a>DevExtreme Utils ###

The DevExtreme provides utils that can be used in different application parts such as widgets and data. For more details please refer to [the documentation on the official website](https://js.devexpress.com/Documentation/ApiReference/Common/utils/).

### <a name="components-with-transcluded-content"></a>Components with Transcluded Content ###

In addition to using dxTemplate, it is possible to put the content of the following widgets directly into the markup:
[dxResizable](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxResizable/),
[dxScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/),
[dxValidationGroup](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxValidationGroup/).
For instance, we can set the content for
the [dxScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/) widget as shown below:

```html
<dx-scroll-view>
    <div>Some scrollable content</div>
</dx-scroll-view>
```

### <a name="angular-forms"></a>Angular Forms ###

The DevExtreme Angular editors support the 'ngModel' binding as well as the 'formControlName' directive, which are necessary for the
[Angular forms](https://angular.io/docs/ts/latest/guide/forms.html) features.

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
           email: new FormControl('', Validators.compose([Validators.required, Validators.email]))
       });
       this.emailControl = this.form.controls['email'];
   }
}
```

### <a name="devextreme-validation-features"></a>Using DevExtreme Validation Features ###

You can use the [built-in validators](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxValidator/Validation_Rules/),
validation summary and other DevExtreme validation features with Angular DevExtreme editors.


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

### <a name="configuration-components"></a>Configuration Components ###

You can use `dxo-` ('o' is a contraction of 'option') prefixed components to configure complex nested options for widgets.
The following example demonstrates how to configure the [tooltip](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxTreeMap/Configuration/tooltip/) option of the dxTreeMap widget:

```html
<dx-tree-map [dataSource]="treeData">
    <dxo-tooltip [enabled]="showTooltip" format="thousands"></dxo-tooltip>
</dx-tree-map>

<dx-button text="Toggle tooltip" (onClick)="toggleTooltip()"></dx-button>
```

```js
@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    treeData = ...;
    showTooltip = false;
    toggleTooltip() {
        this.showTooltip = !this.showTooltip;
    }
}
```

You can also use `dxi-` ('i' is a contraction of 'item') prefixed components to configure complex collection options for widgets.
The following example demonstrates how to configure the [columns](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/) option of the dxDataGrid widget:

```html
<dx-data-grid [dataSource]="data">
    <dxi-column dataField="firstName" caption="First Name"></dxi-column>
    <dxi-column dataField="lastName" caption="Last Name" [visible]="showLastName"></dxi-column>
</dx-data-grid>

<dx-button text="Toggle the 'Last Name' column" (onClick)="toggleLastName()"></dx-button>
```

```js
@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    data = ...;
    showLastName = false;
    toggleLastName() {
        this.showLastName = !this.showLastName;
    }
}
```

To configure options that can accept a configuration object or an array of configuration objects, use `dxi-` prefixed components.
The following example demonstrates how to configure the [valueAxis](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxChart/Configuration/valueAxis/) option of the dxChart widget:

```html
<dx-chart [dataSource]="data">
    <dxi-series valueField="value" argumentField="argument"></dxi-series>
    <dxi-value-axis>
        <dxo-label format="millions"></dxo-label>
    </dxi-value-axis>
</dx-chart>
```

```js
@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    data = ...;
}
```

It is possible to specify an item template inside the `dxi-` prefixed components and use Angular
[structural directives](https://angular.io/docs/ts/latest/guide/structural-directives.html) such as ngFor. Note that
the available item properties are described in the [Default Item Template](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxList/Default_Item_Template/)
section of a corresponding widget documentation reference.

```html
<dx-list>
    <dxi-item>
        <h1>Items available</h1>
    </dxi-item>
    <dxi-item *ngFor="let item of listItems" [badge]="item.badge">
        <h2>{{item.text}}</h2>
    </dxi-item>
</dx-list>
```

```js
@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    listItems = [
        {
            text: 'Cars',
            badge: '12'
        },
        {
            text: 'Bikes',
            badge: '5'
        }
    ];
}
```

If your item template contains some *nested* components, declare it using the parameterless `dxTemplate` structural directive as follows:

```html
<dx-list>
    <dxi-item>
        <div *dxTemplate>
            <dx-button text="I'm a nested child component"></dx-button>
        </div>
    </dxi-item>
</dx-list>
```

Angular has a built-in `template` directive. To define the `template` property of the configuration component (for example, `dxo-master-detail`), use the following code:
```html
<dxo-master-detail [template]="'masterDetail'"></dxo-master-detail>
```

Note that some options with an object type are not implemented as nested components - for example,
[editorOptions of dxDataGrid](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#editorOptions), [editorOptions of dxForm](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxForm/Item_Types/SimpleItem/#editorOptions), [the widget option of dxToolbar](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxToolbar/Default_Item_Template/#options).

### <a name="accessing-widget-instance"></a>Accessing a DevExtreme Widget Instance ###

You can access a DevExtreme widget instance using the `@ViewChild` or `@ViewChildren` decorator (depending on whether you are getting just one or several instances of one widget) and the component's
'instance' property. Both decorators accept a component name or a [template reference variable](https://angular.io/guide/template-syntax#template-reference-variables--var-). In the example below, the
[refresh](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#refresh)
method of the dxDataGrid is called:

```js
import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";

@Component({
    selector: 'my-app',
    template: `
        <dx-data-grid #targetDataGrid [dataSource]="dataSource"></dx-data-grid>
        <dx-button text="Refresh data" (onClick)="refresh()"></dx-button>
    `
})
export class AppComponent implements OnChanges {
    @ViewChild(DxDataGridComponent) dataGrid:DxDataGridComponent
    // or
    // @ViewChild("targetDataGrid") dataGrid: DxDataGridComponent
    refresh() {
        this.dataGrid.instance.refresh();
    }
}
```

To access a DevExtreme widget instance in markup, you can use the same template reference variables. The following example demonstrates how you can get a dxSelectBox value in the template.

```html
<dx-select-box #selectbox [items]="items"></dx-select-box>
{{selectbox.value}}
```

### <a name="angular-change-detection"></a>Angular Change Detection ###

By default, in Angular, options changes are checked on each user action.
If you bind a widget option to this function, it should return a static object.
Otherwise, Angular considers that the option is constantly changed after each user action.
Alternatively, you can change the default behavior and set the [ChangeDetectionStrategy](https://angular.io/docs/ts/latest/api/core/index/ChangeDetectionStrategy-enum.html) component option to "OnPush".

```js
import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'my-app',
    ....
    changeDetection: ChangeDetectionStrategy.OnPush
})
```

## <a name="demos"></a>Demos ##

* [GolfClub real-world application](https://devexpress.github.io/golfclub/) ([sources](https://github.com/DevExpress/golfclub))
* [Lots of feature-based examples](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Data_Grid/LocalDataSource/Angular/Light/)

## <a name="api-reference"></a>API Reference ##

DevExtreme Angular components mirror
[DevExtreme JavaScript API](http://js.devexpress.com/Documentation/ApiReference/) but use
[Angular syntax](#usage-samples) for specifying widget options, subscribing to events and custom templates declaration.

## <a name="bundle-optimization"></a>Bundle Size Optimization ##

### Bundlers with Tree Shaking Support ###

*Tree shaking* can greatly reduce the downloaded size of the application by removing unused portions of both source and library code. There are a number of
bundlers with tree shaking support, such as Webpack 2, Rollup, SystemJS Bundler, etc. Due to specifics of the tree shaking algorithm, your project typescript sources should
be prepared accordingly to make tree shaking available. This preparations are [performed by the Angular Compiler](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html#!#tree-shaking).
You can follow one of the existing guides to configure tree shaking with your bundler ([Webpack 2](http://blog.rangle.io/optimize-your-angular2-application-with-tree-shaking/),
[Angular CLI](https://github.com/angular/angular-cli#bundling),
[Rollup](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html#!#tree-shaking)).

To make it work with DevExtreme Angular package, you just need to import only the modules required in your application, not the whole DevExtremeModule. For instance,
you can import only DxButtonModule as follows:

```js
import { DxButtonModule } from 'devextreme-angular';
```

Note, AOT Compilation also decreases a bundle size by precompiling your HTML templates. So, the markup and the template compiler are not included into the final bundle.

### Bundlers without Tree Shaking Support  ###

If you are not going to configure tree shaking, you can optimize your bundle size by using imports from specific modules, not from the main 'devextreme-angular' module. You can do this
as follows:

```js
import { DxButtonModule } from 'devextreme-angular/ui/button';
```

## <a name="license"></a>License ##

Familiarize yourself with the
[DevExtreme License](https://js.devexpress.com/Licensing/).
[Free trial is available!](http://js.devexpress.com/Buy/)

**DevExtreme Angular components are released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

## <a name="support-feedback"></a>Support & Feedback ##

* For general Angular topics, follow [these guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md)
* For questions regarding DevExtreme libraries and JavaScript API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
* For DevExtreme Angular integration bugs, questions and suggestions, use the [GitHub issue tracker](https://github.com/DevExpress/devextreme-angular/issues)

## <a name="version-history"></a>Version history ###

| DevExtreme | Angular |
| ---------- | ----------------|
| v18.1+     | v5.0 - v6.0+ | 
| v17.1+ <br/> v17.2+ | v2.4 - v5.0+ | 
 