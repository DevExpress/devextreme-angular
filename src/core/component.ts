import {
    ElementRef,
    NgZone,
    QueryList,
    AfterViewInit,
    AfterContentChecked
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

export abstract class DxComponent implements AfterViewInit, AfterContentChecked, INestedOptionContainer, ICollectionNestedOptionContainer {
    private _optionToUpdate: any = {};
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
            this._optionToUpdate.integrationOptions.templates = initialTemplates;
        }
    }
    private _initOptions() {
        this._optionToUpdate.eventsStrategy = this.eventHelper.strategy;
        this._optionToUpdate.integrationOptions.watchMethod = this.watcherHelper.getWatchMethod();
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
            this._optionToUpdate[name];
    }
    protected _setOption(name: string, value: any) {
        if (this._shouldOptionChange(name, value)) {
            this._optionToUpdate[name] = value;
        };
    }
    protected abstract _createInstance(element, options)
    protected _createWidget(element: any) {
        let events = [];

        this._optionToUpdate.integrationOptions = {};
        this._initTemplates();
        this._initOptions();

        let optionChangeHandler = function(e) {
            events.push(e.name);
        };

        this._optionToUpdate.onInitializing = function() {
            this.on('optionChanged', optionChangeHandler);
        };
        this.instance = this._createInstance(element, this._optionToUpdate);
        this._optionToUpdate = {};

        this.instance.off('optionChanged', optionChangeHandler);
        this.instance.on('optionChanged', (e) => {
            this.changedOptions[e.name] = e.value;
            this.eventHelper.fireNgEvent(e.name + 'Change', [e.value]);
        });

        let subsriber = this.ngZone.onStable.subscribe(() => {
            subsriber.unsubscribe();

            this.ngZone.run(() => {
                events.forEach(name => {
                    this.eventHelper.fireNgEvent(name + 'Change', [this[name]]);
                });
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
        this.templates = [];
        templateHost.setHost(this);
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this));
        this.eventHelper = new EmitterHelper(this.ngZone, this);
    }
    ngAfterContentChecked() {
        if (this.instance && Object.keys(this._optionToUpdate).length) {
            this.instance.option(this._optionToUpdate);
            this._optionToUpdate = {};
        }
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


