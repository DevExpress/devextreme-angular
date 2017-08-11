/* tslint:disable:use-input-property-decorator */

import {
    Directive,
    NgModule,
    TemplateRef,
    ViewContainerRef,
    Input,
    NgZone
} from '@angular/core';

import { DxTemplateHost } from './template-host';

declare function require(params: any): any;
let $ = require('jquery');

export const DX_TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

export class RenderData {
    model: any;
    index: number;
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

    constructor(private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        templateHost: DxTemplateHost,
        private ngZone: NgZone) {
        templateHost.setTemplate(this);
    }

    render(renderData: RenderData) {
        let childView = this.viewContainerRef.createEmbeddedView(this.templateRef, {
            '$implicit': renderData.model,
            index: renderData.index
        });
        if (renderData.container) {
            renderData.container.append(childView.rootNodes);
        }
        // =========== WORKAROUND =============
        // https://github.com/angular/angular/issues/12243
        this.ngZone.run(() => {
            childView['detectChanges']();
        });
        // =========== /WORKAROUND =============
        return $(childView.rootNodes)
            .addClass(DX_TEMPLATE_WRAPPER_CLASS)
            .one('dxremove', (e) => {
                if (!e._angularIntegration) {
                    childView.destroy();
                }
            });
    }
}

@NgModule({
    declarations: [DxTemplateDirective],
    exports: [DxTemplateDirective]
})
export class DxTemplateModule { }
