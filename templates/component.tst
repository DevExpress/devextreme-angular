<#? it.isEditor #>
/* tslint:disable:directive-selector-name */
/* tslint:disable:directive-selector-type */
<#?#>
<# var collectionProperties = it.properties.filter(item => item.isCollection).map(item => item.name); #>
<# var baseClass = it.isExtension ? 'DxComponentExtension' : 'DxComponent'; #>

import {
    Component,
    NgModule,
    ElementRef,
    EventEmitter,
    NgZone,
    Input,
    Output<#? it.isEditor #>,
    ContentChild,
    Directive,
    forwardRef,
    HostListener<#?#><#? collectionProperties.length #>,
    OnChanges,
    DoCheck,
    SimpleChanges<#?#>
} from '@angular/core';

import <#= it.className #> from '<#= it.module #>';
<#? it.isEditor #>
import { DxValidatorComponent } from './validator';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';<#?#>

import { <#= baseClass #> } from '../core/dx.component';
import { DxTemplateHost } from '../core/dx.template-host';
import { WatcherHelper } from '../core/watcher-helper';
<#? collectionProperties.length #>import { IterableDifferHelper } from '../core/iterable-differ-helper';<#?#>

let providers = [];
providers.push(DxTemplateHost, WatcherHelper);
<#? collectionProperties.length #>providers.push(IterableDifferHelper);<#?#>

@Component({
    selector: '<#= it.selector #>',
    template: '<#? it.isTranscludedContent #><ng-content></ng-content><#?#>',
    providers: providers
})
export class <#= it.className #>Component extends <#= baseClass #><#? collectionProperties.length #> implements OnChanges, DoCheck<#?#> {
    instance: <#= it.className #>;

<#? it.isEditor #>
    @ContentChild(DxValidatorComponent)
    validator: DxValidatorComponent;<#?#>
    <#~ it.properties :prop:i #>@Input()
    get <#= prop.name #>(): any {
        return this._getOption('<#= prop.name #>');
    }

    set <#= prop.name #>(value: any) {
        this._setOption('<#= prop.name #>', value);
    }<#? i < it.properties.length-1 #>

    <#?#><#~#>

    <#~ it.events :event:i #>@Output() <#= event.emit #>: EventEmitter<any>;<#? i < it.events.length-1 #>
    <#?#><#~#>

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost, private _watcherHelper: WatcherHelper<#? collectionProperties.length #>,
            private _idh: IterableDifferHelper<#?#>) {

        super(elementRef, ngZone, templateHost, _watcherHelper);
        this.widgetClassName = '<#= it.widgetName #>';
        this._events = [
            <#~ it.events :event:i #>{ <#? event.subscribe #>subscribe: '<#= event.subscribe #>', <#?#>emit: '<#= event.emit #>' }<#? i < it.events.length-1 #>,
            <#?#><#~#>
        ];

        this._properties = [
            <#~ it.properties :prop:i #>'this.<#= prop.name #>'<#? i < it.properties.length-1 #>,
            <#?#><#~#>
        ];

        <#~ it.events :event:i #>this.<#= event.emit #> = new EventEmitter();<#? i < it.events.length-1 #>
        <#?#><#~#><#? collectionProperties.length #>

        this._idh.setHost(this);<#?#>
    }

    protected _createInstance(element, options) {
        <#? it.isEditor #>let widget = new <#= it.className #>(element, options);
        if (this.validator) {
            this.validator.createInstance(element);
        }
        return widget;<#?#><#? !it.isEditor #>return new <#= it.className #>(element, options);<#?#>
    }
<#? collectionProperties.length #>
    ngOnChanges(changes: SimpleChanges) {<#~ collectionProperties :prop:i #>
        this._idh.setup('<#= prop #>', changes);<#~#>
    }

    ngDoCheck() {<#~ collectionProperties :prop:i #>
        this._idh.doCheck('<#= prop #>');<#~#>
        this._watcherHelper.checkWatchers();
    }<#?#>
}

<#? it.isEditor #>

const CUSTOM_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => <#= it.className #>ValueAccessorDirective),
    multi: true
};

@Directive({
    selector: '<#= it.selector #>[formControlName],<#= it.selector #>[formControl],<#= it.selector #>[ngModel]',
    providers: [CUSTOM_VALUE_ACCESSOR]
})
export class <#= it.className #>ValueAccessorDirective implements ControlValueAccessor {
    @HostListener('valueChange', ['$event']) onChange(_) { }
    onTouched = () => {};

    constructor(private host: <#= it.className #>Component) { }

    writeValue(value: any): void {
        this.host.value = value;
    }

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
<#?#>

@NgModule({
  declarations: [
    <#= it.className #>Component<#? it.isEditor #>,
    <#= it.className #>ValueAccessorDirective<#?#>
  ],
  exports: [
    <#= it.className #>Component<#? it.isEditor #>,
    <#= it.className #>ValueAccessorDirective<#?#>
  ],
})
export class <#= it.className #>Module { }
