import { QueryList, ElementRef } from '@angular/core';

declare function require(params: any): any;
let $ = require('jquery');

import { DX_TEMPLATE_WRAPPER_CLASS } from './template';

const VISIBILITY_CHANGE_SELECTOR = 'dx-visibility-change-handler';

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

    constructor() {
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this), this._filterItems.bind(this));
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

    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        return this._collectionContainerImpl.setChildren(propertyName, items);
    }

    _filterItems(items: QueryList<BaseNestedOption>) {
        return items.filter((item) => { return item !== this; });
    }

    get instance() {
        return this._host && this._host.instance;
    }

    get isLinked() {
        return !!this.instance;
    }
}

export interface ICollectionNestedOptionContainer {
    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>);
}

export class CollectionNestedOptionContainerImpl implements ICollectionNestedOptionContainer {
    private _activatedQueries = {};

    constructor(private _setOption: Function, private _filterItems?: Function) {}

    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        if (this._filterItems) {
            items = this._filterItems(items);
        }
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

export interface OptionWithTemplate extends BaseNestedOption {
    template: any;
}
export function extractTemplate(option: OptionWithTemplate, element: ElementRef) {
    if (!option.template === undefined || !element.nativeElement.hasChildNodes()) {
        return;
    }

    let childNodes = [].slice.call(element.nativeElement.childNodes);
    let userContent = childNodes.filter((n) => {
        if (n.tagName) {
            let tagNamePrefix = n.tagName.toLowerCase().substr(0, 3);
            return !(tagNamePrefix === 'dxi' || tagNamePrefix === 'dxo');
        } else {
            return n.nodeName !== '#comment' && n.textContent.replace(/\s/g, '').length;
        }
    });
    if (!userContent.length) {
        return;
    }

    function triggerShownEvent($element) {
        let changeHandlers = $();

        if ($element.hasClass(VISIBILITY_CHANGE_SELECTOR)) {
            changeHandlers = $element;
        }

        changeHandlers = changeHandlers.add($element.find('.' + VISIBILITY_CHANGE_SELECTOR));

        for (let i = 0; i < changeHandlers.length; i++) {
            $(changeHandlers[i]).triggerHandler('dxshown');
        }
    }

    option.template = {
        render: (renderData) => {
            let $result = $(element.nativeElement).addClass(DX_TEMPLATE_WRAPPER_CLASS);

            if (renderData.container) {
                let container = renderData.container.get(0);
                let resultInContainer = container.contains(element.nativeElement);

                renderData.container.append(element.nativeElement);

                if (!resultInContainer) {
                    let resultInBody = document.body.contains(container);

                    if (resultInBody) {
                        triggerShownEvent($result);
                    }
                }
            }

            return $result;
        }
    };
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
