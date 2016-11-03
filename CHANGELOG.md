## Next Release

### Bug Fixes

- Fix the 'dx-validator' component ([#30](https://github.com/DevExpress/devextreme-angular2/issues/30))
- Fix the component property change propagation to the corresponding widget option ([#6](https://github.com/DevExpress/devextreme-angular2/issues/6))
- Fix the 'dxTemplate' directive issues ([#4](https://github.com/DevExpress/devextreme-angular2/issues/4) and [#106](https://github.com/DevExpress/devextreme-angular2/issues/106))  
- Fix the 2-way data binding to DevExtreme collection widgets, dxDataGrid and dxForm ([#36](https://github.com/DevExpress/devextreme-angular2/issues/36))

## 16.2.1-alpha.1 (2016-10-20)

### Features

- Use DevExtreme modules to provide better integration with WebPack ([#16](https://github.com/DevExpress/devextreme-angular2/issues/16))
- Add new scenarios to examples: DxTabsComponent, DxTabPanelComponent.

### Bug Fixes

- Fix the onContentReady and onOptionChanged events ([#137](https://github.com/DevExpress/devextreme-angular2/issues/137))

### Breaking changes

- The algorithm of DevExtreme package linking has been changed. Now instead of referencing DevExtreme and jQuery links in a script tag, the links will be resolved automatically by js module loading. For more information, please see: [Adding DevExteme widgets to an Angular 2 application](https://github.com/DevExpress/devextreme-angular2#adding-devexteme-widgets-to-an-angular-2-application)

## 16.1.7 (2016-10-13)

### Features

- Create "IterableDiffer" for every option that supports collections.
- Add new scenarios to examples: DxSchedulerComponent, DxScrollViewComponent, DxResizableComponent.
- Update vendor scripts.

### Bug Fixes

- Fix the onInitialized event ([#14](https://github.com/DevExpress/devextreme-angular2/issues/14))
- Enhancements to building tools ([#94](https://github.com/DevExpress/devextreme-angular2/issues/94))
- Add a component template for widgets with transcluded content ([#49](https://github.com/DevExpress/devextreme-angular2/issues/49))

### Breaking changes

- The DxTemplate directive syntax has been changed. Now instead of assigning `data` to a local variable, use its local variable definition only. To migrate to the new syntax, please remove `= data` from `*dxTemplate="let item = data of 'itemTemplate'"`. After this change, the directive should be as follows: `*dxTemplate="let item of 'itemTemplate'"`.

## 16.1.7-alpha (2016-09-19)

### Angular 2.0.0 version.

We have supported [NgModules](https://angular.io/docs/ts/latest/api/core/index/NgModule-interface.html) in the context of updating to Angular 2.0.
You can read more about NgModules [here](https://angular.io/docs/ts/latest/guide/ngmodule.html).

We defined `NgModule` for each of our components: `DxButtonModule`, `DxCheckBoxModule`, `DxTextBoxModule`, etc.

To make the process of migration easier, you can check our [updated README](https://github.com/DevExpress/devextreme-angular2#adding-devexteme-widgets-to-an-angular-2-application) and take a look at [this commit](https://github.com/DevExpress/devextreme-angular2/commit/50b6d6).

Also we defined a `DevExtremeModule`, which exports all our components:

```TypeScript
import { DevExtremeModule } from 'devextreme-angular2';
```

### Breaking changes

- Added 'Directive' suffix has been added to the `DxTemplate` directive's class name. Use `DxTemplateDirective` instead of `DxTemplate`.
- Added 'Component' suffix has been added to all our components' class names. Example: Use `DxButtonComponent` instead of `DxButton`.

We made these changes according to the [Angular 2 style guide](https://angular.io/docs/ts/latest/guide/style-guide.html#!#02-03).
