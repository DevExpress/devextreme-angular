/* tslint:disable:use-input-property-decorator */

import {
    Directive,
    NgModule,
    TemplateRef,
    ViewContainerRef,
    Input,
    Renderer2
} from '@angular/core';

import { DxTemplateHost } from './template-host';
import { getElement } from './utils';
import * as events from 'devextreme/events';

export const DX_TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

export class RenderData {
    model: any;
    index: number;
    container: any;
}

@Directive({
    selector: '[dxTemplate]'
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
        private renderer: Renderer2) {
        templateHost.setTemplate(this);
    }

    render(renderData: RenderData) {
        let childView = this.viewContainerRef.createEmbeddedView(this.templateRef, {
            '$implicit': renderData.model,
            index: renderData.index
        });
        let container = getElement(renderData.container);
        if (renderData.container) {
            childView.rootNodes.forEach((element) => {
                this.renderer.appendChild(container, element);
            });
        }
        // =========== WORKAROUND =============
        // https://github.com/angular/angular/issues/12243
        childView['detectChanges']();
        // =========== /WORKAROUND =============
        childView.rootNodes.forEach((element) => {
            if (element.nodeType === 1) {
                this.renderer.addClass(element, DX_TEMPLATE_WRAPPER_CLASS);
            }

            events.one(element, 'dxremove', ({}, params) => {
                if (!params || !params._angularIntegration) {
                    childView.destroy();
                }
            });
        });

        return childView.rootNodes;
    }
}

@NgModule({
    declarations: [DxTemplateDirective],
    exports: [DxTemplateDirective]
})
export class DxTemplateModule { }
