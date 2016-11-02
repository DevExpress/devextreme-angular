<# var baseClass = it.isCollection ? 'CollectionNestedOption' : 'NestedOption'; #>
import {
    Component,
    Input,
    Output,
    EventEmitter,
    NgModule,
    Host,
    SkipSelf,
    ElementRef
} from '@angular/core';

import { <#= baseClass #>, NestedOptionHost } from '../../core/nested-option';

@Component({
    selector: '<#= it.selector #>',
    template: '<#? it.hasTemplate #><ng-content></ng-content><#?#>',
    providers: [NestedOptionHost]
})
export class <#= it.className #>Component extends <#= baseClass #> {<#~ it.properties :prop:i #>
    @Input()
    get <#= prop.name #>() {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: any) {
        this._setOption('<#= prop.name #>', value);
    }
    @Output() <#= prop.name #>Change = new EventEmitter<any>();
<#~#>
    get optionPath() {
        return '<#= it.optionName #>';
    }

    get __options() {
        return [<#~ it.properties :prop:i #>
            '<#= prop.name #>'<#? i < it.properties.length-1 #>,<#?#><#~#>
        ];
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
