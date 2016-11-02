import {
    Injectable
} from '@angular/core';

const DOCUMENT_NODE_TYPE = 9;

@Injectable()
export class WatcherHelper {
    private _watchers: any[] = [];

    getWatchMethod() {
        let watchMethod = (valueGetter, valueChangeCallback, options) => {
            let oldValue = valueGetter();
            options = options || {};

            if (!options.skipImmediate) {
                valueChangeCallback(oldValue);
            }

            let watcher = () => {
                let newValue = valueGetter();

                if (this._isDifferentValues(oldValue, newValue, options.deep)) {
                    if (options.disposeWithElement && this._isElementExpired(options.disposeWithElement)) {
                        return true;
                    }

                    valueChangeCallback(newValue);
                    oldValue = newValue;
                }
            };

            this._watchers.push(watcher);

            return () => {
                let index = this._watchers.indexOf(watcher);

                if (index !== -1) {
                    this._watchers.splice(index, 1);
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
        let isDifferentValue = false;

        if (deepCheck && newValue instanceof (Object)) {
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
       for (let watcher of this._watchers) {
            let isWatcherExpired = watcher();

            if (isWatcherExpired) {
                this._watchers.splice(this._watchers.indexOf(watcher), 1);
            }
        }
    }
}
