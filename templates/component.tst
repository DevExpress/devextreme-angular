<#? it.isEditor #>
/* tslint:disable:directive-selector-name */
/* tslint:disable:directive-selector-type */
<#?#>

<# var collectionProperties = it.properties.filter(item => item.collection).map(item => item.name); #>

import {
    Component,
    NgModule,
    ElementRef,
    EventEmitter,
    NgZone,
    Input,
    Output<#? it.isEditor #>,
    Directive,
    forwardRef,
    HostListener<#?#><#? collectionProperties.length #>,
    OnChanges,
    DoCheck,
    SimpleChanges,
    IterableDiffers,
    IterableDiffer,
    ChangeDetectorRef,
    DefaultIterableDiffer,
    CollectionChangeRecord<#?#>
} from '@angular/core';

<#? it.isEditor #>

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

<#?#>

import { DxComponent } from '../core/dx.component';
import { DxTemplateHost } from '../core/dx.template-host';

@Component({
    selector: '<#= it.selector #>',
    template: '',
    providers: [DxTemplateHost]
})
export class <#= it.className #>Component extends DxComponent<#? collectionProperties.length #> implements OnChanges, DoCheck<#?#> {
    <#~ it.properties :prop:i #>@Input() <#= prop.name #>: any;<#? i < it.properties.length-1 #>
    <#?#><#~#>

    <#~ it.events :event:i #>@Output() <#= event.emit #>: EventEmitter<any>;<#? i < it.events.length-1 #>
    <#?#><#~#>

    <#? collectionProperties.length #>private _propertyDiffers: { [id: string]: IterableDiffer; } = {};<#?#>

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost<#? collectionProperties.length #>,
            private _differs: IterableDiffers, private _cdr: ChangeDetectorRef<#?#>) {
        super(elementRef, ngZone, templateHost);
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
        <#?#><#~#>
    }
<#? collectionProperties.length #>
    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
<#~ collectionProperties :prop:i #>
        this._setupIterableDiffer('<#= prop #>', changes);<#~#>
    }

    _setupIterableDiffer(prop: string, changes: SimpleChanges) {
         if (prop in changes) {
            const value = changes[prop].currentValue;
            if (value && Array.isArray(value)) {
                if (!this._propertyDiffers[prop]) {
                    try {
                        this._propertyDiffers[prop] = this._differs.find(value).create(this._cdr, null);
                    } catch (e) { }
                }
            } else {
                delete this._propertyDiffers[prop];
            }
        }
    }

    ngDoCheck() {<#~ collectionProperties :prop:i #>
        this._doCheckIterableDiffer('<#= prop #>');<#~#>
    }

    _doCheckIterableDiffer(prop: string) {
        if (this._propertyDiffers[prop]) {
            const changes = <DefaultIterableDiffer>this._propertyDiffers[prop].diff(this[prop]);
            if (changes && this.instance) {
                this.instance.option(prop, this[prop]);
            }
        }
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

    constructor(private host: <#= it.className #>Component) {

    }

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
