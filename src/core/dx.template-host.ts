import { DxComponent } from "./dx.component";
import { DxTemplate } from "./dx.template";

export class DxTemplateHost {
    host: DxComponent;
    setHost(host: DxComponent) {
        this.host = host;
    }
    setTemplate(template: DxTemplate) {
        this.host.setTemplate(template);
    }
}
