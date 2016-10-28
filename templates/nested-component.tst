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
export class <#= it.className #>Component {<#~ it.properties :prop:i #><# var propPath = it.baseOptionPath + '.' + prop.name; #>
    @Input()
    get <#= prop.name #>() {
        return this.getProperty('<#= prop.name #>');
    }
    set <#= prop.name #>(value: any) {
        this.setProperty('<#= prop.name #>', value);
    }

<#~#>
    private get instance() {
        return this.host.instance;
    }

    private get baseOptionPath() {
        return '<#= it.baseOptionPath #>.';
    }

    private get baseOption() {
        return this.host.<#= it.baseOptionPath #>;
    }
    private set baseOption(value) {
        this.host.<#= it.baseOptionPath #> = value;
    }

    private getProperty(name: string): any {
        if (this.instance) {
            return this.instance.option(this.baseOptionPath + name);
        }
        return this.baseOption[name];
    }

    private setProperty(name: string, value: any) {
        if (this.instance) {
            this.instance.option(this.baseOptionPath + name, value)
        }
        this.baseOption[name] = value;
    }

    constructor(@Host() @Inject(<#= it.hostClassName #>Component) private host: <#= it.hostClassName #>Component) {
        this.baseOption = this.baseOption || {};
    }
}