/// <reference path="../../typings/main/ambient/node/index.d.ts" />

import fs = require('fs');
import path = require('path');

export default class FacadeGenerator {
    private _encoding = 'utf8';
    generate(config) {
        Object.keys(config.facades).forEach(facadeFilePath => {
            console.log('Generate facade: ' + facadeFilePath);
            let facadeConfig = config.facades[facadeFilePath],
                resultContent = '';

            facadeConfig.sourceDirectories.forEach(directoryPath => {
                console.log('List directory: ' + directoryPath);
                let files = fs.readdirSync(directoryPath);
                files.forEach(fileName => {
                    let filePath = path.join(directoryPath, fileName),
                        relativePath = path.relative(path.dirname(facadeFilePath), filePath),
                        parsedPath = path.parse(relativePath),
                        modulePath = path.join(parsedPath.dir, parsedPath.name);

                    resultContent += 'export * from \'./' + modulePath.replace(/\\/g, '/') + '\'\n';
                });
            });

            console.log('Write result to ' + facadeFilePath);
            fs.writeFileSync(facadeFilePath, resultContent, { encoding: this._encoding });
        });
    }
}
