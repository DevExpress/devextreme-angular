import { QueryList, ElementRef } from '@angular/core';

export interface INestedOptionContainer {
    instance: any;
}

export abstract class NestedOption implements INestedOptionContainer, ICollectionNestedOptionContainer {
    protected _host: INestedOptionContainer;
    protected _baseOptionPath: string;
    protected _hostOptionPath: string;
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    protected _initialOptions = {};

    protected _updateBaseOptionPath() {
        this._baseOptionPath = this._hostOptionPath + this._optionPath + '.';
    }

    protected _initInitialOptions() {
        this._host[this._optionPath] = this._initialOptions;
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

    protected abstract get _optionPath(): string;

    constructor(private _element: ElementRef) {
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this));
    }

    setHost(host: INestedOptionContainer, optionPath: string) {
        this._host = host;
        this._hostOptionPath = optionPath;
        this._initInitialOptions();
        this._updateBaseOptionPath();
    }

    _template(item: any, index, container) {
        return container.append(this._element.nativeElement);
    }

    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        return this._collectionContainerImpl.setChildren(propertyName, items);
    }

    get instance() {
        return this._host && this._host.instance;
    }

}

export interface ICollectionNestedOptionContainer {
    setChildren<T>(propertyName: string, items: QueryList<T>);
}

export class CollectionNestedOptionContainerImpl implements ICollectionNestedOptionContainer {
    private _activatedQueries = {};
    constructor(private _setOption: Function) {
    }
    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        if (items.length) {
            this._activatedQueries[propertyName] = true;
        }
        if (this._activatedQueries[propertyName]) {
            let widgetItems = items.map((item, index) => {
                item.index = index;
                return item.value;
            });
            this._setOption(propertyName, widgetItems);
        }
    }
}

export interface ICollectionNestedOption {
    index: number;
    value: Object;
}

export abstract class CollectionNestedOption extends NestedOption implements ICollectionNestedOption {
    private _index: number;

    protected _updateBaseOptionPath() {
        this._baseOptionPath = this._hostOptionPath + this._optionPath + '[' + this.index + '].';
    }

    get value() {
        return this._initialOptions;
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
