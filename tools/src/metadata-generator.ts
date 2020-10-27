import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import merge = require('deepmerge');
import logger from './logger';
let inflector = require('inflector-js');

const OPTION_COMPONENT_PREFIX = 'Dxo';
const ITEM_COMPONENT_PREFIX = 'Dxi';
const TYPES_SEPORATOR = ' | ';

function trimDx(value: string) {
    return trimPrefix('dx-', value);
}

function trimPrefix(prefix: string, value: string) {
    if (value.indexOf(prefix) === 0) {
        return value.substr(prefix.length);
    }
    return value;
}

export interface IObjectStore {
    read(name: string): Object;
    write(name: string, data: Object): void;
}

export class FSObjectStore implements IObjectStore {
    private _encoding = 'utf8';
    read(filePath) {
        logger(`Read from file: ${filePath}`);
        let dataString = fs.readFileSync(filePath, this._encoding);
        logger('Parse data');
        return JSON.parse(dataString);
    }
    write(filePath, data) {
        logger(`Write data to file ${filePath}`);
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
        // TODO: Remove deprecatedMetadata in 18.1.
        let sourceMetadata = this._store.read(config.sourceMetadataFilePath);
        let deprecatedMetadata = this._store.read(config.deprecatedMetadataFilePath);
        let metadata = merge(sourceMetadata, deprecatedMetadata);

        let widgetsMetadata = metadata['Widgets'];
        let allNestedComponents = [];

        mkdirp.sync(config.outputFolderPath);
        mkdirp.sync(path.join(config.outputFolderPath, config.nestedPathPart));
        mkdirp.sync(path.join(config.outputFolderPath, config.nestedPathPart, config.basePathPart));

        for (let widgetName in widgetsMetadata) {
            let widget = widgetsMetadata[widgetName],
                nestedComponents = [];

            if (!widget.Module) {
                logger(`Skipping metadata for ${widgetName}`);
                continue;
            }

            logger(`Generate metadata for ${widgetName}`);

            let isTranscludedContent = widget.IsTranscludedContent,
                isViz = widget.Module.indexOf('viz') === 0,
                isExtension = widget.IsExtensionComponent || false,
                className = inflector.camelize(widgetName),
                dasherizedWidgetName = inflector.dasherize(inflector.underscore(widgetName)),
                outputFilePath = path.join(config.outputFolderPath, trimDx(dasherizedWidgetName) + '.json'),
                events = [],
                changeEvents = [],
                properties = [],
                isEditor = Object.keys(widget.Options).indexOf('onValueChanged') !== -1,
                isDevExpressRequired = false;

            for (let optionName in widget.Options) {
                let option = widget.Options[optionName];

                if (option.IsEvent) {
                    let eventName = inflector.camelize(optionName.substr('on'.length), true);

                    events.push({
                        emit: optionName,
                        subscribe: eventName,
                        description: option.Description,
                        type: 'EventEmitter<any>'
                    });
                } else {
                    let typesDescription = this.getTypesDescription(option);
                    let finalizedType = this.getType(typesDescription);

                    isDevExpressRequired = isDevExpressRequired || typesDescription.isDevExpressRequired;

                    let property: any = {
                        name: optionName,
                        type: finalizedType,
                        typesDescription: typesDescription,
                        description: option.Description
                    };

                    if (!!option.IsCollection || !!option.IsDataSource) {
                        property.isCollection = true;
                    }

                    properties.push(property);

                    changeEvents.push(this.createEvent(optionName, finalizedType));

                    let components = this.generateComplexOptionByType(metadata, option, optionName, []);
                    nestedComponents = nestedComponents.concat(...components);
                }
            }

            let allEvents = events.concat(changeEvents);
            if (isEditor) {
                allEvents.push({emit: `onBlur`, type: `EventEmitter<any>`});
            }
            let widgetNestedComponents = nestedComponents
                .reduce((result, component) => {
                    if (result.filter(c => c.className === component.className).length === 0) {
                        result.push({
                            path: component.path,
                            propertyName: component.propertyName,
                            className: component.className,
                            events: component.events,
                            isCollection: component.isCollection,
                            hasTemplate: component.hasTemplate,
                            root: properties.filter(p => p.name === component.propertyName).length === 1 ? true : undefined
                        });
                    }

                    return result;
                }, []);

            let widgetMetadata = {
                className: className,
                widgetName: widgetName,
                isTranscludedContent: isTranscludedContent,
                isViz: isViz,
                isExtension: isExtension,
                selector: dasherizedWidgetName,
                events: allEvents,
                properties: properties,
                isEditor: isEditor,
                module: 'devextreme/' + widget.Module,
                isDevExpressRequired: isDevExpressRequired,
                description: widget.Description,
                nestedComponents: widgetNestedComponents
            };

            logger('Write metadata to file ' + outputFilePath);
            this._store.write(outputFilePath, widgetMetadata);

            allNestedComponents = allNestedComponents.concat(...nestedComponents);
        }

        this.generateNestedOptions(config, allNestedComponents);
    }

