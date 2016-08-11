import {
    Component,
    OnChanges,
    AfterViewInit,
    ElementRef,
    SimpleChange,
    NgZone
} from "@angular/core";

import {DxTemplate} from "./dx.template";
import {DxTemplateHost} from "./dx.template-host";

declare var DevExpress:any;
declare var $:any;

var DX = DevExpress;

export class DxComponent implements OnChanges, AfterViewInit {
    private _initialOptions: any;
    private _isChangesProcessing = false;
    templates: DxTemplate[];
    widgetClassName: string;
    instance: any;

    protected _events: {subscribe?: string, emit: string}[];
    protected _properties: string[];

    private _initTemplates() {
        if(this.templates.length) {
            let initialTemplates = {};
            this.templates.forEach(template => {
                this._initialOptions[template.name] = template.render.bind(template);
                initialTemplates[template.name] = template;
            });
            this._initialOptions._templates = initialTemplates;
        }
    }
    private _initEvents() {
        this._events.forEach(event => {
            if(event.subscribe) {
                this.instance.on(event.subscribe, e => {
                    if(event.subscribe === "optionChanged") {
                        var changeEventName = e.name + "Change";
                        if(this[changeEventName] && !this._isChangesProcessing) {
                            this[e.name] = e.value;
                            this[changeEventName].next(e.value);
                        }
                    }
                    else {
                        if(this[event.emit]) {
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
        var defaultOptions = this.instance.option();
        this._properties.forEach(property => {
            this[property] = defaultOptions[property];
        });
    }
    private _createInstance() {
        var $element = $(this.element.nativeElement);
        $element[this.widgetClassName](this._initialOptions);
        this.instance = $element[this.widgetClassName]("instance");
    }
    private _createWidget() {
        this._initTemplates();
        this._createInstance();
        this._initEvents();
        this._initProperties();
    }
    constructor(private element: ElementRef, private ngZone: NgZone, templateHost: DxTemplateHost) {
        this._initialOptions = {};
        this.templates = [];
        templateHost.setHost(this);
    }
    setTemplate(template: DxTemplate) {
        this.templates.push(template);
    }
    ngOnChanges(changes: {[key: string]: SimpleChange}) {
        var that = this;

        if(that.instance) {
            $.each(changes, function(propertyName, change) {
                that._isChangesProcessing = true; // prevent cycle change event emitting
                that.instance.option(propertyName, change.currentValue);
                that._isChangesProcessing = false;
            });
        }
        else {
            $.each(changes, function(propertyName, change) {
                that._initialOptions[propertyName] = change.currentValue;
            });
        }
    }
    ngAfterViewInit() {
        this._createWidget();
    }
}




