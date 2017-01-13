import {
    ElementRef,
    NgZone,
    QueryList
} from '@angular/core';

import { DxTemplateDirective } from './template';
import { DxTemplateHost } from './template-host';
import { EmitterHelper } from './events-strategy';
import { WatcherHelper } from './watcher-helper';
import {
    INestedOptionContainer,
    ICollectionNestedOption,
    ICollectionNestedOptionContainer,
    CollectionNestedOptionContainerImpl
} from './nested-option';

export abstract class DxComponent implements INestedOptionContainer, ICollectionNestedOptionContainer {
    private _initialOptions: any;
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    eventHelper: EmitterHelper;
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
        this._initialOptions.eventsStrategy = this.eventHelper.strategy;
        this._initialOptions.integrationOptions.watchMethod = this.watcherHelper.getWatchMethod();
    }
    protected _createEventEmitters(events) {
        events.forEach(event => {
            this.eventHelper.createEmitter(event.emit, event.subscribe);
        });
    }
    private _initEvents() {
        this.instance.on('optionChanged', e => {
            let changeEventName = e.name + 'Change';
            this.eventHelper.fireNgEvent(changeEventName, [e.value]);
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
        this._initTemplates();
        this._initOptions();
        this.instance = this._createInstance(element, this._initialOptions);
        this._initEvents();
    }
    protected _destroyWidget() {
        if (this.instance) {
            this.instance.element().triggerHandler({ type: 'dxremove', _angularIntegration: true });
        }
    }
    constructor(protected element: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost, private watcherHelper: WatcherHelper) {
        this._initialOptions = { integrationOptions: {} };
        this.templates = [];
        templateHost.setHost(this);
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this));
        this.eventHelper = new EmitterHelper(ngZone, this);
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


