var bundleName = "devextreme-angular";

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
                        './src/core',
                        './src/ui'
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
                        'DxTemplateModule': 'import { DxTemplateModule } from \'../core/template\''
                    }
                }
            }
        },
        componentNamesGenerator: {
            importFrom: './tools/dist/component-names-generator',
            componentFilesPath: './src/ui/',
            excludedFileNames: [ 'all.ts', 'validation-group.ts', 'validation-summary.ts', 'validator.ts' ],
            outputFileName: 'tests/src/server/component-names.ts'
        },
        tsConfigPath: "tools/src/tsconfig.json",
        tests: {
            srcFilesPattern: 'tools/spec/tests/*.spec.js'
        }
    },
    components: {
        srcFilesPattern: '**/*.ts',
        tsTestSrc: ['tests/src/**/*.spec.ts', 'tests/src/**/component-names.ts'],
        testsPath: 'tests/dist',
        sourcePath: 'src',
        outputPath: 'dist',
        bundleName: bundleName
    },
    examples: {
        srcFilesPattern: ['examples/**/*.ts', '!examples/**/*.d.ts'],
        path: 'examples',
        appPath: 'examples/app',
        tsc: {
            "target": "ES5",
            "module": "system",
            "moduleResolution": "node",
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "sourceMap": true,
            "removeComments": true,
            "declaration": true,
            "lib": ["es2015", "dom"]
        }
    },
    tests: {
        tsConfigPath: "tests/src/tsconfig.json"
    },
    npm: {
        distPath: "npm/dist",
        sourcesTargetFolder: "ts",
        content: [ "LICENSE", "README.md" ],
        package: [ "package.json", "npm/package.json" ]
    }
};