
import { NgModule, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgHttp } from './http-request';

import * as domAdapter from 'devextreme/core/dom_adapter';
import * as readyCallbacks from 'devextreme/core/utils/ready_callbacks';

const events = ['mousemove', 'mouseover', 'mouseout', 'scroll'];
@NgModule({
    providers: [ NgHttp ]
})
export class DxIntegrationModule {
    constructor(@Inject(DOCUMENT) document: any, ngZone: NgZone, _ngHttp: NgHttp) {
        domAdapter.inject({
            _document: document,

            listen: function(...args) {
                if (events.indexOf(args[1]) === -1) {
                    return ngZone.run(() => {
                        return this.callBase.apply(this, args);
                    });
                }

                return ngZone.runOutsideAngular(() => {
                    return this.callBase.apply(this, args);
                });
            },

            isElementNode: function(element) {
                return element && element.nodeType === 1;
            },

            isTextNode: function(element) {
                return element && element.nodeType === 3;
            },

            isDocument: function(element) {
                return element && element.nodeType === 9;
            }
        });

        ngZone.run(() => readyCallbacks.fire());
    }
}
