/* tslint:disable:max-line-length */

import { <#= it.baseClass #> } from '<#= it.basePath #>';
<#? it.isDevExpressRequired #>
import DevExpress from 'devextreme/bundles/dx.all';<#?#>

export abstract class <#= it.className #> extends <#= it.baseClass #> {<#~ it.properties :prop:i #>
    get <#= prop.name #>(): <#= prop.type #> {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: <#= prop.type #>) {
        this._setOption('<#= prop.name #>', value);
    }
<#~#>}
