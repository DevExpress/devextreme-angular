# Using the DevExtreme Angular 2 components with Angular CLI

## Getting Started ##

Use [Angular CLI](https://cli.angular.io/) to bootstrap a new project.

## Adding DevExtreme ##

### Install DevExtreme ###

Install the **devextreme** and **devextreme-angular** npm packages:

```bash
npm install --save devexteme devextreme-angular
```

### Import the DevExtreme modules ###

Go to **src/app/app.module.ts** and add the required DevExtreme modules to the imports section of the application module:

```js
...
import { DxButtonModule } from 'devextreme-angular';

@NgModule({ 
  ...
  imports: [ 
  ...
    DxButtonModule 
  ], 
  ...
}) 
export class AppModule { } 
```

Note, you can import the **DevExtremeModule** module to include all the DevExtreme components at once. But this will lead to a bigger bundle size.  


### Configure stylesheets ###

Go to **angular-cli.json** and add references to the necessary DevExtreme css files:

```js
{ 
  ... 
  "apps": [ 
    { 
      ... 
      "styles": [ 
        ...
        "../node_modules/devextreme/dist/css/dx.common.css", 
        "../node_modules/devextreme/dist/css/dx.light.css", 
        "styles.css" 
      ], 
      ... 
      } 
    } 
  ], 
... 
} 
```

