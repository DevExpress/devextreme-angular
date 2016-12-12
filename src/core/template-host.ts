import { DxComponent } from './component';
import { DxTemplateDirective } from './template';

export class DxTemplateHost {
    host: DxComponent;
    setHost(host: DxComponent) {
        this.host = host;
    }
    setTemplate(template: DxTemplateDirective) {
        this.host.setTemplate(template);
    }
}
