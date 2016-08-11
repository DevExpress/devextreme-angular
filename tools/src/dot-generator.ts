/// <reference path="../../typings/main/ambient/node/index.d.ts" />
/// <reference path="../../typings/main/ambient/dot/index.d.ts" />
/// <reference path="../../typings/main/definitions/mkdirp/index.d.ts" />

import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
var doT = require('dot');

doT.templateSettings = {
  evaluate:    /\<#([\s\S]+?)#\>/g,
  interpolate: /\<#=([\s\S]+?)#\>/g,
  encode:      /\<#!([\s\S]+?)#\>/g,
  use:         /\<##([\s\S]+?)#\>/g,
  define:      /\<###\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)##\>/g,
  conditional: /\<#\?(\?)?\s*([\s\S]*?)\s*#\>/g,
  iterate:     /\<#~\s*(?:#\>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*#\>)/g,
  varname: 'it',
  strip: false,
  append: true,
  selfcontained: false
};

export default class doTGenerator {
    private _encoding = 'utf8';
    createTemplate(templateFilePath: string) {
        console.log('Create doT template from ' + templateFilePath);
        var templateString = fs.readFileSync(templateFilePath, this._encoding);
        return doT.template(templateString);
    }
    generate(config) {
        var that = this,
            template = this.createTemplate(config.templateFilePath),
            files;

        mkdirp.sync(config.outputFolderPath);

        console.log('List directory: ' + config.metadataFolderPath);
        files = fs.readdirSync(config.metadataFolderPath);
        files.forEach(fileName => {
            var filePath = path.join(config.metadataFolderPath, fileName);
            console.log('Read data from ' + filePath);
            var data = fs.readFileSync(filePath, this._encoding);
            console.log('Apply template');
            var result = template(JSON.parse(data));
            var resultFileName = path.parse(filePath).name + '.ts';
            var resultFilePath = path.join(config.outputFolderPath, resultFileName);
            console.log('Write result to ' + resultFilePath);
            fs.writeFileSync(resultFilePath, result, { encoding: this._encoding });
        });
    }
}
