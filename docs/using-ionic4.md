# Using the DevExtreme Angular Integration with Ionic 4

## Create an Application

Create an Ionic 4 application as described in [Getting Started with Ionic 4](https://ionicframework.com/docs/installation/cli).

## Install DevExtreme

Install the `devextreme` and `devextreme-angular` npm packages:

```
npm install --save devextreme devextreme-angular
```

## <a name="stylesheets"></a>Import Stylesheets

Open the `global.scss` file in the `src` folder and import `dx.common.css` and a [predefined theme stylesheet](https://js.devexpress.com/Documentation/18_2/Guide/Themes_and_Styles/Predefined_Themes/) (`dx.light.css` in the code below).

```
@import '~devextreme/dist/css/dx.common.css';
@import '~devextreme/dist/css/dx.light.css';
```

## <a name="configuration"></a>Register 3-rd Party Dependencies

Refer to [Third-Party Dependencies Registration](https://github.com/DevExpress/devextreme-angular/blob/master/docs/setup-3rd-party-dependencies.md).


## Import DevExtreme Modules and Add Components

Refer to [Import DevExtreme Modules](https://github.com/DevExpress/devextreme-angular#import-devextreme-modules).

## Run the Application

Use the following command:

```
ionic serve
```
