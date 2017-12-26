import {
    ElementRef,
    NgZone,
    QueryList,
    SimpleChanges,

    OnChanges,
    OnInit,
    DoCheck,
    AfterViewInit,
    AfterViewChecked
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

export abstract class DxComponent implements OnChanges, OnInit, DoCheck, AfterViewInit, AfterViewChecked,
    INestedOptionContainer, ICollectionNestedOptionContainer, IDxTemplateHost {
    private _initialOptions: any = {};
    protected _optionsToUpdate: any = {};
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    eventHelper: EmitterHelper;
    templates: DxTemplateDirective[];
    instance: any;
    isLinked = true;
    changedOptions = {};
    renderOnContentInit = true;
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

        let renderOnContentInit = this.renderOnContentInit;
        let optionChangeHandler = (e) => {
            this.eventHelper.rememberEvent(e.name);
        };

        this._initialOptions.onInitializing = function () {
            if (renderOnContentInit) {
                this.beginUpdate();
            }
            this.on('optionChanged', optionChangeHandler);
        };
        this.instance = this._createInstance(element, this._initialOptions);
        this._initialOptions = {};
        this.eventHelper.fireRemeberedEvents();

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

    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            let change = changes[key];
            if (change.currentValue !== this[key]) {
                this._optionsToUpdate[key] = changes[key].currentValue;
            }
        }
    }
    ngOnInit() {
        if (this.renderOnContentInit) {
            this._createWidget(this.element.nativeElement);
        }
    }
    ngDoCheck() {
        this.applyOptions();
    }
    ngAfterViewInit() {
        this._initTemplates();
        if (this.instance) {
            this.instance.endUpdate();
        }
    }
    ngAfterViewChecked() {
        this.applyOptions();
        this.unlockWidgetUpdate();
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
