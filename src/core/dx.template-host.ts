import { DxComponent } from './dx.component';
import { DxTemplateDirective } from './dx.template';

export class DxTemplateHost {
    host: DxComponent;
    setHost(host: DxComponent) {
        this.host = host;
    }
    setTemplate(template: DxTemplateDirective) {
        this.host.setTemplate(template);
    }
}
