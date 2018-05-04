# Using the DevExtreme Angular Components with Angular CLI

## Create a new Application ##

Use [Angular CLI](https://cli.angular.io/) to bootstrap a new project.

## Add DevExtreme ##

Follow the [installation](https://github.com/DevExpress/devextreme-angular#installation) section in our Readme.

## <a name="configuration"></a>Configure Stylesheets ##

Go to **angular.json** and add references to the necessary DevExtreme css files:

```js
{
  ...
  "projects": {
    "ProjectName": {
      ...
      "architect": {
        "build": {
          ...
          "options": {
            ...
            "styles": [
              "node_modules/devextreme/dist/css/dx.common.css",
              "node_modules/devextreme/dist/css/dx.light.css",
              "src/styles.css"
            ],
            ...
          },
          ...
        },
        ...
      }
    },
    ...
  },
  ...
}
```

**For Angular CLI prior to 6** modify **angular-cli.json**:

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
