/// <reference path="../../typings/globals/node/index.d.ts" />
/// <reference path="../../typings/modules/mkdirp/index.d.ts" />

import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import logger from './logger';
let inflector = require('inflector-js');

function trimDx(value: string) {
    return value.substr('dx-'.length);
}

export interface IObjectStore {
    read(name: string): Object;
    write(name: string, data: Object): void;
}

export class FSObjectStore implements IObjectStore {
    private _encoding = 'utf8';
    read(filePath) {
        logger('Read from file: ' + filePath);
        let dataString = fs.readFileSync(filePath, this._encoding);
        logger('Parse data');
        return JSON.parse(dataString);
    }
    write(filePath, data) {
        logger('Write data to file ' + filePath);
        let dataString = JSON.stringify(data, null, 4);
        fs.writeFileSync(filePath, dataString, { encoding: this._encoding });
    }
}

export default class DXComponentMetadataGenerator {
    constructor(private _store?: IObjectStore) {
        if (!this._store) {
            this._store = new FSObjectStore();
        }
    }
    generate(config) {
        let metadata = this._store.read(config.sourceMetadataFilePath),
            widgetsMetadata = metadata['Widgets'];

        mkdirp.sync(config.outputFolderPath);
        mkdirp.sync(config.nestedOutputFolderPath);

        for (let widgetName in widgetsMetadata) {
            let widget = widgetsMetadata[widgetName],
                nestedComponents = [];

            if (!widget.Module) {
                logger('Skipping metadata for ' + widgetName);
                continue;
            }

            logger('Generate metadata for ' + widgetName);

            let isTranscludedContent = widget.IsTranscludedContent,
                isExtension = widget.IsExtensionComponent || false,
                className = inflector.camelize(widgetName),
                dasherizedWidgetName = inflector.dasherize(inflector.underscore(widgetName)),
                outputFilePath = path.join(config.outputFolderPath, trimDx(dasherizedWidgetName) + '.json'),
                events = [],
                changeEvents = [],
                properties = [],
                isEditor = false;

            for (let optionName in widget.Options) {
                let option = widget.Options[optionName];

                if (option.IsEvent) {
                    let eventName = inflector.camelize(optionName.substr('on'.length), true);

                    events.push({
                        emit: optionName,
                        subscribe: eventName
                    });
                } else {
                    let property: any = {
                        name: optionName,
                        type: 'any'
                    };

                    if (!!option.IsCollection || !!option.IsDataSource) {
                        property.isCollection = true;
                    }

                    if (option.PrimitiveTypes) {
                        // TODO specify primitive types
                        // property.type = primitiveType;
                    }
                    properties.push(property);

                    changeEvents.push({
                        emit: optionName + 'Change'
                    });

                    if (optionName === 'value') {
                        isEditor = true;
                    }

                    if (widgetName === 'dxTreeMap' && option.Options && !option.IsCollection) {
                        let components = this.generateComplexOption(option, config, className, optionName);
                        nestedComponents = nestedComponents.concat(...components);
                    }

                }
            }

            let allEvents = events.concat(changeEvents);

            let widgetMetadata = {
                className: className,
                widgetName: widgetName,
                isTranscludedContent: isTranscludedContent,
                isExtension: isExtension,
                selector: dasherizedWidgetName,
                events: allEvents,
                properties: properties,
                isEditor: isEditor,
                module: 'devextreme/' + widget.Module,
                nestedComponents: nestedComponents
            };

            logger('Write metadata to file ' + outputFilePath);
            this._store.write(outputFilePath, widgetMetadata);
        }
    }

    generateComplexOption(option, config, hostClassName, baseOptionPath) {
        if (!option.Options || option.IsCollection) {
            return;
        }

        let underscoreHostClassName = inflector.underscore(hostClassName);
        let underscoreSelector = underscoreHostClassName + '_' + inflector.underscore(baseOptionPath).split('.').join('_');
        let selector = inflector.dasherize(underscoreSelector);

        let complexOptionMetadata: any = {
            className: inflector.camelize(underscoreSelector),
            selector:  selector,
            hostClassName: hostClassName,
            hostModulePath: trimDx(inflector.dasherize(underscoreHostClassName)),
            baseOptionPath: baseOptionPath,
            props: []
        };

        let nestedComponents = [{
            className: complexOptionMetadata.className,
            path: trimDx(selector)
        }];

        for (let optName in option.Options) {
            let property: any = {
                name: optName
            };

            let components = this.generateComplexOption(option.Options[optName], config, hostClassName, baseOptionPath + '.' + optName);
            nestedComponents = nestedComponents.concat(...components);

            complexOptionMetadata.props.push(property);
        }

        let outputFilePath = path.join(config.nestedOutputFolderPath, trimDx(selector) + '.json');
        this._store.write(outputFilePath, complexOptionMetadata);

        return nestedComponents;
    }
}