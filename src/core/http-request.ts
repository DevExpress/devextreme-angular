import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { XhrFactory } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import * as httpRequest from 'devextreme/core/http_request';
import * as ajax from 'devextreme/core/utils/ajax';
import * as deferred from 'devextreme/core/utils/deferred';
import { TransferState, makeStateKey } from '@angular/platform-browser';

@Injectable()
export class NgHttp {
    constructor(xhrFactory: XhrFactory, private state: TransferState, @Inject(PLATFORM_ID) private platformId: any) {
        let that = this;
        httpRequest.inject({
            getXhr: function() {
                let _xhr = xhrFactory.build();
                if (!('withCredentials' in _xhr)) {
                    _xhr['withCredentials'] = false;
                }

                return _xhr;
            }
        });

        ajax.inject({
            sendRequest: function(...args) {
                let key = makeStateKey(that.generateKey(args)),
                    сaсhedData = that.state.get(key, null as any);

                if (isPlatformServer(that.platformId)) {
                    let result = this.callBase.apply(this, args);
                    result.always((data, status) => {
                        let dataForCache = {
                            data: data,
                            status: status

                        };
                        that.state.set(key, dataForCache as any);
                    });
                    return result;
                } else {
                    if (сaсhedData) {
                        let d = new deferred.Deferred();

                        d.resolve(сaсhedData.data, сaсhedData.status);

                        that.state.set(key, null as any);

                        return d.promise();
                    }

                    return this.callBase.apply(this, args);
                }
            }
        });
    }

    generateKey(args) {
        let keyValue = '';
        for (let key in args) {
            if (typeof args[key] === 'object') {
                let objKey = this.generateKey(args[key]);
                keyValue += key + objKey;
            } else {
                keyValue += key + args[key];
            }
        }

        return keyValue;
    }
}
