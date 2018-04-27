/* tslint:disable:use-input-property-decorator */

import {
    Directive,
    NgModule,
    TemplateRef,
    ViewContainerRef,
    Input,
    Renderer2,
    NgZone
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
        private renderer: Renderer2,
        private ngZone: NgZone) {
        templateHost.setTemplate(this);
    }

    render(renderData: RenderData) {
        let renderTemplate = () => {
            return this.viewContainerRef.createEmbeddedView(this.templateRef, {
                '$implicit': renderData.model,
                index: renderData.index
            });
        };

        let childView;
        if (this.ngZone.isStable) {
            childView = this.ngZone.run(() => renderTemplate());
        } else {
            childView = renderTemplate();
        }
        let container = getElement(renderData.container);
        if (renderData.container) {
            childView.rootNodes.forEach((element) => {
                this.renderer.appendChild(container, element);
            });
        }
        // =========== WORKAROUND =============
        // https://github.com/angular/angular/issues/12243
        this.ngZone.run(() => {
            childView['detectChanges']();
        });
        // =========== /WORKAROUND =============
        childView.rootNodes.forEach((element) => {
            if (element.nodeType === 1) {
                this.renderer.addClass(element, DX_TEMPLATE_WRAPPER_CLASS);
            }

            events.one(element, 'dxremove', (e) => {
                if (!e._angularIntegration) {
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
