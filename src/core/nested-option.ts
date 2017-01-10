import { QueryList, ElementRef } from '@angular/core';

export interface INestedOptionContainer {
    instance: any;
}

export interface OptionPathGetter { (): string; }

export abstract class BaseNestedOption implements INestedOptionContainer, ICollectionNestedOptionContainer {
    protected _host: INestedOptionContainer;
    protected _hostOptionPath: OptionPathGetter;
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    protected _initialOptions = {};

    protected abstract get _optionPath(): string;
    protected abstract _fullOptionPath(): string;

    constructor(private _element: ElementRef) {
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this));
    }

    protected _getOption(name: string): any {
        if (this.isLinked) {
            return this.instance.option(this._fullOptionPath() + name);
        } else {
            return this._initialOptions[name];
        }
    }

    protected _setOption(name: string, value: any) {
        if (this.isLinked) {
            this.instance.option(this._fullOptionPath() + name, value);
        } else {
            this._initialOptions[name] = value;
        }
    }

    setHost(host: INestedOptionContainer, optionPath: OptionPathGetter) {
        this._host = host;
        this._hostOptionPath = optionPath;
    }

    _template(...args) {
        let container = args[2];
        return container.append(this._element.nativeElement);
    }

    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        return this._collectionContainerImpl.setChildren(propertyName, items);
    }

    get instance() {
        return this._host && this._host.instance;
    }

    get isLinked() {
        return !!this.instance;
    }
}

export interface ICollectionNestedOptionContainer {
    setChildren<T>(propertyName: string, items: QueryList<T>);
}

export class CollectionNestedOptionContainerImpl implements ICollectionNestedOptionContainer {
    private _activatedQueries = {};
    constructor(private _setOption: Function) {}
    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        if (items.length) {
            this._activatedQueries[propertyName] = true;
        }
        if (this._activatedQueries[propertyName]) {
            let widgetItems = items.map((item, index) => {
                item._index = index;
                return item._value;
            });
            this._setOption(propertyName, widgetItems);
        }
    }
}

export abstract class NestedOption extends BaseNestedOption {
    setHost(host: INestedOptionContainer, optionPath: OptionPathGetter) {
        super.setHost(host, optionPath);

        this._host[this._optionPath] = this._initialOptions;
    }

    protected _fullOptionPath() {
        return this._hostOptionPath() + this._optionPath + '.';
    }
}

export interface ICollectionNestedOption {
    _index: number;
    _value: Object;
}

export abstract class CollectionNestedOption extends BaseNestedOption implements ICollectionNestedOption {
    _index: number;

    protected _fullOptionPath() {
        return this._hostOptionPath() + this._optionPath + '[' + this._index + ']' + '.';
    }

    get _value() {
        return this._initialOptions;
    }

    get isLinked() {
        return this._index !== undefined && !!this.instance;
    }
}

export class NestedOptionHost {
    private _host: INestedOptionContainer;
    private _optionPath: OptionPathGetter;

    setHost(host: INestedOptionContainer, optionPath?: OptionPathGetter) {
        this._host = host;
        this._optionPath = optionPath || (() => '');
    }

    setNestedOption(nestedOption: BaseNestedOption) {
        nestedOption.setHost(this._host, this._optionPath);
    }
}
