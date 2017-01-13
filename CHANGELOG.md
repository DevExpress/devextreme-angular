## Unreleased

### Features

- update DevExtreme peer dependency to `16.2.4`.

## 16.2.3-rc.3 (2016-12-14)

### Bug Fixes

- Resolve AoT compilation issue (after the Angular 2.3.0 release)

## 16.2.3-rc.2 (2016-12-13)

### Bug Fixes

- Resolve AoT compilation issue (after the TypeScript 2.1.4 release)

## 16.2.3-rc.1 (2016-12-12)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/7?closed=1)

### Breaking changes

- The following complex nested options were renamed:
  - `dxi-serie` to `dxi-series`
  - `dxi-categorie` to `dxi-category`
- The `devextreme-angular/core/dx.template` module was renamed to `devextreme-angular/core/template`. Also, it is not required to import this module (as demonstrated below) within your application because this module is already included into all DevExtreme components requiring it.

  `import { DxTemplateModule } from 'devextreme-angular/core/dx.template';`

## 16.2.2-beta.2 (2016-12-07)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/6?closed=1)

### Breaking changes

- In our npm package, `devextreme` dependency has been moved to `peerDependencies`. Now it should be installed manually. See [README.md](https://github.com/DevExpress/devextreme-angular#adding-devexteme-widgets-to-an-angular-2-application) for more details.

## 16.2.2-beta.1 (2016-11-25)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/5?closed=1)

### Breaking changes

- Our npm package has been renamed from devextreme-angular2 to [devextreme-angular](https://www.npmjs.com/package/devextreme-angular).
- The DxTemplate directive now uses template names instead of template option names. For example, for the DxList widget, use `*dxTemplate="let data of 'item'"` instead of `*dxTemplate="let data of 'itemTemplate'"`.

## 16.2.1-alpha.3 (2016-11-11)

### Bug Fixes

- Fix an issue in Plunker when jszip was used
- Fix a DataGrid issue in Mozila FF

## 16.2.1-alpha.2 (2016-11-09)

### Features

- Introduce configuration components ([#5](https://github.com/DevExpress/devextreme-angular/issues/5)).
[See examples](https://github.com/DevExpress/devextreme-angular#advanced-devextreme-widget-options-configuration).

### Bug Fixes

- Fix the 'dx-validator' component ([#30](https://github.com/DevExpress/devextreme-angular/issues/30))
- Fix the component property change propagation to the corresponding widget option ([#6](https://github.com/DevExpress/devextreme-angular/issues/6))
- Fix the 'dxTemplate' directive issues ([#4](https://github.com/DevExpress/devextreme-angular/issues/4) and [#106](https://github.com/DevExpress/devextreme-angular/issues/106))
- Fix the 2-way data binding to DevExtreme collection widgets, dxDataGrid and dxForm ([#36](https://github.com/DevExpress/devextreme-angular/issues/36))

## 16.2.1-alpha.1 (2016-10-20)

### Features

- Use DevExtreme modules to provide better integration with WebPack ([#16](https://github.com/DevExpress/devextreme-angular/issues/16))
- Add new scenarios to examples: DxTabsComponent, DxTabPanelComponent.

### Bug Fixes

- Fix the onContentReady and onOptionChanged events ([#137](https://github.com/DevExpress/devextreme-angular/issues/137))

### Breaking changes

- The algorithm of DevExtreme package linking has been changed. Now instead of referencing DevExtreme and jQuery links in a script tag, the links will be resolved automatically by js module loading. For more information, please see: [Adding DevExteme widgets to an Angular 2 application](https://github.com/DevExpress/devextreme-angular#adding-devexteme-widgets-to-an-angular-2-application)

## 16.1.7 (2016-10-13)

### Features

- Create "IterableDiffer" for every option that supports collections.
- Add new scenarios to examples: DxSchedulerComponent, DxScrollViewComponent, DxResizableComponent.
- Update vendor scripts.

### Bug Fixes

- Fix the onInitialized event ([#14](https://github.com/DevExpress/devextreme-angular/issues/14))
- Enhancements to building tools ([#94](https://github.com/DevExpress/devextreme-angular/issues/94))
- Add a component template for widgets with transcluded content ([#49](https://github.com/DevExpress/devextreme-angular/issues/49))

### Breaking changes

- The DxTemplate directive syntax has been changed. Now instead of assigning `data` to a local variable, use its local variable definition only. To migrate to the new syntax, please remove `= data` from `*dxTemplate="let item = data of 'itemTemplate'"`. After this change, the directive should be as follows: `*dxTemplate="let item of 'itemTemplate'"`.

## 16.1.7-alpha (2016-09-19)

### Angular 2.0.0 version.

We have supported [NgModules](https://angular.io/docs/ts/latest/api/core/index/NgModule-interface.html) in the context of updating to Angular 2.0.
You can read more about NgModules [here](https://angular.io/docs/ts/latest/guide/ngmodule.html).

We defined `NgModule` for each of our components: `DxButtonModule`, `DxCheckBoxModule`, `DxTextBoxModule`, etc.

To make the process of migration easier, you can check our [updated README](https://github.com/DevExpress/devextreme-angular#adding-devexteme-widgets-to-an-angular-2-application) and take a look at [this commit](https://github.com/DevExpress/devextreme-angular/commit/50b6d6).

Also we defined a `DevExtremeModule`, which exports all our components:

```TypeScript
import { DevExtremeModule } from 'devextreme-angular';
```

### Breaking changes

- Added 'Directive' suffix has been added to the `DxTemplate` directive's class name. Use `DxTemplateDirective` instead of `DxTemplate`.
- Added 'Component' suffix has been added to all our components' class names. Example: Use `DxButtonComponent` instead of `DxButton`.

We made these changes according to the [Angular 2 style guide](https://angular.io/docs/ts/latest/guide/style-guide.html#!#02-03).
