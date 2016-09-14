import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
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
    DxDataGridModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent],
})
export class MyAppModule {}
