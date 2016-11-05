import {
    Component,
    NgModule,
    Host,
    ElementRef,
    SkipSelf<#? it.properties #>,
    Input<#?#>
} from '@angular/core';

import { NestedOptionHost } from '../../core/nested-option';
import { <#= it.baseClass #> } from '<#= it.basePath #>';

@Component(<#? !it.hasSimpleBaseClass #>Object.assign(<#?#>{
    selector: '<#= it.selector #>',
    template: '<#? it.hasTemplate #><ng-content></ng-content><#?#>',
    providers: [NestedOptionHost]
}<#? !it.hasSimpleBaseClass #>, <#= it.baseClass #>.metaData)<#?#>)
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

    constructor(@SkipSelf() @Host() private _pnoh: NestedOptionHost, @Host() private _noh: NestedOptionHost, _element: ElementRef) {
        super(_element);

        this._pnoh.setNestedOption(this);
        this._noh.setHost(this, this._baseOptionPath);
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
