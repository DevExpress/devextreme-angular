import { EventEmitter, NgZone } from '@angular/core';
import { DxComponent } from './component';

const dxToNgEventNames = {};
const nullEmitter = new EventEmitter<any>();

interface EventSubscriber {
    handler: any;
    unsubscribe: () => void;
}

export class NgEventsStrategy {
    private subscribers: { [key: string]: EventSubscriber[] } = {};

    constructor(private ngZone: NgZone, private component: DxComponent) { }

    hasEvent(name: string) {
        let emitter = this.getEmitter(name);
        return emitter !== nullEmitter && emitter.observers.length;
    }

    fireEvent(name, args) {
        this.ngZone.run(() => {
            this.getEmitter(name).next(args && args[0]);
        });
    }

    on(name, handler) {
        let eventSubscribers = this.subscribers[name] || [],
            subsriber = this.getEmitter(name).subscribe(handler),
            unsubscribe = subsriber.unsubscribe.bind(subsriber);

        eventSubscribers.push({ handler, unsubscribe });
        this.subscribers[name] = eventSubscribers;
    }

    off(name, handler) {
        let eventSubscribers = this.subscribers[name] || [];
        eventSubscribers
            .filter(i => !handler || i.handler === handler)
            .forEach(i => i.unsubscribe());
    }

    dispose() {}

    private getEmitter(eventName: string): EventEmitter<any> {
        return this.component[dxToNgEventNames[eventName]] || nullEmitter;
    }
}

export class EmitterHelper {
    strategy: NgEventsStrategy;

    constructor(ngZone: NgZone, private component: DxComponent) {
        this.strategy = new NgEventsStrategy(ngZone, component);
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
}
