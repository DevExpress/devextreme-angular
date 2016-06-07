import {
    Directive,
    EmbeddedViewRef,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

import { DxComponent } from './dx.component';
import { DxTemplateHost } from "./dx.template-host";

declare var $:any;

@Directive({
    selector: "[dxTemplate]",
    inputs: ["dxTemplate", "dxTemplateOf"]
})
export class DxTemplate {
    childView: EmbeddedViewRef<any>;
    name: string;
    constructor(private templateRef:TemplateRef<any>, private viewContainerRef:ViewContainerRef, private templateHost:DxTemplateHost) {
        templateHost.setTemplate(this);
    }
    set dxTemplateOf(value) {
        this.name = value;
    }
    dispose() {
    }
    render(data, $container?:any, itemIndex?:number) {
        var that = this;
        //TODO move data properties to the root
        var childView = this.viewContainerRef.createEmbeddedView(this.templateRef, {"data": data});

        if($container) {
            $container.append(childView.rootNodes);
        }
        return $(childView.rootNodes);

    }
}
