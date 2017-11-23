import {
    ElementRef,
    NgZone,
    QueryList,
    AfterViewInit,
    DoCheck,
    AfterContentChecked
} from '@angular/core';

import { DxTemplateDirective } from './template';
import { IDxTemplateHost, DxTemplateHost } from './template-host';
import { EmitterHelper } from './events-strategy';
import { WatcherHelper } from './watcher-helper';
import * as events from 'devextreme/events';
import { removeElement } from './utils';
import {
    INestedOptionContainer,
    ICollectionNestedOption,
    ICollectionNestedOptionContainer,
    CollectionNestedOptionContainerImpl
} from './nested-option';

export abstract class DxComponent implements AfterViewInit, DoCheck, AfterContentChecked,
        INestedOptionContainer, ICollectionNestedOptionContainer, IDxTemplateHost {
    private _optionsToUpdate: any = {};
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    eventHelper: EmitterHelper;
    templates: DxTemplateDirective[];
    instance: any;
    changedOptions = {};
    renderOnViewInit = true;

    protected _events: { subscribe?: string, emit: string }[];

    private _initTemplates() {
        if (this.templates.length) {
            let initialTemplates = {};
            this.templates.forEach(template => {
                initialTemplates[template.name] = template;
            });
            this._optionsToUpdate.integrationOptions.templates = initialTemplates;
        }
    }
    private _initOptions() {
        this._optionsToUpdate.eventsStrategy = this.eventHelper.strategy;
        this._optionsToUpdate.integrationOptions.watchMethod = this.watcherHelper.getWatchMethod();
    }
    protected _createEventEmitters(events) {
        events.forEach(event => {
            this.eventHelper.createEmitter(event.emit, event.subscribe);
        });
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
        return this.instance ?
            this.instance.option(name) :
            this._optionsToUpdate[name];
    }
    protected _setOption(name: string, value: any) {
        if (this._shouldOptionChange(name, value)) {
            this.updateOption(name, value);
        };
    }
    public updateOption(name: string, value: any) {
        this._optionsToUpdate[name] = value;
    }
    protected abstract _createInstance(element, options)
    protected _createWidget(element: any) {
        this._optionsToUpdate.integrationOptions = {};
        this._initTemplates();
        this._initOptions();

        let optionChangeHandler = (e) => {
            this.eventHelper.rememberEvent(e.name);
        };

        this._optionsToUpdate.onInitializing = function() {
            this.on('optionChanged', optionChangeHandler);
        };
        this.instance = this._createInstance(element, this._optionsToUpdate);
        this._optionsToUpdate = {};

        this.instance.off('optionChanged', optionChangeHandler);
        this.instance.on('optionChanged', (e) => {
            this.changedOptions[e.name] = e.value;
            this.eventHelper.fireNgEvent(e.name + 'Change', [e.value]);
        });
    }
    protected _destroyWidget() {
        if (this.instance) {
            let element = this.instance.element();
            events.triggerHandler(element, { type: 'dxremove', _angularIntegration: true });
            this.instance.dispose();
            removeElement(element);
        }
    }
    constructor(protected element: ElementRef, private ngZone: NgZone, templateHost: DxTemplateHost, private watcherHelper: WatcherHelper) {
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
    ngAfterContentChecked() {
        this.applyOptions();
    }
    ngDoCheck() {
        this.applyOptions();
    }
    applyOptions() {
        if (this.instance && Object.keys(this._optionsToUpdate).length) {
            this.instance.option(this._optionsToUpdate);
            this._optionsToUpdate = {};
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
