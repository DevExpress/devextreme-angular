/// <reference path="../../typings/globals/node/index.d.ts" />
/// <reference path="../../typings/globals/dot/index.d.ts" />
/// <reference path="../../typings/modules/mkdirp/index.d.ts" />

import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import logger from './logger';
let doT = require('dot');

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

export default class DoTGenerator {
    private _encoding = 'utf8';
    createTemplate(templateFilePath: string) {
        logger('Create doT template from ' + templateFilePath);
        let templateString = fs.readFileSync(templateFilePath, this._encoding);
        return doT.template(templateString);
    }
    generate(config) {
        let template = this.createTemplate(config.templateFilePath),
            files;

        mkdirp.sync(config.outputFolderPath);

        logger('List directory: ' + config.metadataFolderPath);
        files = fs.readdirSync(config.metadataFolderPath);
        files.forEach(fileName => {
            let filePath = path.join(config.metadataFolderPath, fileName);
            logger('Read data from ' + filePath);
            let data = fs.readFileSync(filePath, this._encoding);
            logger('Apply template');
            let result = template(JSON.parse(data));
            let resultFileName = path.parse(filePath).name + '.ts';
            let resultFilePath = path.join(config.outputFolderPath, resultFileName);
            logger('Write result to ' + resultFilePath);
            fs.writeFileSync(resultFilePath, result, { encoding: this._encoding });
        });
    }
}
