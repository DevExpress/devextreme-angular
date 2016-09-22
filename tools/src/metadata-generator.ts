/// <reference path="../../typings/main/ambient/node/index.d.ts" />
/// <reference path="../../typings/main/definitions/mkdirp/index.d.ts" />

import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');

export interface IObjectStore {
    read(name: string): Object;
    write(name: string, data: Object): void;
}

export class FSObjectStore implements IObjectStore {
    private _encoding = 'utf8';
    read(filePath) {
        console.log('Read from file: ' + filePath);
        let dataString = fs.readFileSync(filePath, this._encoding);
        console.log('Parse data');
        return JSON.parse(dataString);
    }
    write(filePath, data) {
        console.log('Write data to file ' + filePath);
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
        let inflector = require('inflector-js'),
            metadata = this._store.read(config.sourceMetadataFilePath),
            widgetsMetadata = metadata['Widgets'],
            addMetadata = this._store.read(config.additionalMetadataFilePath),
            widgetsAddMetadata = addMetadata['Widgets'];

        mkdirp.sync(config.outputFolderPath);

        for (let widgetName in widgetsMetadata) {
            console.log('Generate metadata for ' + widgetName);

            let widget = widgetsMetadata[widgetName],
                dasherizedWidgetName = inflector.dasherize(inflector.underscore(widgetName)),
                additionalData = widgetsAddMetadata[widgetName] || {},
                template = additionalData['template'],
                outputFilePath = path.join(config.outputFolderPath, dasherizedWidgetName.substr('dx-'.length) + '.json'),
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
                    let property = {
                        name: optionName,
                        type: 'any'
                    };

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
                }
            }

            let allEvents = events.concat(changeEvents);

            let widgetMetadata = {
                className: inflector.classify(widgetName),
                widgetName: widgetName,
                selector: dasherizedWidgetName,
                template: template,
                events: allEvents,
                properties: properties,
                isEditor: isEditor
            };

            console.log('Write metadata to file ' + outputFilePath);
            this._store.write(outputFilePath, widgetMetadata);
        }
    }
}
