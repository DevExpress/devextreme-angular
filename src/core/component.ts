import {
    ElementRef,
    NgZone,
    QueryList,
    SimpleChanges,

    OnChanges,
    OnInit,
    DoCheck,
    AfterContentChecked,
    AfterViewInit
} from '@angular/core';

import { ɵgetDOM as getDOM } from '@angular/platform-browser';

import { DxTemplateDirective } from './template';
import { IDxTemplateHost, DxTemplateHost } from './template-host';
import { EmitterHelper } from './events-strategy';
import { WatcherHelper } from './watcher-helper';
import * as events from 'devextreme/events';
import {
    INestedOptionContainer,
    ICollectionNestedOption,
    ICollectionNestedOptionContainer,
    CollectionNestedOptionContainerImpl
} from './nested-option';

export abstract class DxComponent implements OnChanges, OnInit, DoCheck, AfterContentChecked, AfterViewInit,
    INestedOptionContainer, ICollectionNestedOptionContainer, IDxTemplateHost {
    private _initialOptions: any = {};
    protected _optionsToUpdate: any = {};
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    eventHelper: EmitterHelper;
    templates: DxTemplateDirective[];
    instance: any;
    isLinked = true;
    changedOptions = {};
    createInstanceOnInit = true;
    widgetUpdateLocked = false;

    protected _events: { subscribe?: string, emit: string }[];

    private _initTemplates() {
        if (this.templates.length) {
            let initialTemplates = {};
            this.templates.forEach(template => {
                initialTemplates[template.name] = template;
            });
            this.instance.option('integrationOptions.templates', initialTemplates);
        }
    }
    private _initEvents() {
        this.instance.on('optionChanged', (e) => {
            this.changedOptions[e.name] = e.value;
            this.eventHelper.fireNgEvent(e.name + 'Change', [e.value]);
        });
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
    _shouldOptionChange(name: string, value: any) {
        if (this.changedOptions.hasOwnProperty(name)) {
            const prevValue = this.changedOptions[name];
            delete this.changedOptions[name];

            return value !== prevValue;
        }
        return true;
    }
    clearChangedOptions() {
        this.changedOptions = {};
    }
    protected _getOption(name: string) {
        return this.instance ?
            this.instance.option(name) :
            this._initialOptions[name];
    }
    lockWidgetUpdate() {
        if (!this.widgetUpdateLocked && this.instance) {
            this.instance.beginUpdate();
            this.widgetUpdateLocked = true;
        }
    }
    unlockWidgetUpdate() {
        if (this.widgetUpdateLocked) {
            this.widgetUpdateLocked = false;
            this.instance.endUpdate();
        }
    }
    protected _setOption(name: string, value: any) {
        this.lockWidgetUpdate();

        if (!this._shouldOptionChange(name, value)) {
            return;
        }

        if (this.instance) {
            this.instance.option(name, value);
        } else {
            this._initialOptions[name] = value;
        }
    }
    protected abstract _createInstance(element, options)
    protected _createWidget(element: any) {
        this._initialOptions.integrationOptions = {};
        this._initOptions();

        let createInstanceOnInit = this.createInstanceOnInit;

        this._initialOptions.onInitializing = function () {
            if (createInstanceOnInit) {
                this.beginUpdate();
            }
        };
        this.instance = this._createInstance(element, this._initialOptions);
        this._initEvents();
        this._initialOptions = {};
    }
    protected _destroyWidget() {
        if (this.instance) {
            let element = this.instance.element();
            events.triggerHandler(element, { type: 'dxremove', _angularIntegration: true });
            this.instance.dispose();
            getDOM().remove(element);
        }
    }
    constructor(protected element: ElementRef, private ngZone: NgZone, templateHost: DxTemplateHost, private watcherHelper: WatcherHelper) {
        this.templates = [];
        templateHost.setHost(this);
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this));
        this.eventHelper = new EmitterHelper(this.ngZone, this);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            let change = changes[key];
            if (change.currentValue !== this[key]) {
                this._optionsToUpdate[key] = changes[key].currentValue;
            }
        }
    }
    ngOnInit() {
        if (this.createInstanceOnInit) {
            this._createWidget(this.element.nativeElement);
        }
    }
    ngDoCheck() {
        this.applyOptions();
    }
    ngAfterContentChecked() {
        this.applyOptions();
        this.unlockWidgetUpdate();
    }
    ngAfterViewInit() {
        this._initTemplates();
        if (this.createInstanceOnInit) {
            this.instance.endUpdate();
        }
    }

    applyOptions() {
        if (Object.keys(this._optionsToUpdate).length) {
            if (this.instance) {
                this.instance.option(this._optionsToUpdate);
            }
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
