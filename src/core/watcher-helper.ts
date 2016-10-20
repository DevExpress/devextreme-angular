import {
    Injectable
} from '@angular/core';

@Injectable()
export class WatcherHelper {
    private _watchers: any[];

    getWatchMethod() {
        this._watchers = [];

        let watchMethod = (valueGetter, valueChangeCallback, options) => {
            let that = this;
            let oldValue = valueGetter();
            let watcher = function() {
                let newValue = valueGetter();
                let isWatcherExpired = that._isElementExpired(options && options.disposeWithElement);

                if (!isWatcherExpired && that._isDifferentValues(oldValue, newValue, options && options.deep)) {
                    valueChangeCallback(newValue);
                }

                return isWatcherExpired;
            };

            this._watchers.push(watcher);

            return function() {
                let index = -1;

                for (let item in that._watchers) {
                    if (that._watchers[item] === watcher) {
                        index = parseInt(item, 10);
                        break;
                    }
                }
                if (index !== -1) {
                    that._watchers.splice(index, 1);
                }
            };
        };

        return watchMethod;
    }

    private _isElementExpired(element: any) {
        let isExpired = false;

        if (element) {
            let DOCUMENT_NODE_TYPE = 9;
            isExpired = element.getRootNode().nodeType !== DOCUMENT_NODE_TYPE;
        }

        return isExpired;
    }

    private _isDifferentValues(oldValue: any, newValue: any, deepCheck: boolean) {
        let valueType = typeof newValue;
        let isDifferentValue = false;

        switch (valueType) {
            case 'object':
                if (deepCheck) {
                    isDifferentValue = this._checkObjectsFields(newValue, oldValue);

                    if (!isDifferentValue) {
                        isDifferentValue = this._checkObjectsFields(oldValue, newValue);
                    }
                }
                break;
            default:
                isDifferentValue = oldValue !== newValue;
                break;
        }

        return isDifferentValue;
    }

    private _checkObjectsFields(checkingFromObject: Object, checkingToObject: Object) {
        let isDifferentObjects = false;

        for (let field in checkingFromObject) {
            isDifferentObjects = checkingFromObject[field] !== checkingToObject[field];

            if (isDifferentObjects) {
                break;
            }
        }

        return isDifferentObjects;
    }

    checkWatchers() {
       for (let watcher in this._watchers) {
            let isWatcherExpired = this._watchers[watcher]();

            if (isWatcherExpired) {
                this._watchers.splice(parseInt(watcher, 10), 1);
            }
        }
    }
}
