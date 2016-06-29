import {
    Component,
    ElementRef,
    Directive,
    EventEmitter,
    Provider,
    forwardRef,
    NgZone,
    provide
} from '@angular/core';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import { DxComponent } from '../core/dx.component';
import { DxTemplateHost } from '../core/dx.template-host';


@Component({
    selector: '<#= it.selector #>',
    template: '',
    inputs: [
    <#~ it.properties :prop:i #>
        '<#= prop.name #>'<#? i < it.properties.length-1 #>,<#?#>
    <#~#>
    ],
    outputs: [
    <#~ it.events :event:i #>
        '<#= event.emit #>'<#? i < it.events.length-1 #>,<#?#>
    <#~#>
    ],
    providers: [
        provide(DxTemplateHost, { useClass: DxTemplateHost })
    ]
})
export class <#= it.className #> extends DxComponent {
<#~ it.properties :prop:i #>
    <#= prop.name #>: any;
<#~#>
<#~ it.events :event:i #>
    <#= event.emit #>: EventEmitter<any>;
<#~#>
    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost) {
        super(elementRef, ngZone, templateHost);
        this.widgetClassName = '<#= it.widgetName #>';
        this._events = [
        <#~ it.events :event:i #>
            { <#? event.subscribe #>subscribe: '<#= event.subscribe #>', <#?#>emit: '<#= event.emit #>' }<#? i < it.events.length-1 #>,<#?#>
        <#~#>
        ];
        this._properties = [
        <#~ it.properties :prop:i #>
            'this.<#= prop.name #>',
        <#~#>
        ];

    <#~ it.events :event:i #>
        this.<#= event.emit #> = new EventEmitter();
    <#~#>

    }
}

<#? it.isEditor #>

const CUSTOM_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => <#= it.className #>ValueAccessor), multi: true });


@Directive({
  selector: '<#= it.selector #>[formControlName],<#= it.selector #>[formControl],<#= it.selector #>[ngModel]',
  host: {'(valueChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR]
})
export class <#= it.className #>ValueAccessor implements ControlValueAccessor {
  onChange = (_) => {};
  onTouched = () => {};

  constructor(private host: <#= it.className #>) {

  }

  writeValue(value: any): void {
    this.host.value = value;
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}

<#?#>
