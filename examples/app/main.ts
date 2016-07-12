import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import {enableProdMode} from '@angular/core';
import {disableDeprecatedForms, provideForms} from '@angular/forms';

enableProdMode();

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
]);
