import { Injectable } from '@angular/core';
import { XhrFactory } from '@angular/common/http';
import * as httpRequest from 'devextreme/core/http_request';

@Injectable()
export class NgHttp {
    constructor(xhrFactory: XhrFactory) {
        httpRequest.inject({
            getXhr: function() {
                let _xhr = xhrFactory.build();
                if (!('withCredentials' in _xhr)) {
                    _xhr['withCredentials'] = false;
                }

                return _xhr;
            }
        });
    }
}
