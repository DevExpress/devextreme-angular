[![Run Status](https://api.shippable.com/projects/575802872a8192902e22e62a/badge?branch=master)](https://app.shippable.com/projects/575802872a8192902e22e62a) [![npm version](https://badge.fury.io/js/devextreme-angular.svg)](https://badge.fury.io/js/devextreme-angular)

# Angular 2 UI and Visualization Components Based on DevExtreme Widgets

Project status: **RC**

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) in [Angular 2](https://angular.io/) applications.

* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Running local examples](#running-examples)
  * [Starting a new application](#create-application)
* [Usage Samples](#usage-samples)
  * [Static option value](#static-option)
  * [Event handling](#event-handling)
  * [One-way option binding](#one-way-binding)
  * [Two-way option binding](#two-way-binding)
  * [Custom templates](#custom-templates)
  * [Widgets with transcluded content](#widgets-with-transcluded-content)
  * [Angular 2 forms](#angular-forms)
  * [Using DevExtreme validation features](#devextreme-validation-features)
  * [Advanced DevExtreme widget options configuration](#configuration-components)
  * [Accessing a DevExtreme widget instance](#accessing-widget-instance)
* [API Reference](#api-reference)
* [License](#license)
* [Support & Feedback](#support-feedback)

## <a name="getting-started"></a>Getting Started

You can start either with [running examples](#running-examples) or with [creating a new Angular 2 application](#create-application).

Also we have a simple application on [Plunker](http://plnkr.co/edit/tpl:3MUrYspAm1RfHLSrc6CP?p=preview), so you can check it out without installing anything.

### <a name="prerequisites"></a>Prerequisites

<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">Node.js and npm</a> are
required and essential to Angular 2 development.

<a href="https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md" target="_blank" title="Installing Gulp">Gulp</a> is
required to build the project and run tests.


### <a name="running-examples"></a>Running examples

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

### <a name="create-application"></a>Adding DevExteme widgets to an Angular 2 application

* [Using SystemJS]()
<!---* [Using Webpack]()
* [Using Angular CLI]()
* [Using Ionic 2 CLI]()
* [Using ASP.Net Core Visual Studio Template]()-->

## <a name="usage-samples"></a>Usage Samples

### <a name="static-option"></a>Static option value

To specify a widget's option statically
(the [text](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/?version=15_2#text)
option of dxButton):

```html
<dx-button text="Simple button"></dx-button>
```

### <a name="event-handling"></a>Event handling

To bind the dxButton’s [click](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Events/?version=15_2#click) event:

```html
<dx-button (onClick)="handler()"></dx-button>
```

### <a name="one-way-binding"></a>One-way option binding

If we want changes to the value of ‘bindingProperty’ of the host component to propagate to the
[value](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/?version=15_2#value) of the dxTextBox widget,
a one-way binding approach is used:

```html
<dx-text-box [value]="bindingProperty"></dx-text-box>
```

### <a name="two-way-binding"></a>Two-way option binding

In addition to the one-way binding, we can also perform two-way binding, which propagates changes from the bindingProperty to the widget
or vice versa from the widget to the bindingProperty:

```html
<dx-text-box [(value)]="bindingProperty"></dx-text-box>
```

### <a name="custom-templates"></a>Custom templates

In case you want to customize the rendering of a DevExtreme widget, we support custom templates. For instance, we can specify
the [itemTemplate](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxList/Configuration/?version=15_2#itemTemplate)
and [groupTemplate](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxList/Configuration/?version=15_2#groupTemplate)
of the dxList widget as follows:

```html
<dx-list [grouped]="true" [items]="grouppedItems">
    <div *dxTemplate="let itemData of 'item'">
        {{itemData.someProperty}}
    </div>
    <div *dxTemplate="let groupData of 'group'">
        {{groupData.someProperty}}
    </div>
</dx-list>
```
The local 'itemData' and 'groupData' variables (that are declared via the 'let' keyword) expose the corresponding item data object. You can use it to
render the data where you need inside the template.

The 'item' and 'group' names are default template names for the 'itemTemplate' and 'groupTemplate' options of the dxList widget.

### <a name="widgets-with-transcluded-content"></a>Widgets with transcluded content

In addition to using dxTemplate, it is possible to put the content of the following widgets directly into the markup: 
[DxResizable](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxResizable/), 
[DxScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/), 
[DxValidationGroup](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxValidationGroup/).
For instance, we can set the content for 
the [DxScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/) widget as shown below: 

```html
<dx-scroll-view>
    <div>Some scrollable content</div>
</dx-scroll-view>
```

### <a name="angular-forms"></a>Angular 2 forms

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

### <a name="devextreme-validation-features"></a>Using DevExtreme validation features 

You can use the [built-in validators](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxValidator/Validation_Rules/), 
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


### <a name="configuration-components"></a>Configuration components

You can use `dxo-` ('o' is a contraction of 'option') prefixed components to configure complex nested options for widgets.
The following example demonstrates how to configure the [tooltip](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxTreeMap/Configuration/tooltip/) option of the TreeMap widget: 

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
The following example demonstrates how to configure the [columns](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/) option of the DataGrid widget: 

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
The following example demonstrates how to configure the [valueAxis](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxChart/Configuration/valueAxis/) option of the Chart widget: 

```html
<dx-chart [dataSource]="data">
    <dxi-serie valueField="value" argumentField="argument"></dxi-serie>
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

### <a name="accessing-widget-instance"></a>Accessing a DevExtreme widget instance

You can access a DevExtreme widget instance by using the Angular 2 component query syntax and the component's
'instance' property. In the example below, the
[refresh](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#refresh)
method of the dxDataGrid is called:


```js
import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";

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

## <a name="api-reference"></a>API Reference

DevExtreme Angular 2 components mirror
[DevExtreme JavaScript API](http://js.devexpress.com/Documentation/ApiReference/) but use
Angular 2 syntax for specifying widget options, subscribing to events and custom templates declaration.

## <a name="license"></a>License

Familiarize yourself with the
[DevExtreme Commercial License](https://www.devexpress.com/Support/EULAs/DevExtreme.xml).
[Free trial is available!](http://js.devexpress.com/Buy/)

**DevExtreme Angular 2 components are released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

## <a name="support-feedback"></a>Support & Feedback

* For general Angular 2 topics, follow [these guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md)
* For questions regarding DevExtreme libraries and JavaScript API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
* For DevExtreme Angular 2 integration bugs, questions and suggestions, use the [GitHub issue tracker](https://github.com/DevExpress/devextreme-angular/issues)
