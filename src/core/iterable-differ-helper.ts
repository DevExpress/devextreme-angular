import {
    Injectable,
    SimpleChanges,
    IterableDiffers
} from '@angular/core';

import {
    DxComponent
} from './component';

@Injectable()
export class IterableDifferHelper {

    private _host: DxComponent;
    private _propertyDiffers: { [id: string]: any; } = {};

    constructor(private _differs: IterableDiffers) { }

    setHost(host: DxComponent) {
        this._host = host;
    }

    setup(prop: string, changes: SimpleChanges) {
         if (prop in changes) {
            const value = changes[prop].currentValue;
            if (value && Array.isArray(value)) {
                if (!this._propertyDiffers[prop]) {
                    try {
                        this._propertyDiffers[prop] = this._differs.find(value).create(null);
                    } catch (e) { }
                }
            } else {
                delete this._propertyDiffers[prop];
            }
        }
    }

    doCheck(prop: string) {
        if (this._propertyDiffers[prop]) {
            const changes = this._propertyDiffers[prop].diff(this._host[prop]);
            if (changes && this._host.instance) {
                this._host.instance.option(prop, this._host[prop]);
            }
        }
    }

}
