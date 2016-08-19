/* tslint:disable:use-input-property-decorator */

import {
    Directive,
    EmbeddedViewRef,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

import { DxTemplateHost } from './dx.template-host';

declare let $: any;

@Directive({
    selector: '[dxTemplate]',
    inputs: ['dxTemplate', 'dxTemplateOf']
})
export class DxTemplate {
    childView: EmbeddedViewRef<any>;
    name: string;
    private $element: any;
    constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef, private templateHost: DxTemplateHost) {
        templateHost.setTemplate(this);
        this.$element = $(templateRef.elementRef);
    }
    private _renderCore(data, $container?: any, itemIndex?: number) {
        let childView = this.viewContainerRef.createEmbeddedView(this.templateRef, { 'data': data });
        if ($container) {
            $container.append(childView.rootNodes);
        }
        return $(childView.rootNodes);
    }
    render(itemData, itemIndex, itemElement) {
        if (itemElement === undefined) {
            if (itemIndex === undefined) {
                itemElement = itemData;
                itemData = undefined;
            } else if (itemIndex instanceof $) {
                itemElement = itemIndex;
                itemIndex = undefined;
            } else {
                itemElement = itemData;
                itemData = itemIndex;
            }
        } else if (itemIndex instanceof $) {
            let cachedItemIndex = itemElement;

            itemElement = itemIndex;
            itemIndex = cachedItemIndex;
        }

        itemElement.empty();
        return this._renderCore(itemData, itemElement, itemIndex);
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
        return this.$element;
    }
    set dxTemplateOf(value) {
        this.name = value;
    }
}
