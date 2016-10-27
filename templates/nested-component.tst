import {
    Component,
    Input,
    Host,
    Inject
} from '@angular/core';

import { <#= it.hostClassName #>Component } from '../<#= it.hostModulePath #>';

@Component({
    selector: '<#= it.selector #>',
    template: ''
})
export class <#= it.className #>Component {<#~ it.props :prop:i #><# var propPath = it.baseOptionPath + '.' + prop.name; #>
    @Input()
    get <#= prop.name #>() {
        if (this.host.instance) {
            return this.host.instance.option('<#= propPath #>');
        } else {
            return this.host.<#= propPath #>;
        }
    }
    set <#= prop.name #>(value: any) {
        if (this.host.instance) {
            this.host.instance.option('<#= propPath #>', value)
        } else {
            this.host.<#= propPath #> = value;
        }
    }

<#~#>
    constructor(@Host() @Inject(<#= it.hostClassName #>Component) private host: <#= it.hostClassName #>Component) {
        this.host.<#= it.baseOptionPath #> = this.host.<#= it.baseOptionPath #> || {};
    }
}