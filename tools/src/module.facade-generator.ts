/// <reference path="../../typings/globals/node/index.d.ts" />

import fs = require('fs');
let inflector = require('inflector-js');
import logger from './logger';

export default class FacadeGenerator {
    private _encoding = 'utf8';

    prepareModuleName(fileName: string) {
        fileName = fileName.replace(/-/g, '_');
        fileName = inflector.classify(fileName);
        fileName = 'Dx' + fileName + 'Module';

        return fileName;
    }

    generate(config) {
        Object.keys(config.moduleFacades).forEach(moduleFilePath => {
            logger('Generate facade: ' + moduleFilePath);
            let facadeConfig = config.moduleFacades[moduleFilePath],
                moduleNamesString = '',
                importModuleString = '';

            facadeConfig.sourceComponentDirectories.forEach(directoryPath => {
                logger('List directory: ' + directoryPath);
                let files = fs.readdirSync(directoryPath);

                files.forEach(fileName => {
                    fileName = fileName.substring(0, fileName.length - 3);
                    let moduleName = this.prepareModuleName(fileName);

                    moduleNamesString += '\n    ' + moduleName + ',';
                    importModuleString += `import { ` + moduleName + ` } from './` + fileName + `';\n`;
                });
            });

            Object.keys(facadeConfig.additionalImports).forEach(importName => {
                moduleNamesString += '\n    ' + importName + ',';
                importModuleString += facadeConfig.additionalImports[importName] + ';\n';
            });

            moduleNamesString = moduleNamesString.slice(0, -1);
            importModuleString = importModuleString.slice(0, -1);

            let resultContent = `import { NgModule } from '@angular/core';
` + importModuleString + `

@NgModule({
    imports: [` + moduleNamesString + `\n    ],
    exports: [` + moduleNamesString + `\n    ]
})
export class DevExtremeModule {}
`;

            logger('Write result to ' + moduleFilePath);
            fs.writeFileSync(moduleFilePath, resultContent, { encoding: this._encoding });
        });
    }
}