    private createEvent(name, type) {
        return {
            emit: `${name}Change`,
            type: `EventEmitter<${type}>`,
            description: `This member supports the internal infrastructure and is not intended to be used directly from your code.`
        };
    }

    private getTypesDescription(optionMetadata) {
        let typeParts = this.getTypeParts(optionMetadata);

        return {
            primitiveTypes: typeParts.primitiveTypes,
            arrayTypes: typeParts.arrayTypes,
            isDevExpressRequired: this.detectComplexTypes(typeParts.primitiveTypes) || this.detectComplexTypes(typeParts.arrayTypes)
        };
    }

    private getTypeParts(optionMetadata) {
        let primitiveTypes = optionMetadata.PrimitiveTypes ? optionMetadata.PrimitiveTypes.slice(0) : [];
        let arrayTypes = [];

        if (optionMetadata.ItemPrimitiveTypes) {
            if (optionMetadata.IsPromise) {
                let promiseType = optionMetadata.ItemPrimitiveTypes.join(TYPES_SEPORATOR);
                primitiveTypes.push(`Promise<${promiseType}> & JQueryPromise<${promiseType}>`);
            } else {
                arrayTypes = arrayTypes.concat(optionMetadata.ItemPrimitiveTypes);
            }
        }

        if (optionMetadata.Options) {
            let optionType = this.getObjectType(optionMetadata.Options);

            if (optionType.length) {
                (optionMetadata.IsCollection ? arrayTypes : primitiveTypes).push(optionType);
            }
        }

        return({ primitiveTypes, arrayTypes });
    }

    private getObjectType(optionMetadata) {
        let objectType = [];

        for (let option in optionMetadata) {
            let typeParts = this.getTypeParts(optionMetadata[option]);
            let type = this.getType(typeParts);

            objectType.push(option + '?: ' + type);
        }

        if (objectType.length) {
            return '{ ' + objectType.join(', ') + ' }';
        }
        return '';
    }

    private getType(typesDescription) {
        let primitiveTypes = typesDescription.primitiveTypes.slice(0);
        let result = 'any';

        if (typesDescription.arrayTypes.length) {
            primitiveTypes.push(`Array<${typesDescription.arrayTypes.join(TYPES_SEPORATOR)}>`);
        }

        if (primitiveTypes.length) {
            result = primitiveTypes.join(TYPES_SEPORATOR);
        }

        return result;
    }

    private mergeArrayTypes(array1, array2) {
        let newTypes = array2.filter(type => array1.indexOf(type) === -1);
        return [].concat(array1, newTypes);
    }

    private detectComplexTypes(types) {
        return types.some(type =>
            (type.type ? type.type : type)
            .indexOf('.') > -1);
    }

    private getExternalObjectInfo(metadata, typeName) {
        let externalObject = metadata.ExtraObjects[typeName];

        if (!externalObject) {
            const postfix = 'Options';
            if (typeName.endsWith(postfix)) {
                let widgetName = typeName.substr(0, typeName.length - postfix.length);
                externalObject = metadata.Widgets[widgetName];
                typeName = trimPrefix('dx', typeName);
            }
        }

        if (!externalObject) {
            console.warn(`WARN: missed complex type: ${typeName}`);
        } else {
            return {
                Options: externalObject.Options,
                typeName: typeName
            };
        }
    }

