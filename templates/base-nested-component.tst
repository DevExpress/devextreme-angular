import { NestedOption } from '../../../core/nested-option';

export abstract class <#= it.className #> extends NestedOption {<#~ it.properties :prop:i #>
    get <#= prop.name #>() {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: any) {
        this._setOption('<#= prop.name #>', value);
    }
<#~#>
    static metaData = {
        inputs: [<#~ it.properties :prop:i #>
            '<#= prop.name #>'<#? i < it.properties.length-1 #>,<#?#><#~#>
        ]
    };
}
