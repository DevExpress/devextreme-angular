import { EventEmitter, NgZone, Injectable } from '@angular/core';
import { DxComponent } from './component';
import * as eventsEngine from 'devextreme/events/core/events_engine';

const dxToNgEventNames = {};

interface IEventSubscription {
    handler: any;
    unsubscribe: () => void;
}

export class NgEventsStrategy {
    private subscriptions: { [key: string]: IEventSubscription[] } = {};

    constructor(private component: DxComponent, private ngZone: NgZone) { }

    hasEvent(name: string) {
        return this.ngZone.run(() => {
            return this.getEmitter(name).observers.length;
        });
    }

    fireEvent(name, args) {
        this.ngZone.run(() => {
            this.getEmitter(name).next(args && args[0]);
        });
    }

    on(name, handler) {
        let eventSubscriptions = this.subscriptions[name] || [],
            subcription = this.getEmitter(name).subscribe(handler.bind(this.component.instance)),
            unsubscribe = subcription.unsubscribe.bind(subcription);

        eventSubscriptions.push({ handler, unsubscribe });
        this.subscriptions[name] = eventSubscriptions;
    }

    off(name, handler) {
        let eventSubscriptions = this.subscriptions[name] || [];

        if (handler) {
            eventSubscriptions.some((subscription, i) => {
                if (subscription.handler === handler) {
                    subscription.unsubscribe();
                    eventSubscriptions.splice(i, 1);
                    return true;
                }
            });
        } else {
            eventSubscriptions.forEach(subscription => {
                subscription.unsubscribe();
            });
            eventSubscriptions.splice(0, eventSubscriptions.length);
        }
    }

    dispose() {}

    private getEmitter(eventName: string): EventEmitter<any> {
        let ngEventName = dxToNgEventNames[eventName];
        if (!this.component[ngEventName]) {
            this.component[ngEventName] = new EventEmitter();
        }
        return this.component[ngEventName];
    }
}

export class EmitterHelper {
    strategy: NgEventsStrategy;
    lockEventFire: Array<string> = [];

    constructor(ngZone: NgZone, public component: DxComponent) {
        this.strategy = new NgEventsStrategy(component, ngZone);
    }
    fireNgEvent(eventName: string, eventArgs: any) {
        if (this.lockEventFire.indexOf(eventName) === -1) {
            let emitter = this.component[eventName];
            if (emitter) {
                emitter.next(eventArgs && eventArgs[0]);
            }
        }
    }
    createEmitter(ngEventName: string, dxEventName: string) {
        this.component[ngEventName] = new EventEmitter();
        if (dxEventName) {
            dxToNgEventNames[dxEventName] = ngEventName;
        }
    }
}

@Injectable()
export class EventsRegistrator {
    constructor(ngZone: NgZone) {
        eventsEngine.set({
            on: function(...args) {
                ngZone.runOutsideAngular(() => {
                    this.callBase.apply(this, args);
                });
            }
        });
    }
}