    private generateComplexOptionByType(metadata, option, optionName, complexTypes) {
        let optionComplexTypes = option[option.IsCollection ? 'ItemComplexTypes' : 'ComplexTypes'];
        if (option.Options) {
            return this.generateComplexOption(metadata, option.Options, optionName, complexTypes, option);
        } else if (optionComplexTypes && optionComplexTypes.length > 0) {
            if (complexTypes.indexOf(complexTypes[complexTypes.length - 1]) !== complexTypes.length - 1) {
                return;
            }
            let result = [];
            optionComplexTypes.forEach(complexType => {
                let externalObjectInfo = this.getExternalObjectInfo(metadata, complexType);
                if (externalObjectInfo) {
                    let nestedOptions = externalObjectInfo.Options,
                        nestedComplexTypes = complexTypes.concat(externalObjectInfo.typeName);

                    result.push.apply(result, this.generateComplexOption(metadata, nestedOptions, optionName, nestedComplexTypes, option));
                }
            });
            if (optionComplexTypes.length === 1) {
                let externalObjectInfo = this.getExternalObjectInfo(metadata, optionComplexTypes[0]);
                if (externalObjectInfo) {
                    result[0].baseClass =
                        (option.IsCollection ? ITEM_COMPONENT_PREFIX : OPTION_COMPONENT_PREFIX) + externalObjectInfo.typeName;
                    result[0].basePath = inflector.dasherize(inflector.underscore(externalObjectInfo.typeName));
                }
            }
            return result;
        }
    }

    private generateComplexOption(metadata, nestedOptions, optionName, complexTypes, option) {
        if (!nestedOptions || !Object.keys(nestedOptions).length) {
            return;
        }

        let pluralName = optionName;
        if (option.IsCollection) {
            pluralName = option.SingularName + 'Dxi';
        }

        let singularName = option.SingularName || pluralName,
            underscoreSingular = inflector.underscore(singularName).split('.').join('_'),
            underscorePlural = inflector.underscore(pluralName).split('.').join('_'),
            prefix = (option.IsCollection ? ITEM_COMPONENT_PREFIX : OPTION_COMPONENT_PREFIX).toLocaleLowerCase() + '_',
            underscoreSelector = prefix + (option.IsCollection ? underscoreSingular : underscorePlural),
            selector = inflector.dasherize(underscoreSelector),
            path = inflector.dasherize(underscorePlural);

        let complexOptionMetadata: any = {
            className: inflector.camelize(underscoreSelector),
            selector: selector,
            optionName: optionName,
            properties: [],
            events: [],
            path: path,
            propertyName: optionName,
            isCollection: option.IsCollection,
            hasTemplate: option.Options && option.Options.template && option.Options.template.IsTemplate,
            collectionNestedComponents: []
        };

        let nestedComponents = [complexOptionMetadata];
        let isDevExpressRequired = false;

        for (let optName in nestedOptions) {
            let optionMetadata = nestedOptions[optName];
            let typesDescription = this.getTypesDescription(optionMetadata);
            let propertyType = this.getType(typesDescription);

            isDevExpressRequired = isDevExpressRequired || typesDescription.isDevExpressRequired;

            let property: any = {
                name: optName,
                type: propertyType,
                typesDescription: typesDescription
            };

            if (optionMetadata.IsCollection) {
                property.isCollection = true;
            }

            complexOptionMetadata.properties.push(property);

            if (optionMetadata.IsChangeable || optionMetadata.IsReadonly) {
                complexOptionMetadata.events.push(this.createEvent(optName, propertyType));
            }

            complexOptionMetadata.isDevExpressRequired = isDevExpressRequired;

            let components = this.generateComplexOptionByType(metadata, nestedOptions[optName], optName, complexTypes) || [];

            nestedComponents = nestedComponents.concat(...components);

            let ownCollectionNestedComponents = components
                .filter(c => {
                    return complexOptionMetadata
                        .properties
                        .filter(p => p.name === c.propertyName && p.isCollection).length === 1;
                })
                .map(c => {
                    return {
                        className: c.className,
                        path: c.path,
                        propertyName: c.propertyName
                    };
                });

            complexOptionMetadata.collectionNestedComponents.push
                .apply(complexOptionMetadata.collectionNestedComponents, ownCollectionNestedComponents);
        }

        return nestedComponents;
    }

