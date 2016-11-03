import {
    AfterViewInit,
    ElementRef,
    NgZone
} from '@angular/core';

import { DxTemplateDirective } from './dx.template';
import { DxTemplateHost } from './dx.template-host';
import { WatcherHelper } from './watcher-helper';

const startupEvents = ['onInitialized', 'onContentReady'];

export abstract class DxComponentBase {
    private _initialOptions: any;
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
                return emitter && emitter.emit(e);
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
                        if (this[changeEventName]) {
                            this[changeEventName].emit(e.value);
                        }
                        this[event.emit].emit(e);
                    } else {
                        if (this[event.emit]) {
                            this.ngZone.run(() => {
                                this[event.emit].emit(e);
                            });
                        }
                    }
                });
            }
        });
    }
    protected _getOption(name: string) {
        if (this.instance) {
            return this.instance.option(name);
        } else {
            return this._initialOptions[name];
        }
    }
    protected _setOption(name: string, value: any) {
        if (this.instance) {
            this.instance.option(name, value);
        } else {
            this._initialOptions[name] = value;
        }
    }
    private _initProperties() {
        let defaultOptions = this.instance.option();
        this._properties.forEach(property => {
            this[property] = defaultOptions[property];
        });
    }
    protected abstract _createInstance(element, options)
    protected _createWidget(element: any) {
        this._initTemplates();
        this._initOptions();
        this.instance = this._createInstance(element, this._initialOptions);
        this._initEvents();
        this._initProperties();
    }
    constructor(protected element: ElementRef, private ngZone: NgZone, templateHost: DxTemplateHost, private watcherHelper: WatcherHelper) {
        this._initialOptions = {};
        this.templates = [];
        templateHost.setHost(this);
    }
    setTemplate(template: DxTemplateDirective) {
        this.templates.push(template);
    }
}

export abstract class DxComponent extends DxComponentBase implements AfterViewInit {
    ngAfterViewInit() {
        this._createWidget(this.element.nativeElement);
    }
}

export abstract class DxComponentExtension extends DxComponentBase {
    createInstance(element: any) {
        this._createWidget(element);
    }
}



