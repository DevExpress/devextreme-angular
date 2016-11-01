import {
    Component,
    Input,
    Output,
    EventEmitter,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';

import { NestedOption, NestedOptionHost } from '../../core/nested-option';

@Component({
    selector: '<#= it.selector #>',
    template: '',
    providers: [NestedOptionHost]
})
export class <#= it.className #>Component extends NestedOption {<#~ it.properties :prop:i #>
    @Input()
    get <#= prop.name #>() {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: any) {
        this._setOption('<#= prop.name #>', value);
    }
    @Output() <#= prop.name #>Change = new EventEmitter<any>();
<#~#>
    protected get _optionPath() {
        return '<#= it.optionName #>';
    }

    protected get _options() {
        return [<#~ it.properties :prop:i #>
            '<#= prop.name #>'<#? i < it.properties.length-1 #>,<#?#><#~#>
        ];
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
