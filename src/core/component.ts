import {
    ElementRef,
    NgZone,
    QueryList
} from '@angular/core';

import { DxTemplateDirective } from './template';
import { DxTemplateHost } from './template-host';
import { WatcherHelper } from './watcher-helper';
import {
    INestedOptionContainer,
    ICollectionNestedOption,
    ICollectionNestedOptionContainer,
    CollectionNestedOptionContainerImpl
} from './nested-option';

const startupEvents = ['onInitialized', 'onContentReady', 'onToolbarPreparing'];

export abstract class DxComponent implements INestedOptionContainer, ICollectionNestedOptionContainer {
    private _initialOptions: any;
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    templates: DxTemplateDirective[];
    instance: any;

    protected _events: { subscribe?: string, emit: string }[];

    private _initTemplates() {
        if (this.templates.length) {
            let initialTemplates = {};
            this.templates.forEach(template => {
                initialTemplates[template.name] = template;
            });
            this._initialOptions.integrationOptions.templates = initialTemplates;
        }
    }
    private _initOptions() {
        startupEvents.forEach(eventName => {
            this._initialOptions[eventName] = (e) => {
                let emitter = this[eventName];
                return emitter && emitter.emit(e);
            };
        });

        this._initialOptions.integrationOptions.watchMethod = this.watcherHelper.getWatchMethod();
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
    protected abstract _createInstance(element, options)
    protected _createWidget(element: any) {
        this._initialOptions.integrationOptions = {};
        this._initTemplates();
        this._initOptions();
        this.instance = this._createInstance(element, this._initialOptions);
        this._initEvents();
    }
    constructor(protected element: ElementRef, private ngZone: NgZone, templateHost: DxTemplateHost, private watcherHelper: WatcherHelper) {
        this._initialOptions = {};
        this.templates = [];
        templateHost.setHost(this);
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this));
    }
    setTemplate(template: DxTemplateDirective) {
        this.templates.push(template);
    }
    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        return this._collectionContainerImpl.setChildren(propertyName, items);
    }
}

export abstract class DxComponentExtension extends DxComponent {
    createInstance(element: any) {
        this._createWidget(element);
    }
}



