import { EventEmitter, NgZone } from '@angular/core';
import { DxComponent } from './component';

const dxToNgEventNames = {};

interface EventSubscriber {
    handler: any;
    unsubscribe: () => void;
}

export class NgEventsStrategy {
    private subscribers: { [key: string]: EventSubscriber[] } = {};

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
        let eventSubscribers = this.subscribers[name] || [],
            subsriber = this.getEmitter(name).subscribe(handler.bind(this.component.instance)),
            unsubscribe = subsriber.unsubscribe.bind(subsriber);

        eventSubscribers.push({ handler, unsubscribe });
        this.subscribers[name] = eventSubscribers;
    }

    off(name, handler) {
        let eventSubscribers = this.subscribers[name] || [];

        if (handler) {
            eventSubscribers.some((subscriber, i) => {
                if (subscriber.handler === handler) {
                    subscriber.unsubscribe();
                    eventSubscribers.splice(i, 1);
                    return true;
                }
            });
        } else {
            eventSubscribers.forEach(subscriber => {
                subscriber.unsubscribe();
            });
            eventSubscribers.splice(0, eventSubscribers.length);
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

interface RememberedEvent {
    name: string;
    context: EmitterHelper;
}

let events: RememberedEvent[] = [];
let onStableSubscriber: EventSubscriber = null;

let createOnStableSubscriber = function(ngZone: NgZone, fireNgEvent: Function) {
    if (onStableSubscriber) {
        return;
    }

    onStableSubscriber = ngZone.onStable.subscribe(function() {
        onStableSubscriber.unsubscribe();
        onStableSubscriber = null;

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
        createOnStableSubscriber(ngZone, this.fireNgEvent);
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
