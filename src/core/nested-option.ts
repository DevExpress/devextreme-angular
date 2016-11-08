import { QueryList, ElementRef } from '@angular/core';

export interface INestedOptionContainer {
    instance: any;
}

export abstract class NestedOption implements INestedOptionContainer {
    protected _host: INestedOptionContainer;
    protected _baseOptionPath: string;
    protected _hostOptionPath: string;

    protected _updateBaseOptionPath() {
        this._baseOptionPath = this._hostOptionPath + this._optionPath + '.';
    }

    protected _initInitialOptions() {
        this._host[this._optionPath] = {};
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

    protected get _initialOptions() {
        return this._host[this._optionPath];
    }

    protected abstract get _optionPath(): string;

    constructor(private _element: ElementRef) {
        this.template = this.template.bind(this);
    }

    setHost(host: INestedOptionContainer, optionPath: string) {
        this._host = host;
        this._hostOptionPath = optionPath;
        this._initInitialOptions();
        this._updateBaseOptionPath();
    }

    template(item: any, index, container) {
        return container.append(this._element.nativeElement);
    }

    get instance() {
        return this._host.instance;
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
        this._baseOptionPath = this._hostOptionPath + this._optionPath + '[' + this.index + '].';
    }

    protected _initInitialOptions() {
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

    setNestedOption(nestedOption: NestedOption) {
        this._nestedOptions.push(nestedOption);
        nestedOption.setHost(this._host, this._optionPath);
    }
}
