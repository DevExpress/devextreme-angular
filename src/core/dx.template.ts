import {
    Directive,
    EmbeddedViewRef,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

import { DxTemplateHost } from './dx.template-host';

declare var $: any;

@Directive({
    selector: '[dxTemplate]',
    inputs: ['dxTemplate', 'dxTemplateOf']
})
export class DxTemplate {
    childView: EmbeddedViewRef<any>;
    name: string;
    constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef, private templateHost: DxTemplateHost) {
        templateHost.setTemplate(this);
    }
    private _renderCore(data, $container?: any, itemIndex?: number) {
        var childView = this.viewContainerRef.createEmbeddedView(this.templateRef, { 'data': data });
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
            }
            else if (itemIndex instanceof $) {
                itemElement = itemIndex;
                itemIndex = undefined;
            }
            else {
                itemElement = itemData;
                itemData = itemIndex;
            }
        }
        itemElement.empty();
        this._renderCore(itemData, itemElement, itemIndex);
    }
    dispose() {
    }
    set dxTemplateOf(value) {
        this.name = value;
    }
}
