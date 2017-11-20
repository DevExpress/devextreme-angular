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
        return this.getEmitter(name).observers.length;
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

interface IRememberedEvent {
    name: string;
    context: EmitterHelper;
}

let events: IRememberedEvent[] = [];
let onStableSubscription: IEventSubscription = null;

let createOnStableSubscription = function(ngZone: NgZone, fireNgEvent: Function) {
    if (onStableSubscription) {
        return;
    }

    onStableSubscription = ngZone.onStable.subscribe(function() {
        onStableSubscription.unsubscribe();
        onStableSubscription = null;

        ngZone.run(() => {
            events.forEach(event => {
                let value = event.context.component[event.name];

                fireNgEvent.call(event.context, event.name + 'Change', [value]);
            });
        });

        events = [];
    });
};

export class EmitterHelper {
    strategy: NgEventsStrategy;

    constructor(ngZone: NgZone, public component: DxComponent) {
        this.strategy = new NgEventsStrategy(component, ngZone);
        createOnStableSubscription(ngZone, this.fireNgEvent);
    }
    fireNgEvent(eventName: string, eventArgs: any) {
        let emitter = this.component[eventName];
        if (emitter) {
            emitter.next(eventArgs && eventArgs[0]);
        }
    }
    createEmitter(ngEventName: string, dxEventName: string) {
        this.component[ngEventName] = new EventEmitter();
        if (dxEventName) {
            dxToNgEventNames[dxEventName] = ngEventName;
        }
    }
    rememberEvent(name: string) {
        events.push({ name: name, context: this });
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
