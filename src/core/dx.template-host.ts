import { DxComponentBase } from './dx.component';
import { DxTemplateDirective } from './dx.template';

export class DxTemplateHost {
    host: DxComponentBase;
    setHost(host: DxComponentBase) {
        this.host = host;
    }
    setTemplate(template: DxTemplateDirective) {
        this.host.setTemplate(template);
    }
}
