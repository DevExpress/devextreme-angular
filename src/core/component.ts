import {
    ElementRef,
    NgZone,
    QueryList,
    AfterViewInit
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

export abstract class DxComponent implements AfterViewInit, INestedOptionContainer, ICollectionNestedOptionContainer {
    private _initialOptions: any;
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    eventHelper: EmitterHelper;
    templates: DxTemplateDirective[];
    instance: any;
    changedOptions = {};
    renderOnViewInit = true;
    events = {};
    ProcessEvent: Function;

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
    private optionChangeHandler(e) {
        this.changedOptions[e.name] = e.value;
        this.ProcessEvent(e);
    }
    _shouldOptionChange(name: string, value: any) {
        if (this.changedOptions.hasOwnProperty(name)) {
            const prevValue = this.changedOptions[name];
            delete this.changedOptions[name];

            return value !== prevValue;
        }
        return true;
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
            this._updateOption(name, value);
        } else {
            this._initialOptions[name] = value;
        }
    }
    protected _updateOption(name: string, value: any) {
        if (this._shouldOptionChange(name, value)) {
            this.instance.option(name, value);
        };
    }
    protected abstract _createInstance(element, options)
    protected _createWidget(element: any) {
        let that = this;

        this._initTemplates();
        this._initOptions();

        this.ProcessEvent = function(e) {
            that.events[e.name + 'Change'] = [e.value];
        };

        this._initialOptions.onInitializing = function() {
            this.on('optionChanged', that.optionChangeHandler.bind(that));
        };
        this.instance = this._createInstance(element, this._initialOptions);

        this.ProcessEvent = function(e) {
            that.eventHelper.fireNgEvent(e.name + 'Change', [e.value]);
        };

        let subsriber = this.ngZone.onStable.subscribe(() => {
            subsriber.unsubscribe();

            that.ngZone.run(() => {
                for (let key in that.events) {
                    that.eventHelper.fireNgEvent(key, that.events[key]);
                }
            });
        });
    }
    protected _destroyWidget() {
        if (this.instance) {
            let element = this.instance.element();
            element.triggerHandler({ type: 'dxremove', _angularIntegration: true });
            element.remove();
        }
    }
    constructor(protected element: ElementRef, private ngZone: NgZone, templateHost: DxTemplateHost, private watcherHelper: WatcherHelper) {
        this._initialOptions = { integrationOptions: {} };
        this.templates = [];
        templateHost.setHost(this);
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this));
        this.eventHelper = new EmitterHelper(this.ngZone, this);
    }
    ngAfterViewInit() {
        if (this.renderOnViewInit) {
            this._createWidget(this.element.nativeElement);
        }
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