    private getBaseComponentPath(component) {
        return component.basePath + (component.isCollection ? '-dxi' : '');
    }

    private generateNestedOptions(config, metadata) {
        let normalizedMetadata = metadata
            .reduce((result, component) => {
                let existingComponent = result.filter(c => c.className === component.className)[0];

                if (!existingComponent) {
                    result.push(component);
                } else {
                    existingComponent.properties = existingComponent.properties
                        .concat(...component.properties)
                        .reduce((properties, property) => {
                            if (properties.filter(p => p.name === property.name).length === 0) {
                                properties.push(property);
                            } else {
                                let existingProperty = properties.filter(p => p.name === property.name)[0];
                                let typesDescription = existingProperty.typesDescription;

                                typesDescription.primitiveTypes = this.mergeArrayTypes(
                                    typesDescription.primitiveTypes,
                                    property.typesDescription.primitiveTypes);

                                typesDescription.arrayTypes = this.mergeArrayTypes(
                                    typesDescription.arrayTypes,
                                    property.typesDescription.arrayTypes);

                                existingProperty.type = this.getType(typesDescription);
                            }

                            return properties;
                        }, []);

                    existingComponent.events = existingComponent.events
                        .concat(...component.events)
                        .reduce((events, event) => {
                            if (events.filter(e => e.emit === event.emit).length === 0) {
                                events.push(event);
                            }

                            return events;
                        }, []);

                    existingComponent.baseClass = existingComponent.baseClass || component.baseClass;
                    existingComponent.basePath = existingComponent.basePath || component.basePath;
                    existingComponent.isDevExpressRequired = existingComponent.isDevExpressRequired || component.isDevExpressRequired;
                    existingComponent.collectionNestedComponents.push
                        .apply(existingComponent.collectionNestedComponents, component.collectionNestedComponents);
                }

                return result;
            }, []);

        normalizedMetadata.forEach(component => {
            component.collectionNestedComponents = component.collectionNestedComponents.reduce((result, nestedComponent) => {
                if (result.filter(c => nestedComponent.className === c.className).length === 0) {
                    result.push(nestedComponent);
                }
                return result;
            }, []);
        });

        normalizedMetadata
            .reduce((result, component) => {
                let existingComponent = result.filter(c => c.className === component.baseClass)[0];
                if (!existingComponent && component.baseClass) {
                    result.push({
                        properties: component.properties,
                        events: component.events,
                        className: component.baseClass,
                        path: this.getBaseComponentPath(component),
                        baseClass: component.isCollection ? 'CollectionNestedOption' : 'NestedOption',
                        basePath: 'devextreme-angular/core',
                        isDevExpressRequired: component.isDevExpressRequired
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
            .map((component) => {
                if (component.events && !component.events.length) {
                    delete component.events;
                }
                if (component.baseClass) {
                    component.inputs = component.properties;
                    delete component.properties;
                    component.isDevExpressRequired = component.events ?
                        this.detectComplexTypes(component.events) :
                        false;
                    component.basePath = `./base/${this.getBaseComponentPath(component)}`;
                } else {
                    component.baseClass = component.isCollection ? 'CollectionNestedOption' : 'NestedOption';
                    component.basePath = 'devextreme-angular/core';
                    component.hasSimpleBaseClass = true;
                }

                return component;
            })
            .forEach(componet => {
                let outputFilePath = path.join(config.outputFolderPath, config.nestedPathPart, componet.path + '.json');
                this._store.write(outputFilePath, componet);
            });
    }
}
