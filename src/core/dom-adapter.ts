import { Inject, Injectable, VERSION } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as domAdapter from 'devextreme/core/dom_adapter';
import * as readyCallbacks from 'devextreme/core/utils/ready_callbacks';

const NG_VERSION_SUPPORTING_SSR = '5';

@Injectable()
export class NgDomAdapter {
    constructor(@Inject(DOCUMENT) document: any) {
        if (VERSION.major < NG_VERSION_SUPPORTING_SSR) {
            return;
        }

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
