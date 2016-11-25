import fs = require('fs');
import path = require('path');
import logger from './logger';

export default class FacadeGenerator {
    private _encoding = 'utf8';
    generate(config) {
        Object.keys(config.facades).forEach(facadeFilePath => {
            logger('Generate facade: ' + facadeFilePath);
            let facadeConfig = config.facades[facadeFilePath],
                resultContent = '';

            facadeConfig.sourceDirectories.forEach(directoryPath => {
                logger('List directory: ' + directoryPath);
                let files = fs.readdirSync(directoryPath);
                files
                    .filter(fileName => fs.lstatSync(path.join(directoryPath, fileName)).isFile())
                    .forEach(fileName => {
                        let filePath = path.join(directoryPath, fileName),
                            relativePath = path.relative(path.dirname(facadeFilePath), filePath),
                            parsedPath = path.parse(relativePath),
                            modulePath = path.join(parsedPath.dir, parsedPath.name);

                        resultContent += 'export * from \'./' + modulePath.replace(/\\/g, '/') + '\'\n';
                    });
            });

            logger('Write result to ' + facadeFilePath);
            fs.writeFileSync(facadeFilePath, resultContent, { encoding: this._encoding });
        });
    }
}
