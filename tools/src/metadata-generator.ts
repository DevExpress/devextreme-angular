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
        mkdirp.sync(path.join(config.outputFolderPath, config.nestedPathPart));
        mkdirp.sync(path.join(config.outputFolderPath, config.nestedPathPart, config.basePathPart));

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
                isEditor = Object.keys(widget.Options).indexOf('value') !== -1;

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

                    properties.push(property);

                    changeEvents.push({
                        emit: optionName + 'Change'
                    });

                    let components = this.generateComplexOptionByType(metadata, option, optionName, []);
                    nestedComponents = nestedComponents.concat(...components);
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

            allNestedComponents = allNestedComponents.concat(...nestedComponents);
        }

        this.generateNestedOptions(config, allNestedComponents);
    }

    private generateComplexOptionByType(metadata, option, optionName, complexTypes) {
        if (option.IsCollection) {
            return;
        }

        if (option.Options) {
            return this.generateComplexOption(metadata, option.Options, optionName, complexTypes);
        } else if (option.ComplexTypes && option.ComplexTypes.length === 1) {
            if (complexTypes.indexOf(complexTypes[complexTypes.length - 1]) !== complexTypes.length - 1) {
                return;
            }

            let complexType = option.ComplexTypes[0];
            let externalObject = metadata.ExtraObjects[complexType];
            if (externalObject) {
                let nestedOptions = externalObject.Options;
                let nestedComplexTypes = complexTypes.concat(complexType);

                let components = this.generateComplexOption(metadata, nestedOptions, optionName, nestedComplexTypes);
                components[0].baseClass = 'Dxo' + complexType;
                components[0].basePath = inflector.dasherize(inflector.underscore(complexType));
                return components;
            } else {
                logger('WARN: missed complex type: ' + complexType);
            }
        }
    }

    private generateComplexOption(metadata, nestedOptions, optionName, complexTypes) {
        if (!nestedOptions || !Object.keys(nestedOptions).length) {
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

        for (let optName in nestedOptions) {
            let property: any = {
                name: optName
            };
            complexOptionMetadata.properties.push(property);

            let components = this.generateComplexOptionByType(metadata, nestedOptions[optName], optName, complexTypes);
            nestedComponents = nestedComponents.concat(...components);
        }

        return nestedComponents;
    }

    private generateNestedOptions(config, metadata) {
        let normalizedMetadata = metadata
            .reduce((result, component) => {
                let existingComponent = result.filter(c => c.className === component.className)[0];

                if (!existingComponent) {
                    result.push(component);
                } else if (existingComponent.properties && component.properties) {
                    existingComponent.properties = existingComponent.properties.concat(...component.properties);

                    existingComponent.properties = existingComponent.properties.reduce((result1, property) => {
                        if (result1.filter(p => p.name === property.name).length === 0) {
                            result1.push(property);
                        }

                        return result1;
                    }, []);

                    existingComponent.baseClass = existingComponent.baseClass || component.baseClass;
                    existingComponent.basePath = existingComponent.basePath || component.basePath;
                }

                return result;
            }, []);

        normalizedMetadata
            .reduce((result, component) => {
                let existingComponent = result.filter(c => c.className === component.baseClass)[0];
                if (!existingComponent && component.baseClass) {
                    result.push({
                        properties: component.properties,
                        className: component.baseClass,
                        path: component.basePath
                    });
                }

                return result;
            }, [])
            .forEach(componet => {
                let outputFilePath = path.join(config.outputFolderPath,
                    config.nestedPathPart, config.basePathPart, componet.path + '.json');
                this._store.write(outputFilePath, componet);
            });

        normalizedMetadata
            .forEach((component) => {
                if (component.baseClass) {
                    delete component.properties;
                }
            });

        normalizedMetadata
            .forEach(componet => {
                let outputFilePath = path.join(config.outputFolderPath, config.nestedPathPart, componet.path + '.json');
                this._store.write(outputFilePath, componet);
            });
    }
}
