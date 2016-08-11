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
    private _encoding = "utf8";
    read(filePath) {
        console.log("Read from file: " + filePath);
        var dataString = fs.readFileSync(filePath, this._encoding);
        console.log("Parse data");
        return JSON.parse(dataString);
    }
    write(filePath, data) {
        console.log("Write data to file " + filePath);
        var dataString = JSON.stringify(data, null, 4);
        fs.writeFileSync(filePath, dataString, { encoding: this._encoding });
    }
}

export default class DXComponentMetadataGenerator {
    constructor(private _store?: IObjectStore) {
        if(!this._store) {
            this._store = new FSObjectStore();
        }
    }
    generate(config) {
        var that = this,
            inflector = require('inflector-js'),
            metadata = this._store.read(config.sourceMetadataFilePath),
            widgetsMetadata = metadata["Widgets"];

        mkdirp.sync(config.outputFolderPath);

        for(var widgetName in widgetsMetadata) {
            console.log("Generate metadata for " + widgetName);

            var widget = widgetsMetadata[widgetName],
                dasherizedWidgetName = inflector.dasherize(inflector.underscore(widgetName)),
                outputFilePath = path.join(config.outputFolderPath, dasherizedWidgetName.substr("dx-".length) + ".json"),
                events = [],
                changeEvents = [],
                properties = [],
                isEditor = false;

            for(var optionName in widget.Options) {
                var option = widget.Options[optionName];

                if(option.IsEvent) {
                    var eventName = inflector.camelize(optionName.substr("on".length), true);

                    events.push({
                        emit: optionName,
                        subscribe: eventName
                    });
                }
                else {
                    var property = {
                        name: optionName,
                        type: "any"
                    };

                    if(option.PrimitiveTypes) {
                        // TODO specify primitive types
                        // property.type = primitiveType;
                    }
                    properties.push(property);

                    changeEvents.push({
                        emit: optionName + "Change"
                    });

                    if(optionName === "value") {
                        isEditor = true;
                    }
                }
            }

            var allEvents = events.concat(changeEvents);

            var widgetMetadata = {
                className: inflector.classify(widgetName),
                widgetName: widgetName,
                selector: dasherizedWidgetName,
                events: allEvents,
                properties: properties,
                isEditor: isEditor
            };

            console.log("Write metadata to file " + outputFilePath);
            this._store.write(outputFilePath, widgetMetadata);
        }
    }
}
