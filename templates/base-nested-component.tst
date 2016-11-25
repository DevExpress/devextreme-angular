import { <#= it.baseClass #> } from '<#= it.basePath #>';

export abstract class <#= it.className #> extends <#= it.baseClass #> {<#~ it.properties :prop:i #>
    get <#= prop.name #>() {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: any) {
        this._setOption('<#= prop.name #>', value);
    }
<#~#>}
