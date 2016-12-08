/* tslint:disable:use-input-property-decorator */

import {
    Directive,
    NgModule,
    TemplateRef,
    ViewContainerRef,
    Input
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
    selector: '[dxTemplate][dxTemplateOf]'
})
export class DxTemplateDirective {
    @Input()
    set dxTemplateOf(value) {
        this.name = value;
    };
    name: string;

    constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef, templateHost: DxTemplateHost) {
        templateHost.setTemplate(this);
    }

    render(renderData: RenderData) {
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
}

@NgModule({
    declarations: [DxTemplateDirective],
    exports: [DxTemplateDirective]
})
export class DxTemplateModule { }
