export interface INestedOptionContainer {
    instance: any;
}

export abstract class NestedOption implements INestedOptionContainer {

    protected _host: INestedOptionContainer;
    protected _baseOptionPath: string;
    setHost(host: INestedOptionContainer, optionPath: string) {
        this._host = host;

        this._host[this.optionPath] = {};
        this._baseOptionPath = optionPath + this.optionPath + '.';
    }

    setupChanges() {
        this.instance.on('optionChanged', e => {
            if (e.fullName.startsWith(this._baseOptionPath.split('.')[0])) {
                for (let option of this.options) {
                    this[option + 'Change'].emit(this[option]);
                }
            }
        });
    }

    get instance() {
        return this._host.instance;
    }

    abstract get optionPath(): string;
    abstract get options(): string[];

    private get _initialOptions() {
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
