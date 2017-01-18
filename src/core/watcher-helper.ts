import {
    Injectable
} from '@angular/core';

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

    private _isDifferentValues(oldValue: any, newValue: any, deepCheck: boolean) {
        if (deepCheck && newValue instanceof (Object) && oldValue instanceof (Object)) {
            return this._checkObjectsFields(newValue, oldValue);
        }
        return oldValue !== newValue;
    }

    private _checkObjectsFields(checkingFromObject: Object, checkingToObject: Object) {
        for (let field in checkingFromObject) {
            if (checkingFromObject[field] > checkingToObject[field] || checkingFromObject[field] < checkingToObject[field]) {
                return true;
            }
        }
    }

    checkWatchers() {
       for (let watcher of this._watchers) {
            watcher();
        }
    }
}
