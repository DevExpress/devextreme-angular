
import { NgModule, NgZone, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgHttp } from './http-request';

import * as domAdapter from 'devextreme/core/dom_adapter';
import * as readyCallbacks from 'devextreme/core/utils/ready_callbacks';
import * as eventsEngine from 'devextreme/events/core/events_engine';

@NgModule({
    providers: [ NgHttp ]
})
export class DxIntegrationModule {
    constructor(@Inject(DOCUMENT) document: any, ngZone: NgZone, _ngHttp: NgHttp) {
        this.initEvents(ngZone);
        this.initDomAdapter(document);
    }

    private initEvents(ngZone: NgZone) {
        eventsEngine.set({
            on: function(...args) {
                ngZone.runOutsideAngular(() => {
                    this.callBase.apply(this, args);
                });
            }
        });
    }

    private initDomAdapter(document: any) {
        domAdapter.inject({
            _document: document,

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

        readyCallbacks.fire();
    }
}
