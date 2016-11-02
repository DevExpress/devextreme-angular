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

function trimDxo(value: string) {
    return value.substr('dxo-'.length);
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
            widgetsMetadata = metadata['Widgets'],
            allNestedComponents = [];

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

                    if (option.Options) {
                        if (!option.IsCollection && widgetName !== 'dxPivotGridFieldChooser') {
                            let components = this.generateComplexOption(option, config, className, optionName);
                            nestedComponents = nestedComponents.concat(...components);
                        }
                        if (option.IsCollection) {
                            let childClassName = className + inflector.camelize(option.SingularName),
                                hasTemplate = undefined;

                            property.type = {
                                className: childClassName + 'Component',
                                selector: inflector.dasherize(inflector.underscore(childClassName)),
                                properties: Object.keys(option.Options)
                                .filter(childOptionName => {
                                    if (option.Options[childOptionName].IsTemplate) {
                                        hasTemplate = true;
                                        return false;
                                    }
                                    return true;
                                })
                                .map(childOptionName => {
                                    return {
                                        name: childOptionName
                                    };
                                })
                            };

                            property.type.hasTemplate = hasTemplate;
                            property.isComplexCollection = true;
                        }
                    }

                }
            }

            let allEvents = events.concat(changeEvents);

            let widgetNestedComponents = nestedComponents
                .reduce((result, component) => {
                    if (result.filter(c => c.className === component.className).length === 0) {
                        result.push({
                            path: component.path,
                            className: component.className
                        });
                    }

                    return result;
                }, []);

            allNestedComponents = allNestedComponents.concat(...nestedComponents);

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
                nestedComponents: widgetNestedComponents
            };

            logger('Write metadata to file ' + outputFilePath);
            this._store.write(outputFilePath, widgetMetadata);
        }

        this.generateNestedOptions(config, allNestedComponents);
    }

    generateComplexOption(option, config, hostClassName, optionName) {
        if (option.IsCollection || !option.Options || !Object.keys(option.Options).length) {
            return;
        }

        let underscoreSelector = 'dxo' + '_' + inflector.underscore(optionName).split('.').join('_');
        let selector = inflector.dasherize(underscoreSelector);

        let complexOptionMetadata: any = {
            className: inflector.camelize(underscoreSelector),
            selector:  selector,
            optionName: optionName,
            properties: [],
            path: trimDxo(selector)
        };

        let nestedComponents = [complexOptionMetadata];

        for (let optName in option.Options) {
            let property: any = {
                name: optName
            };
            let components = this.generateComplexOption(option.Options[optName], config, hostClassName, optName);
            nestedComponents = nestedComponents.concat(...components);

            complexOptionMetadata.properties.push(property);
        }

        return nestedComponents;
    }

    generateNestedOptions(config, nestedComponentsMetadata) {
        nestedComponentsMetadata.
            reduce((result, component) => {
                let existingComponent = result.filter(c => c.className === component.className)[0];

                if (!existingComponent) {
                    result.push(component);
                } else {
                    existingComponent.properties = existingComponent.properties.concat(...component.properties);

                    existingComponent.properties = existingComponent.properties.reduce((result1, property) => {
                        if (result1.filter(p => p.name === property.name).length === 0) {
                            result1.push(property);
                        }

                        return result1;
                    }, []);
                }

                return result;
            }, [])
            .forEach(componet => {
                let outputFilePath = path.join(config.nestedOutputFolderPath, componet.path + '.json');
                this._store.write(outputFilePath, componet);
            });
    }
}
