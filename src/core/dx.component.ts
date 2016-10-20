import {
    OnChanges,
    AfterViewInit,
    ElementRef,
    SimpleChange,
    NgZone
} from '@angular/core';

import { DxTemplateDirective } from './dx.template';
import { DxTemplateHost } from './dx.template-host';
import { WatcherHelper } from './watcher-helper';

const startupEvents = ['onInitialized', 'onContentReady'];

export abstract class DxComponent implements OnChanges, AfterViewInit {
    private _initialOptions: any;
    private _isChangesProcessing = false;
    templates: DxTemplateDirective[];
    widgetClassName: string;
    instance: any;

    protected _events: { subscribe?: string, emit: string }[];
    protected _properties: string[];

    private _initTemplates() {
        if (this.templates.length) {
            let initialTemplates = {};
            this.templates.forEach(template => {
                this._initialOptions[template.name] = template.templateAsFunction.bind(template);
                initialTemplates[template.name] = template;
            });
            this._initialOptions._templates = initialTemplates;
        }
    }
    private _initOptions() {
        startupEvents.forEach(eventName => {
            this._initialOptions[eventName] = (e) => {
                let emitter = this[eventName];
                return emitter && emitter.next(e);
            };
        });

        this._initialOptions.watchMethod = this.watcherHelper.getWatchMethod();
    }
    private _initEvents() {
        this._events.forEach(event => {
            if (event.subscribe) {
                this.instance.on(event.subscribe, e => {
                    if (event.subscribe === 'optionChanged') {
                        let changeEventName = e.name + 'Change';
                        if (this[changeEventName] && !this._isChangesProcessing) {
                            this[e.name] = e.value;
                            this[changeEventName].next(e.value);
                        }
                        this[event.emit].next(e);
                    } else {
                        if (this[event.emit]) {
                            this.ngZone.run(() => {
                                this[event.emit].next(e);
                            });
                        }
                    }
                });
            }
        });
    }
    private _initProperties() {
        let defaultOptions = this.instance.option();
        this._properties.forEach(property => {
            this[property] = defaultOptions[property];
        });
    }
    protected abstract _createInstance(element, options)
    private _createWidget() {
        this._initTemplates();
        this._initOptions();
        this.instance = this._createInstance(this.element.nativeElement, this._initialOptions);
        this._initEvents();
        this._initProperties();
    }
    constructor(private element: ElementRef, private ngZone: NgZone, templateHost: DxTemplateHost, private watcherHelper: WatcherHelper) {
        this._initialOptions = {};
        this.templates = [];
        templateHost.setHost(this);
    }
    setTemplate(template: DxTemplateDirective) {
        this.templates.push(template);
    }
    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        Object.keys(changes).forEach(propertyName => {
            let change = changes[propertyName];
            if (this.instance) {
                this._isChangesProcessing = true; // prevent cycle change event emitting
                this.instance.option(propertyName, change.currentValue);
                this._isChangesProcessing = false;
            } else {
                this._initialOptions[propertyName] = change.currentValue;
            }
        });
    }
    ngAfterViewInit() {
        this._createWidget();
    }
}




