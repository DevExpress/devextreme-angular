<#? it.isEditor #>/* tslint:disable:directive-selector */<#?#>
<# var collectionProperties = it.properties.filter(item => item.isCollection).map(item => item.name); #>
<# var collectionNestedComponents = it.nestedComponents.filter(item => item.isCollection && item.root); #>
<# var baseClass = it.isExtension ? 'DxComponentExtension' : 'DxComponent'; #>

<# var implementedInterfaces = ['OnDestroy']; #>
<# !it.isExtension && implementedInterfaces.push('AfterViewInit'); #>
<# collectionProperties.length && implementedInterfaces.push('OnChanges', 'DoCheck'); #>

import {
    Component,
    NgModule,
    ElementRef,
    EventEmitter,
    NgZone,
    Input,
    Output,
    OnDestroy<#? !it.isExtension #>,
    AfterViewInit<#?#><#? it.isEditor #>,
    ContentChild,
    Directive,
    forwardRef,
    HostListener<#?#><#? collectionProperties.length #>,
    OnChanges,
    DoCheck,
    SimpleChanges<#?#><#? collectionNestedComponents.length #>,
    ContentChildren,
    QueryList<#?#>
} from '@angular/core';

import <#= it.className #> from '<#= it.module #>';
<#? it.isEditor #>
import { DxValidatorComponent } from './validator';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';<#?#>

import { <#= baseClass #> } from '../core/component';
import { DxTemplateHost } from '../core/template-host';
import { DxTemplateModule } from '../core/template';
import { NestedOptionHost } from '../core/nested-option';
import { WatcherHelper } from '../core/watcher-helper';
<#? collectionProperties.length #>import { IterableDifferHelper } from '../core/iterable-differ-helper';<#?#>

<#~ it.nestedComponents :component:i #>import { <#= component.className #>Module } from './nested/<#= component.path #>';
<#~#>
<#~ collectionNestedComponents :component:i #>import { <#= component.className #>Component } from './nested/<#= component.path #>';
<#~#>

@Component({
    selector: '<#= it.selector #>',
    template: '<#? it.isTranscludedContent #><ng-content></ng-content><#?#>',<#? it.isViz #>
    styles: [ ' :host {  display: block; }'],<#?#>
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost<#? collectionProperties.length #>,
        IterableDifferHelper<#?#>
    ]
})
export class <#= it.className #>Component extends <#= baseClass #> <#? implementedInterfaces.length #>implements <#= implementedInterfaces.join(', ') #> <#?#>{
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

    <#~ it.events :event:i #>@Output() <#= event.emit #> = new EventEmitter<any>();<#? i < it.events.length-1 #>
    <#?#><#~#>

<#~ collectionNestedComponents :component:i #>
    @ContentChildren(<#= component.className #>Component)
    get <#= component.propertyName #>Children(): QueryList<<#= component.className #>Component> {
        return this._getOption('<#= component.propertyName #>');
    }
    set <#= component.propertyName #>Children(value) {
        this.setChildren('<#= component.propertyName #>', value);
    }
<#~#>

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            <#? collectionProperties.length #>private <#?#>_watcherHelper: WatcherHelper<#? collectionProperties.length #>,
            private _idh: IterableDifferHelper<#?#>, optionHost: NestedOptionHost) {

        super(elementRef, ngZone, templateHost, _watcherHelper);

        this._events = [
            <#~ it.events :event:i #>{ <#? event.subscribe #>subscribe: '<#= event.subscribe #>', <#?#>emit: '<#= event.emit #>' }<#? i < it.events.length-1 #>,
            <#?#><#~#>
        ];<#? collectionProperties.length #>

        this._idh.setHost(this);<#?#>
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {
        <#? it.isEditor #>let widget = new <#= it.className #>(element, options);
        if (this.validator) {
            this.validator.createInstance(element);
        }
        return widget;<#?#><#? !it.isEditor #>return new <#= it.className #>(element, options);<#?#>
    }

    ngOnDestroy() {
        this._destroyWidget();
    }
<#? collectionProperties.length #>
    ngOnChanges(changes: SimpleChanges) {<#~ collectionProperties :prop:i #>
        this._idh.setup('<#= prop #>', changes);<#~#>
    }

    ngDoCheck() {<#~ collectionProperties :prop:i #>
        this._idh.doCheck('<#= prop #>');<#~#>
        this._watcherHelper.checkWatchers();
    }<#?#>
<#? !it.isExtension #>
    ngAfterViewInit() {
        this._createWidget(this.element.nativeElement);
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
<#? it.widgetName !== "dxRangeSelector" #>
    setDisabledState(isDisabled: boolean): void {
        this.host.disabled = isDisabled;
    }<#?#>

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
<#?#>

@NgModule({
  imports: [<#~ it.nestedComponents :component:i #>
    <#= component.className #>Module,<#~#>
    DxTemplateModule
  ],
  declarations: [
    <#= it.className #>Component<#? it.isEditor #>,
    <#= it.className #>ValueAccessorDirective<#?#>
  ],
  exports: [
    <#= it.className #>Component<#~ it.nestedComponents :component:i #>,
    <#= component.className #>Module<#~#>,<#? it.isEditor #>
    <#= it.className #>ValueAccessorDirective,<#?#>
    DxTemplateModule
  ],
})
export class <#= it.className #>Module { }
