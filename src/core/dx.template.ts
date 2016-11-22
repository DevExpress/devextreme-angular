/* tslint:disable:use-input-property-decorator */

import {
    Directive,
    NgModule,
    EmbeddedViewRef,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

import { DxTemplateHost } from './dx.template-host';

declare function require(params: any): any;
let $ = require('jquery');

const DX_TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

export class RenderData {
    model: any;
    itemIndex: number;
    container: any;
}

@Directive({
    selector: '[dxTemplate]',
    inputs: ['dxTemplate', 'dxTemplateOf']
})
export class DxTemplateDirective {
    childView: EmbeddedViewRef<any>;
    name: string;
    constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef, private templateHost: DxTemplateHost) {
        templateHost.setTemplate(this);
    }
    private _renderCore(renderData: RenderData) {
        let childView = this.viewContainerRef.createEmbeddedView(this.templateRef, { '$implicit': renderData.model });
        if (renderData.container) {
            renderData.container.append(childView.rootNodes);
        }
        // =========== WORKAROUND =============
        // https://github.com/angular/angular/issues/12243
        childView['detectChanges']();
        // =========== /WORKAROUND =============
        return $(childView.rootNodes)
            .addClass(DX_TEMPLATE_WRAPPER_CLASS);
    }
    render(renderData: RenderData) {
        renderData.container.empty();
        return this._renderCore(renderData);
    }
    dispose() {
        this.templateHost = null;
    }
    owner() {
        if (this.templateHost) {
            return this.templateHost.host.instance;
        }
        return null;
    }
    source() {
        return $();
    }
    set dxTemplateOf(value) {
        this.name = value;
    }
}

@NgModule({
    declarations: [DxTemplateDirective],
    exports: [DxTemplateDirective]
})
export class DxTemplateModule { }
