import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MyAppModule } from './app.module';

import config from 'devextreme/core/config';
config({ defaultCurrency: 'EUR' });

platformBrowserDynamic().bootstrapModule(MyAppModule);
