import { QueryList, ElementRef } from '@angular/core';

export interface INestedOptionContainer {
    instance: any;
}

export abstract class NestedOption implements INestedOptionContainer {

    protected _host: INestedOptionContainer;
    protected _baseOptionPath: string;
    protected _hostOptionPath: string;

    setHost(host: INestedOptionContainer, optionPath: string) {
        this._host = host;
        this._hostOptionPath = optionPath;
        this._setInitialOptions();
        this._updateBaseOptionPath();
    }

    setupChanges() {
        this.instance.on('optionChanged', e => {
            if (e.fullName.startsWith(this._baseOptionPath.split('.')[0])) {
                for (let option of this.__options) {
                    this[option + 'Change'].emit(this[option]);
                }
            }
        });
    }

    get instance() {
        return this._host.instance;
    }

    abstract get optionPath(): string;
    abstract get __options(): string[];

    protected _updateBaseOptionPath() {
        this._baseOptionPath = this._hostOptionPath + this.optionPath + '.';
    }

    protected _setInitialOptions() {
        this._host[this.optionPath] = {};
    }

    protected get _initialOptions() {
        return this._host[this.optionPath];
    }

    protected _getOption(name: string): any {
        if (this.instance) {
            return this.instance.option(this._baseOptionPath + name);
        } else {
            return this._initialOptions[name];
        }
    }

    protected _setOption(name: string, value: any) {
        if (this.instance) {
            this.instance.option(this._baseOptionPath + name, value);
        } else {
            this._initialOptions[name] = value;
        }
    }

    constructor(private _element: ElementRef) {
        this.template = this.template.bind(this);
    }

    template(item: any, index, container) {
        return container.append(this._element.nativeElement);
    }
}

export interface ICollectionNestedOptionContainer {
    setChildren<T>(propertyName: string, items: QueryList<T>);
}

export interface ICollectionNestedOption {
    index: number;
    value: Object;
}

export abstract class CollectionNestedOption extends NestedOption implements ICollectionNestedOption {
    private _index: number;
    private _initialValue: Object;

    protected _updateBaseOptionPath() {
        this._baseOptionPath = this._hostOptionPath + this.optionPath + '[' + this.index + '].';
    }

    protected _setInitialOptions() {
        this._initialValue = {
            template: this.template
        };
    }

    protected get _initialOptions() {
        return this._initialValue;
    }

    get value() {
        return this._initialValue;
    }

    get index() {
        return this._index;
    }
    set index(value) {
        this._index = value;
        this._updateBaseOptionPath();
    }
}

export class NestedOptionHost {
    private _host: INestedOptionContainer;
    private _optionPath: string;
    private _nestedOptions: NestedOption[] = [];

    setHost(_host: INestedOptionContainer, optionPath?: string) {
        this._host = _host;
        this._optionPath = optionPath || '';
    }

    setupChanges() {
        for (let nestedOption of this._nestedOptions) {
            nestedOption.setupChanges();
        }
    }

    setNestedOption(nestedOption: NestedOption) {
        this._nestedOptions.push(nestedOption);
        nestedOption.setHost(this._host, this._optionPath);
    }
}
