# Third-party dependencies registration in Angular CLI 6+

## JSZip library registration ##

Our client-side Excel export depends on the JSZip library that should be registered in the `tsconfig.json` file in the `compilerOptions.paths` section:

```js
{
  ...
  "compilerOptions": {
    ...
    "paths": {
      "jszip": [
        "node_modules/jszip/dist/jszip.min.js"
      ]
    }
  }
}
```

## Globalize registration ##

If you are using Globalize for your application localization, Globalize and CLDR scripts should also be registered in the `tsconfig.json` file in the `compilerOptions.paths` section:

```js
{
  ...
  "compilerOptions": {
    ...
    "paths": {
      "globalize": [
        "node_modules/globalize/dist/globalize"
      ],
      "globalize/*": [
        "node_modules/globalize/dist/globalize/*"
      ],
      "cldr": [
        "node_modules/cldrjs/dist/cldr"
      ],
      "cldr/*": [
        "node_modules/cldrjs/dist/cldr/*"
      ],
      "jszip": [
        "node_modules/jszip/dist/jszip.min.js"
      ]
    }
  }
}
```

The correct import of our Globalize integration, our localization messages, GLDR data and Globalize itself is illustrated in the [demo](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Localization/UsingGlobalize/Angular). For Angular CLI, you also need to provide ambient declarations for them. To do this, add the `typings.d.ts` file with the following content to the `src` folder.

```js
declare module 'globalize' {
    const value: any;
    export default value;
}

declare module 'cldr-data/*' {
    const value: any;
    export default value;
}

declare module 'devextreme/localization/messages/*' {
    const value: any;
    export default value;
}
```
