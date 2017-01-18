import { EventEmitter, NgZone } from '@angular/core';
import { DxComponent } from './component';

const dxToNgEventNames = {};

interface EventSubscriber {
    handler: any;
    unsubscribe: () => void;
}

export class NgEventsStrategy {
    private subscribers: { [key: string]: EventSubscriber[] } = {};

    constructor(private component: DxComponent) { }

    hasEvent(name: string) {
        return this.getEmitter(name).observers.length;
    }

    fireEvent(name, args) {
        this.getEmitter(name).next(args && args[0]);
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
        eventSubscribers
            .filter(i => !handler || i.handler === handler)
            .forEach(i => i.unsubscribe());
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

    constructor(private ngZone: NgZone, private component: DxComponent) {
        this.strategy = new NgEventsStrategy(component);
    }
    fireNgEvent(eventName: string, eventArgs: any) {
        let emitter = this.component[eventName];
        if (emitter) {
            this.ngZone.run(() => {
                emitter.next(eventArgs && eventArgs[0]);
            });
        }
    }
    createEmitter(ngEventName: string, dxEventName: string) {
        this.component[ngEventName] = new EventEmitter();
        if (dxEventName) {
            dxToNgEventNames[dxEventName] = ngEventName;
        }
    }
}
