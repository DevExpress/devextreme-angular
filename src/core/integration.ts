
import { NgModule, Inject, NgZone, Optional } from '@angular/core';
import { XhrFactory } from '@angular/common/http';
import * as httpRequest from 'devextreme/core/http_request';
import { DOCUMENT } from '@angular/common';

import * as domAdapter from 'devextreme/core/dom_adapter';
import * as readyCallbacks from 'devextreme/core/utils/ready_callbacks';
import * as eventsEngine from 'devextreme/events/core/events_engine';

const outsideZoneEvents = ['mousemove', 'mouseover', 'mouseout'];
const insideZoneEvents = ['mouseup', 'click', 'mousedown', 'transitionend', 'wheel'];

let originalAdd;
let callbacks = [];
readyCallbacks.inject({
    add: function(callback) {
        originalAdd = this.callBase.bind(this);
        callbacks.push(callback);
    }
});

@NgModule({})
export class DxIntegrationModule {
    constructor(@Inject(DOCUMENT) document: any, ngZone: NgZone, @Optional() xhrFactory: XhrFactory) {
        domAdapter.inject({
            _document: document,

            listen: function(...args) {
                const eventName = args[1];
                if (outsideZoneEvents.indexOf(eventName) !== -1) {
                    return ngZone.runOutsideAngular(() => {
                        return this.callBase.apply(this, args);
                    });
                }

                if (ngZone.isStable && insideZoneEvents.indexOf(eventName) !== -1) {
                    return ngZone.run(() => {
                        return this.callBase.apply(this, args);
                    });
                }

                return this.callBase.apply(this, args);
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

        httpRequest.inject({
            getXhr: function() {
                if (!xhrFactory) {
                    return this.callBase.apply(this);
                }
                let _xhr = xhrFactory.build();
                if (!('withCredentials' in _xhr)) {
                  (_xhr as any)['withCredentials'] = false;
                }

                return _xhr;
            }
        });

        ngZone.run(() => {
            eventsEngine.set({});
            callbacks.forEach(callback => originalAdd.call(null, callback));
            callbacks = [];
            readyCallbacks.fire();
        });
    }
}
