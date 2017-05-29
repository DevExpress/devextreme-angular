# Using the DevExtreme Angular Integration with Webpack

## Create a new Application ##

You can use [the original Angular tutorial on Webpack](https://angular.io/docs/ts/latest/guide/webpack.html) or some other starter to bootstrap a new project based on Webpack.

## Add DevExtreme ##

Follow the [installation](https://github.com/DevExpress/devextreme-angular#installation) section in our Readme.

## <a name="configuration"></a>Configure Webpack Loaders for DevExtreme Stylesheets ##

If you are using [the original Angular tutorial on Webpack](https://angular.io/docs/ts/latest/guide/webpack.html) 
you don't need any extra configuration, since all the required loaders are configured out-of-the-box. 
Otherwise, you need to make sure that all the necessary extensions are processed by the corresponding 
[loaders](https://webpack.github.io/docs/loaders.html) as described below.

Go to *webpack.config.js* and configure loaders for css and fonts as follows:

```js
...
  loaders: [
    ...
    { test: /\.css$/, loader: "style-loader!css-loader" },
    { test: /\.(ttf|eot|woff)$/, loader: "file-loader?name=/[name].[ext]" }
  ]
...
```

Also, make sure that *style-loader*, *css-loader* and *file-loader* are installed into your project as npm dev dependencies.

## Import DevExtreme Stylesheets ##

Having loaders configured, you need to import the required [DevExtreme css files](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/). 
Go to your main .ts file and import the stylesheets as follows:

```js
...
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
```
