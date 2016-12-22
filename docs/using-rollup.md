# Using the DevExtreme Angular 2 Integration with Rollup

## Create a new Application ##

You can use [some starter](https://github.com/search?utf8=%E2%9C%93&q=angular+rollup+starter&type=Repositories&ref=searchresults) to bootstrap a new project based on Rollup.

## Add DevExtreme ##

Follow the [installation](https://github.com/DevExpress/devextreme-angular#installation) section in our Readme.

## <a name="configuration"></a>Configure Rollup for DevExtreme ##

There is [a limitation](https://github.com/DevExpress/devextreme-angular/issues/283) in bundling with Rollup.
Make sure that you use [long paths](https://github.com/DevExpress/devextreme-angular/#bundlers-without-tree-shaking-support) for DevExtreme Angular modules.

Ensure that the following plugins are included:

```js
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var builtins = require('rollup-plugin-node-builtins');
var globals = require('rollup-plugin-node-globals');

{
    ....
    plugins: [
        nodeResolve({ jsnext: true, main: true, browser: true, preferBuiltins: true }),
        commonjs(),
        builtins(),
        globals()
    ]
    ...
}
```

## Import DevExtreme Stylesheets ##

Import the required [DevExtreme css files](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/). 
