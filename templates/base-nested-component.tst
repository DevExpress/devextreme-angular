import { NestedOption } from '../../../core/nested-option';

export abstract class <#= it.className #> extends NestedOption {<#~ it.properties :prop:i #>
    get <#= prop.name #>() {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: any) {
        this._setOption('<#= prop.name #>', value);
    }
<#~#>}
