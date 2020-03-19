module.exports = {
    tools: {
        srcFilesPattern: ['tools/src/**/*.ts'],
        distPath: 'tools/dist',
        metadataGenerator: {
            importFrom: './tools/dist/metadata-generator',
            sourceMetadataFilePath: './metadata/NGMetaData.json',
            deprecatedMetadataFilePath: './metadata/DeprecatedComponentsMetadata.json',
            outputFolderPath: './metadata/generated',
            nestedPathPart: 'nested',
            basePathPart: 'base'
        },
        componentGenerator: {
            importFrom: './tools/dist/dot-generator',
            templateFilePath: './templates/component.tst',
            nestedTemplateFilePath: './templates/nested-component.tst',
            baseNestedTemplateFilePath: './templates/base-nested-component.tst',
            metadataFolderPath: './metadata/generated/',
            outputFolderPath: './src/ui/',
            nestedPathPart: 'nested',
            basePathPart: 'base'
        },
        facadeGenerator: {
            importFrom: './tools/dist/facade-generator',
            facades: {
                './src/index.ts': {
                    sourceDirectories: [
                        './metadata/generated'
                    ]
                }
            }
        },
        moduleFacadeGenerator: {
            importFrom: './tools/dist/module.facade-generator',
            moduleFacades: {
                './src/ui/all.ts': {
                    sourceComponentDirectories: [
                        './src/ui'
                    ],
                    additionalImports: {
                        'DxTemplateModule': 'import { DxTemplateModule } from \'devextreme-angular/core\''
                    }
                }
            }
        },
        componentNamesGenerator: {
            importFrom: './tools/dist/component-names-generator',
            componentFilesPath: './src/ui/',
            excludedFileNames: [ 'nested', 'validation-group', 'validation-summary', 'validator' ],
            outputFileName: 'tests/src/server/component-names.ts'
        },
        tsConfigPath: "tsconfig.json",
        tests: {
            srcFilesPattern: 'tools/spec/tests/*.spec.js'
        }
    },
    components: {
        srcFilesPattern: '**/*.ts',
        tsTestSrc: ['tests/src/**/*.spec.ts', 'tests/src/**/component-names.ts'],
        testsPath: 'tests/dist',
        sourcesGlobs: ['src/**/*.*', './package.json'],
        tsSourcesGlob: 'src/**/*.ts',
        outputPath: 'dist'
    },
    examples: {	
      srcFilesPattern: ['examples/**/*.ts']
    },
    tests: {
        tsConfigPath: "tsconfig.json"
    },
    npm: {
        distPath: "npm/dist",
        sourcesTargetFolder: "ts",
        content: [ "LICENSE", "README.md" ]
    }
};
