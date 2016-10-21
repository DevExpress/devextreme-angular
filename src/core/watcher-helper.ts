import {
    Injectable
} from '@angular/core';

const DECIMAL = 10;
const DOCUMENT_NODE_TYPE = 9;

@Injectable()
export class WatcherHelper {
    private _watchers: any[];

    getWatchMethod() {
        this._watchers = [];

        let watchMethod = (valueGetter, valueChangeCallback, options) => {
            let that = this;
            let oldValue = valueGetter();
            options = options || {};

            if (!options.skipImmediate) {
                valueChangeCallback(oldValue);
            }

            let watcher = () => {
                let newValue = valueGetter();
                let isWatcherExpired = that._isElementExpired(options.disposeWithElement);

                if (!isWatcherExpired && that._isDifferentValues(oldValue, newValue, options.deep)) {
                    valueChangeCallback(newValue);
                    oldValue = newValue;
                }

                return isWatcherExpired;
            };

            this._watchers.push(watcher);

            return () => {
                let index = that._watchers.indexOf(watcher);

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
            isExpired = element.getRootNode().nodeType !== DOCUMENT_NODE_TYPE;
        }

        return isExpired;
    }

    private _isDifferentValues(oldValue: any, newValue: any, deepCheck: boolean) {
        let valueType = typeof newValue;
        let isDifferentValue = false;


        if (valueType === 'object' && deepCheck) {
            isDifferentValue = this._checkObjectsFields(newValue, oldValue);
        } else {
            isDifferentValue = oldValue !== newValue;
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
                this._watchers.splice(parseInt(watcher, DECIMAL), 1);
            }
        }
    }
}
