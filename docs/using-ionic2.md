# Using the DevExtreme Angular Integration with Ionic 2

## Create an Application

Create an Ionic 2 application as described in the [Ionic 2 Tutorial](http://ionicframework.com/docs/v2/getting-started/tutorial/).

## Install DevExtreme Angular Integration

Once the application is created, install DevExtreme Angular integration npm package. Run the following command in the command prompt.

```
npm install --save devextreme devextreme-angular
```

## <a name="configuration"></a>Configure Ionic 2 for DevExtreme

To use DevExtreme within the Ionic 2 application, import the required separate modules or entire DevExtreme to this application within the "src\app\app.module.ts" file.

```
//Imports a separate module
import { DxButtonModule } from 'devextreme-angular/ui/button'; 

//Imports the entire DevExtreme
import { DevExtremeModule } from 'devextreme-angular'; 
```

Add the imported modules to application imports: 

```
@NgModule({ 
    ... 
    imports: [ 
        ... 
        DevExtremeModule, 
        ... 
    ] 
})
```

## Copy DevExtreme Stylesheets

DevExtreme style sheets are stored in the "node-modules\devextreme\dist\css" folder. You should copy them to the "www\assets\css" folder. You can do it manually, or use [ionic build tools](https://ionicframework.com/docs/v2/resources/app-scripts/) to copy style sheets during the build process. In the second case, create a new file "copy.config.js" in the application root folder.

Add the following item to the "copy" configuration.

```
var copy = require('@ionic/app-scripts/config/copy.config.js');

copy.copyStyleSheets = {
  src: ['{{ROOT}}/node_modules/devextreme/dist/css/**/*'],
  dest: '{{WWW}}/assets/css'
};

module.exports = copy;
```

Reference the created config within the package.json file by adding the "config" section.

```
"config" : {
    "ionic_copy": "./copy.config.js"
},
```

Add links to the required stylesheets to the head section of the "src\index.html" file.

```
<link href="assets/css/dx.common.css" rel="stylesheet">
<link href="assets/css/dx.light.css" rel="stylesheet">
```

## Add a DevExtreme Component

After you have performed all steps described above, you can use DevExtreme controls on application views. To try how it works, add a button widget to the "src\pages\hello-ionic\hello-ionic.html" file.

```
. . .
<ion-content padding>
    <h3>Welcome to your first Ionic app!</h3>
    <dx-button text="Hello world"></dx-button>
. . .
```

For more information on working with DevExtreme controls in Angular approach, refer to the [DevExtreme-Angular library description](https://github.com/DevExpress/devextreme-angular).

## Run the Application

Run the app using the following command

```
ionic serve
```
