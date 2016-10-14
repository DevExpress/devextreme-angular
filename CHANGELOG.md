## Next release

### Bug Fixes

- Fix the onContentReady and onOptionChanged events (#137)

## 16.1.7 (2016-10-13)

### Features

- Create "IterableDiffer" for every option that supports collections.
- Add new scenarios to examples: DxSchedulerComponent, DxScrollViewComponent, DxResizableComponent.
- Update vendor scripts.

### Bug Fixes

- Fix the onInitialized event (#14)
- Enhancements to building tools (#94)
- Add a component template for widgets with transcluded content (#49)

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
