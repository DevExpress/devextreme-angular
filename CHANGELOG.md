## 18.2.5 (2019-01-24)

### Features
- Update `devextreme` version to 18.2.5
- Update version of @angular-devkit/schematics [#925](https://github.com/DevExpress/devextreme-angular/pull/925)

## 18.2.4-beta.2 (2018-12-18)

### Bug Fixes
- Fix master detail rendering for virtual mode of DataGrid [#915](https://github.com/DevExpress/devextreme-angular/pull/915)

## 18.2.4-beta.1 (2018-11-22)

### Bug Fixes
- Fix binding options with an object type [#912](https://github.com/DevExpress/devextreme-angular/pull/912)

## 18.2.3 (2018-11-08)

### Features
- Update `devextreme` version to 18.2.3
- Transcluded anonymous templates now work with components
- Schematics included

### Bug Fixes
- dxDataGrid: two-way binding should work correctly for columns [#898](https://github.com/DevExpress/devextreme-angular/pull/898)
- DevExtreme widgets should render templates within Angular Zone [#882](https://github.com/DevExpress/devextreme-angular/pull/882)

## 18.1.5-beta.3 (2018-07-20)

### Bug Fixes
- Fix NPM package

## 18.1.5-beta.2 (2018-07-19)

### Bug Fixes
- Fix the variable name [#830](https://github.com/DevExpress/devextreme-angular/pull/830)

## 18.1.5-beta.1 (2018-07-02)

### Bug Fixes
- Reduce change detection call count for widgets [#817](https://github.com/DevExpress/devextreme-angular/pull/817)

## 18.1.4 (2018-06-21)

### Bug Fixes
- Fix check for objects comparison [#801](https://github.com/DevExpress/devextreme-angular/pull/801)
- Form should validate items if the ngIf directive is applied to an item [#805](https://github.com/DevExpress/devextreme-angular/pull/805)

## 18.1.4-beta.2 (2018-05-31)

### Bug Fixes
- DevExtreme should subscribe on all global events within Angular Zone [#798](https://github.com/DevExpress/devextreme-angular/pull/798)

## 18.1.4-beta.1 (2018-05-25)

### Bug Fixes
- Get rid of HttpClientModule from components [#794](https://github.com/DevExpress/devextreme-angular/pull/794)

## 18.1.3 (2018-05-16)

### Features
- DevExtreme dependency has been updated to the 18.1.3
- Create the DxServerTransferStateModule module to include the cache of the request result [#752](https://github.com/DevExpress/devextreme-angular/pull/752)
- Create event emitters for nested components [#728](https://github.com/DevExpress/devextreme-angular/pull/728)
- Support server side rendering [#732](https://github.com/DevExpress/devextreme-angular/pull/732)
- Implement request result caching on the server, which prevents widget blinking during data loading [#721](https://github.com/DevExpress/devextreme-angular/pull/721)
- Implement ajax on server [#705](https://github.com/DevExpress/devextreme-angular/pull/705)
- Render dx-button widget on server [#694](https://github.com/DevExpress/devextreme-angular/pull/694)

### Bug Fixes
- Render templates within the Angular zone [#767](https://github.com/DevExpress/devextreme-angular/pull/767)
- Event with subscriptions should be fired inside NgZoneEvent [#762](https://github.com/DevExpress/devextreme-angular/pull/762)
- Event with subscriptions should be fired inside NgZone [#748](https://github.com/DevExpress/devextreme-angular/pull/748)
- Fix applications based on SystemJS
- Fix firing onValueChanged event when changing a value of dxTagBox [#710](https://github.com/DevExpress/devextreme-angular/pull/710)
- Prevent valueChanges event when patchValue method is used with emitEvent=false [#712](https://github.com/DevExpress/devextreme-angular/pull/712)
- DevExtreme Angular components force Angular change detection [#516](https://github.com/DevExpress/devextreme-angular/issues/516)
- Rework the strategy of applying options[#626](https://github.com/DevExpress/devextreme-angular/pull/626)

### Breaking changes
- Angular below version 5 is not supported anymore.
- Since the @angular/http module is deprecated (see https://github.com/angular/angular/pull/18906), DevExtreme-angular now requires adding the following modules to config.ts if you use SystemJS:
```JavaScript
'@angular/common/http': 'npm:@angular/common/bundles/common-http.umd.js',
'tslib': 'npm:tslib/tslib.js',
```
- TypeScript declarations of nested components have become strict, which can cause a build failure. Use correct types to prevent this.

## 17.2.4 (2017-12-13)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/29?closed=1)

## 17.2.4-beta.1 (2017-12-04)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/27?closed=1)


## <a name="17.2.3"></a>17.2.3 (2017-11-16)

### Features

- Update `typescript` version to 2.4.2

### Breaking changes
- TypeScript declarations have become strict, which can cause a build failure. Use correct types to prevent this.
- The jQuery dependency has been removed ([#46](https://github.com/DevExpress/devextreme-angular/issues/46)). To use jQuery, you need to manually install the jquery npm package and include the jQuery integration module in your application. For more information, please see: [Include jQuery integration](https://github.com/DevExpress/devextreme-angular#include-jquery-integration)


### Deprecations
- The `dxo-data-source` nested component is deprecated. Use the `dataSource` option instead.

Previously, you could use `dxo-data-source` component as nested component for widgets:
```html
<dx-data-grid>
    <dxo-data-source
      ...
    ></dxo-data-source>
</dx-data-grid>
```

Currently, this will be used like simple property:
```html
<dx-data-grid
  [dataSource]='...'
></dx-data-grid>
```

## 17.2.2-beta.1 (2017-11-03)

### Features

- DevExtreme dependency has been updated to the 17.2.2-pre-beta

## 17.2.1-beta.2 (2017-10-10)

### Features

- Update `devextreme` version to 17.2.1-pre-17273

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/25?closed=1)

## 17.1.7-rc.2 (2017-09-25)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/22?closed=1)

## 17.2.1-beta.1 (2017-09-15)

### Features

- Update `typescript` version to 2.4.2
- Update `devextreme` version to 17.2.1-pre

## 17.1.7-rc.1 (2017-09-11)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/21?closed=1)

## 17.1.6 (2017-09-06)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/20?closed=1)

### Features

- An `index` has been added to the context object of the `dxTemplate` directive for collection widgets ([#523](https://github.com/DevExpress/devextreme-angular/commit/7f0c72b5e02960b4b4e89e5c4fb64be0cb8adbe0))

## 17.1.5 (2017-08-02)

- Release a stable version of `devextreme-angular`

## 17.1.5-rc.1 (2017-07-27)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/18?closed=1)

## 17.1.4 (2017-06-29)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/16?closed=1)

## 16.2.8 (2017-06-29)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/17?closed=1)

## 16.2.7 (2017-06-07)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/15?closed=1)

## 17.1.3 (2017-05-15)

### Features

- DevExtreme dependency has been updated to the 17.1 release

### Bug Fixes

- Fix case when item validation rule uses ngIf directive ([#440](https://github.com/DevExpress/devextreme-angular/issues/440))

## 17.1.2-beta.1 (2017-04-13)

### Features

- DevExtreme dependency has been updated to the 17.1 preview

### Bug Fixes

- Fix disposing nested components in dxDataGrid
- Fix firing onValueChanged event several times on change value option
- Fix watcher for values of the date type ([8a8355b](https://github.com/DevExpress/devextreme-angular/commit/8a8355bbcf833a01f494effe7d8c7f7ad452f523))

## 16.2.6 (2017-03-29)

- Release a stable version with Angular 4 support

## 16.2.6-rc.1 (2017-03-24)

### Features

- Support for Angular 4 RC has been provided ([#386](https://github.com/DevExpress/devextreme-angular/issues/386)).

## 16.2.5 (2017-03-01)

### Features

- Added the "Add DevExtreme to Ionic 2 Application" guide ([119fab1](https://github.com/DevExpress/devextreme-angular/commit/119fab133fac6ea0fb4ca11fc16265aa66d4caed))
- Improved and updated documentation ([9ea5c92](https://github.com/DevExpress/devextreme-angular/commit/9ea5c92f0ff9622ddb28a1204fed393294d8aa9c), [2dcb8ee](https://github.com/DevExpress/devextreme-angular/commit/2dcb8ee0fea8bb93a5a18378944966f51af6a236))
- `@angular/forms` added to `peerDependencies` ([b26a3b9](https://github.com/DevExpress/devextreme-angular/commit/b26a3b99701d7f1037cb1759ee3683a8125db62c))
- Improved integration with NgZone ([4c2ae38](https://github.com/DevExpress/devextreme-angular/commit/4c2ae387f262f54f722900c8a49b0118ad320fdd))

### Code Refactoring

- Refactored `CustomValueAccessor` implementation ([b69d7a0](https://github.com/DevExpress/devextreme-angular/commit/b69d7a0121eba8201a2a687bcf216c50f708efc5))

## 16.2.5-rc.1 (2017-01-26)

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/11?closed=1)

## 16.2.4 (2017-01-18)

### RTM version has been released!

## 16.2.4-rc.5 (2017-01-18)

### Breaking changes

- Item template defined in `dxi-item` and `dxTemplate` now works consistently.

Previously, the result of the `dxi-item` in the DxList was rendered as follows:
```html
<div class="dx-item-content">
    <dxi-item>...</dxi-item>
</div>
```

Currently, this will be rendered as follows:
```html
<dxi-item class="dx-item-content">
    ...
</dxi-item>
```

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/9?closed=1)

## 16.2.3-rc.4 (2017-01-13)

### Features

- Dependencies updated
- Update DevExtreme peer dependency to `16.2.4`

### Bug Fixes

[Open the list of closed bugs](https://github.com/DevExpress/devextreme-angular/milestone/8?closed=1)

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
