import {
    Component,
    NgModule,
    Host,
    SkipSelf<#? it.properties #>,
    Input<#?#>
} from '@angular/core';

import { <#? !it.baseClass #>NestedOption, <#?#>NestedOptionHost } from '../../core/nested-option';<#? it.baseClass #>
import { <#= it.baseClass #> } from './base/<#= it.basePath #>';<#?#>

@Component(<#? it.baseClass #>Object.assign(<#?#>{
    selector: '<#= it.selector #>',
    template: '',
    providers: [NestedOptionHost]
}<#? it.baseClass #>, <#= it.baseClass #>.metaData)<#?#>)
export class <#= it.className #>Component extends <#= it.baseClass || 'NestedOption' #> {<#~ it.properties :prop:i #>
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

    constructor(@SkipSelf() @Host() private _pnoh: NestedOptionHost, @Host() private _noh: NestedOptionHost) {
        super();

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
