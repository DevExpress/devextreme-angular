import {NgModule, enableProdMode} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {
    DxButtonModule,
    DxCheckBoxModule,
    DxSwitchModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxProgressBarModule,
    DxSliderModule,
    DxRangeSliderModule,
    DxLoadIndicatorModule,
    DxAutocompleteModule,
    DxSelectBoxModule,
    DxTagBoxModule,
    DxRadioGroupModule,
    DxColorBoxModule,
    DxCalendarModule,
    DxTemplateModule,
    DxListModule,
    DxPopupModule,
    DxChartModule,
    DxDataGridModule
} from '../../dist';

enableProdMode();

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSwitchModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxProgressBarModule,
    DxSliderModule,
    DxRangeSliderModule,
    DxLoadIndicatorModule,
    DxAutocompleteModule,
    DxSelectBoxModule,
    DxTagBoxModule,
    DxRadioGroupModule,
    DxColorBoxModule,
    DxCalendarModule,
    DxTemplateModule,
    DxListModule,
    DxPopupModule,
    DxChartModule,
    DxDataGridModule
  ],
  bootstrap: [AppComponent],
})
class MyAppModule {}

platformBrowserDynamic().bootstrapModule(MyAppModule);
