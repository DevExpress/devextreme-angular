# Third-Party Dependencies Registration in Angular CLI 6+

## JSZip Library Registration ##

Our client-side Excel export requires the JSZip library that should be registered in the `tsconfig.json` file in the `compilerOptions.paths` section:

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

## Globalize Registration ##

If you localize your application using Globalize, register the Globalize and CLDR scripts in the `tsconfig.json` file in the `compilerOptions.paths` section:

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

The correct import of our Globalize integration, our localization messages, CLDR data and Globalize itself is illustrated in the [demo](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Localization/UsingGlobalize/Angular). For Angular CLI, you also need to provide ambient declarations for them. To do this, add the `typings.d.ts` file with the following content to the `src` folder.

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

If you use `devextreme-cldr-data` data, `typings.d.ts` should also contain the appropriate module declaration:
 
```js
declare module 'devextreme-cldr-data/*' {
    const value: any;
    export default value;
}
```
