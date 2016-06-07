import {
    Component,
    OnChanges, 
    ElementRef,
    SimpleChange,
    NgZone
} from "@angular/core";
    
import {DxTemplate} from "./dx.template";
import {DxTemplateHost} from "./dx.template-host";

declare var DevExpress:any;
declare var $:any;

var DX = DevExpress;

export class DxComponent implements OnChanges {
    private _initialOptions: any;
    private _isChangesProcessing = false;
    templates: DxTemplate[];
    widgetClassName: string;
    instance: any;
    
    protected _events: {subscribe?: string, emit: string}[];
    protected _properties: string[];
    
    private _createWidget() {
        var that = this,
            $element = $(this.element.nativeElement);

        if(this.templates.length) {
            var initialTemplates = {};
            this.templates.forEach(template => { 
                that._initialOptions[template.name] = function(itemData, itemIndex, itemElement) {
                    if(itemElement === undefined) {
                        if(itemIndex === undefined) {
                            itemElement = itemData;
                            itemData = undefined;
                        }
                        else {
                            itemElement = itemIndex;
                            itemIndex = undefined;
                        }
                    }
                    itemElement.empty();
                    template.render(itemData, itemElement, itemIndex);
                }; 
            });
            this._initialOptions._templates = initialTemplates;
        }
        $element[this.widgetClassName](this._initialOptions);
        this.instance = $element[this.widgetClassName]("instance");

        this._events.forEach(event => {
            if(event.subscribe) {
                that.instance.on(event.subscribe, function (e) {
                    if(event.subscribe === "optionChanged") {
                        var changeEventName = e.name + "Change";
                        if (that[changeEventName] && !that._isChangesProcessing) {
                            that[e.name] = e.value;
                            that[changeEventName].next(e.value);
                        }
                    }
                    else {
                        if(that[event.emit]) {
                            that.ngZone.run(function() {
                                that[event.emit].next(e);
                            });
                        }
                    }
                });
            }
        });
        
        var defaultOptions = this.instance.option();
        this._properties.forEach(property => {
            that[property] = defaultOptions[property];
        });
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




