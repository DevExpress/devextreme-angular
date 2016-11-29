<#? it.inputs #>/* tslint:disable:use-input-property-decorator */
<#?#>
import {
    Component,
    NgModule,
    Host,
    ElementRef,
    SkipSelf<#? it.properties #>,
    Input<#?#><#? it.collectionNestedComponents.length #>,
    ContentChildren,
    QueryList<#?#>
} from '@angular/core';

import { NestedOptionHost } from '../../core/nested-option';
import { <#= it.baseClass #> } from '<#= it.basePath #>';
<#~ it.collectionNestedComponents :component:i #>import { <#= component.className #>Component } from './<#= component.path #>';
<#~#>

@Component({
    selector: '<#= it.selector #>',
    template: '<#? it.hasTemplate #><ng-content></ng-content><#?#>',
    providers: [NestedOptionHost]<#? it.inputs #>,
    inputs: [<#~ it.inputs :input:i #>
        '<#= input.name #>'<#? i < it.inputs.length-1 #>,<#?#><#~#>
    ]<#?#>
})
export class <#= it.className #>Component extends <#= it.baseClass #> {<#~ it.properties :prop:i #>
    @Input()
    get <#= prop.name #>() {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: any) {
        this._setOption('<#= prop.name #>', value);
    }
<#~#>
    protected get _optionPath() {
        return '<#= it.optionName #>';
    }

<#~ it.collectionNestedComponents :component:i #>
    @ContentChildren(<#= component.className #>Component)
    get <#= component.propertyName #>Children(): QueryList<<#= component.className #>Component> {
        return this._getOption('<#= component.propertyName #>');
    }
    set <#= component.propertyName #>Children(value) {
        this.setChildren('<#= component.propertyName #>', value);
    }
<#~#>

    constructor(@SkipSelf() @Host() private _pnoh: NestedOptionHost, @Host() private _noh: NestedOptionHost, _element: ElementRef) {
        super(_element);
<#? it.hasTemplate #>
        this.template = this._template.bind(this);
<#?#>
        this._pnoh.setNestedOption(this);
        this._noh.setHost(this, this._getOptionPath());
    }
}

@NgModule({
  declarations: [
    <#= it.className #>Component
  ],
  exports: [
    <#= it.className #>Component
  ],
})
export class <#= it.className #>Module { }
