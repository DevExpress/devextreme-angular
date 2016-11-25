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
        this.generateTemplate(config.templateFilePath,
            config.metadataFolderPath,
            config.outputFolderPath);

        this.generateTemplate(config.nestedTemplateFilePath,
            path.join(config.metadataFolderPath, config.nestedPathPart),
            path.join(config.outputFolderPath, config.nestedPathPart));

        this.generateTemplate(config.baseNestedTemplateFilePath,
            path.join(config.metadataFolderPath, config.nestedPathPart, config.basePathPart),
            path.join(config.outputFolderPath, config.nestedPathPart, config.basePathPart));
    }

    private generateTemplate(templateFilePath: string, metadataFolderPath: string, outputFolderPath: string) {
        let template = this.createTemplate(templateFilePath);
        mkdirp.sync(outputFolderPath);

        logger('List directory: ' + metadataFolderPath);
        fs.readdirSync(metadataFolderPath)
            .filter(fileName => fs.lstatSync(path.join(metadataFolderPath, fileName)).isFile())
            .forEach(fileName => {
                let filePath = path.join(metadataFolderPath, fileName);

                logger('Read data from ' + filePath);
                let data = fs.readFileSync(filePath, this._encoding);
                logger('Apply template');
                let result = template(JSON.parse(data));
                let resultFileName = path.parse(filePath).name + '.ts';
                let resultFilePath = path.join(outputFolderPath, resultFileName);
                logger('Write result to ' + resultFilePath);
                fs.writeFileSync(resultFilePath, result, { encoding: this._encoding });
            });
    }
}
