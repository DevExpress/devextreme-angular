"use strict";
describe("metadata-generator", function() {
    var extend = require('util')._extend;
    var path = require('path');
    var Generator = require('../../dist/metadata-generator').default;

    var testConfig = {
        sourceMetadataFilePath: "source-path",
        outputFolderPath: "output-path",
        nestedPathPart: 'nested',
        basePathPart: 'base'
    };

    var store,
        generator,
        metas;

    var setupContext = function(metadata) {
        store = {
            read: jasmine.createSpy().and.returnValue(metadata),
            write: jasmine.createSpy()
        };
        generator = new Generator(store);
        generator.generate(testConfig);
        metas = {};
        store.write.calls.allArgs().forEach(function(args) {
            var metaData = args[1];
            metas[metaData.className] = metaData;
        })
    };

    describe("simple components", function() {

        beforeEach(function() {
            setupContext({
                Widgets: {
                    dxTestWidget: {
                        Options: {
                            onTestEvent: {
                                IsEvent: true,
                            },
                            testTemplate: {
                                IsTemplate: true,
                            },
                            testProperty: { }
                        },
                        Module: 'test_widget'
                    },
                    dxEditorWidget: {
                        Options: {
                            value: {}
                        },
                        Module: 'test_widget'
                    },
                    dxCollectionWidget: {
                        Options: {
                            collectionProperty: {
                                IsCollection: true
                            },
                            dataSourceProperty: {
                                IsDataSource: true
                            }
                        },
                        Module: 'test_widget'
                    },
                    dxExtensionWidget: {
                        IsExtensionComponent: true,
                        Options: {},
                        Module: 'test_widget'
                    }
                }
            });
        });

        it("should read data using the path specified in config", function() {
            expect(store.read).toHaveBeenCalledWith(testConfig.sourceMetadataFilePath);
        });

        it("should write generated data to a separate file for each widget", function() {
            expect(store.write.calls.count()).toBe(4);

            expect(store.write.calls.argsFor(0)[0]).toBe(path.join("output-path", "test-widget.json"));
            expect(store.write.calls.argsFor(1)[0]).toBe(path.join("output-path", "editor-widget.json"));
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(4);

            expect(metas.DxTestWidget).not.toBe(undefined);
            expect(metas.DxCollectionWidget).not.toBe(undefined);
            expect(metas.DxEditorWidget).not.toBe(undefined);
            expect(metas.DxExtensionWidget).not.toBe(undefined);
        });

        it("should generate proper component class name", function() {
            expect(metas.DxTestWidget.className).toBe("DxTestWidget");
        });

        it("should generate proper component selector", function() {
            expect(metas.DxTestWidget.selector).toBe("dx-test-widget");
        });

        it("should generate proper widget name", function() {
            expect(metas.DxTestWidget.widgetName).toBe("dxTestWidget");
        });

        it("should generate proper events", function() {
            expect(metas.DxTestWidget.events).toEqual([
                { emit: 'onTestEvent', subscribe: 'testEvent' },
                { emit: 'testTemplateChange' },
                { emit: 'testPropertyChange' }
            ]);
        });

        it("should generate proper properties", function() {
            expect(metas.DxTestWidget.properties).toEqual([
                { name: 'testTemplate', type: 'any' },
                { name: 'testProperty', type: 'any' }
            ]);
        });

        it("should generate proper collection properties", function() {
            expect(metas.DxCollectionWidget.properties).toEqual([
                { name: 'collectionProperty', type: 'any', isCollection: true },
                { name: 'dataSourceProperty', type: 'any', isCollection: true }
            ]);
        });

        it("should generate proper module name", function() {
            expect(metas.DxTestWidget.module).toBe("devextreme/test_widget");
        });

        it("should detect editors", function() {
            expect(metas.DxTestWidget.isEditor).toBe(false);
            expect(metas.DxEditorWidget.isEditor).toBe(true);
        });

        it("should detect extensions", function() {
            expect(metas.DxTestWidget.isExtension).toBe(false);
            expect(metas.DxExtensionWidget.isExtension).toBe(true);
        });

    });

    describe("complex widgets", function() {

        beforeEach(function() {
            setupContext({
                Widgets: {
                    dxComplexWidget: {
                        Options: {
                            property: { // DxoProperty
                                Options: {
                                    nested: { // DxoNested
                                        Options: {
                                            deep: {}
                                        }
                                    },
                                    nestedItems: { // DxiNestedItem
                                        Options: {
                                            deep: {}
                                        },
                                        IsCollection: true,
                                        SingularName: "nestedItem"
                                    }
                                }
                            },
                            collectionItem: { // DxoItem
                                Options: {
                                    nested: {}
                                }
                            },
                            collectionItems: { // DxiItem
                                Options: {
                                    nested: {}
                                },
                                IsCollection: true,
                                SingularName: "collectionItem"
                            },
                            collectionItemsWithTemplate: { // DxiCollectionItemWithTemplate
                                Options: {
                                    template: {
                                        IsTemplate: true
                                    }
                                },
                                IsCollection: true,
                                SingularName: "collectionItemWithTemplate"
                            }                            
                            
                        },
                        Module: 'test_widget'
                    },
                    dxAnotherComplexWidget: {
                        Options: {
                            property: { // DxoProperty
                                Options: {
                                    anotherNested: {}
                                }
                            },
                            externalProperty: { // DxoExternalProperty
                                ComplexTypes: [
                                    'ExternalPropertyType'
                                ]
                            }
                        },
                        Module: 'test_widget'
                    }
                },
                ExtraObjects: {
                    ExternalPropertyType: { // DxoExternalPropertyType
                        Options: {
                            nestedExternalProperty: { // DxoNestedExternalProperty
                                ComplexTypes: [
                                    'ExternalPropertyType'
                                ]
                            }
                        }
                    }
                }
            });
        });

        it("should write generated data to a separate file for each widget", function() {
            expect(store.write.calls.count()).toBe(11);

            let writeToPathCount = (path) => {
                return store.write.calls
                    .allArgs()
                    .filter(args => args[0] === path).length;
            };

            expect(writeToPathCount(path.join("output-path", "nested", "nested-external-property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "base", "external-property-type.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "nested.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "nested-item-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "collection-item.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "collection-item-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "external-property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "collection-item-with-template-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "nested-external-property.json"))).toBe(1);
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(11);

            expect(metas.DxComplexWidget).not.toBe(undefined);
            expect(metas.DxAnotherComplexWidget).not.toBe(undefined);
            expect(metas.DxoProperty).not.toBe(undefined);
            expect(metas.DxoNested).not.toBe(undefined);
            expect(metas.DxiNestedItem).not.toBe(undefined);
            expect(metas.DxoExternalProperty).not.toBe(undefined);
            expect(metas.DxoNestedExternalProperty).not.toBe(undefined);
            expect(metas.DxoExternalPropertyType).not.toBe(undefined);
            expect(metas.DxiCollectionItem).not.toBe(undefined);
            expect(metas.DxoCollectionItem).not.toBe(undefined);
            expect(metas.DxiCollectionItemWithTemplate).not.toBe(undefined);
        });

        it("should generate nested components with merged properties", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');

            expect(metas.DxoProperty.properties.map(p => p.name)).toEqual(['nested', 'nestedItems', 'anotherNested']);
            expect(metas.DxoProperty.optionName).toBe('property');
        });

        it("should generate deep nested components", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoNested');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).not.toContain('DxoNested');

            expect(metas.DxoNested.properties.map(p => p.name)).toEqual(['deep']);
            expect(metas.DxoNested.optionName).toBe('nested');
            expect(metas.DxoNested.baseClass).toBe('NestedOption');
            expect(metas.DxoNested.hasSimpleBaseClass).toBe(true);
        });

        it("should generate deep collection nested components", function() {
            expect(metas.DxoProperty.collectionNestedComponents.length).toBe(1);
            
            let nestedItem = metas.DxoProperty.collectionNestedComponents.filter(c => c.className === 'DxiNestedItem')[0];
            expect(nestedItem.className).toBe('DxiNestedItem');
            expect(nestedItem.path).toBe('nested-item-dxi');
            expect(nestedItem.propertyName).toBe('nestedItems');
        });

        it("should generate external nested components", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).not.toContain('DxoExternalProperty');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoExternalProperty');

            expect(metas.DxoExternalProperty.properties).toBe(undefined);
            expect(metas.DxoExternalProperty.baseClass).toBe('DxoExternalPropertyType');
            expect(metas.DxoExternalProperty.hasSimpleBaseClass).toBe(undefined);
            expect(metas.DxoExternalProperty.optionName).toBe('externalProperty');
        });

        it("should generate recurcive external nested components", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).not.toContain('DxoNestedExternalProperty');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoNestedExternalProperty');

            expect(metas.DxoNestedExternalProperty.properties).toBe(undefined);
            expect(metas.DxoNestedExternalProperty.baseClass).toBe('DxoExternalPropertyType');
            expect(metas.DxoNestedExternalProperty.hasSimpleBaseClass).toBe(undefined);
            expect(metas.DxoNestedExternalProperty.optionName).toBe('nestedExternalProperty');
        });

        it("should generate collection nested components", function() {
            let collectionItem = metas.DxiCollectionItem;
            expect(collectionItem).not.toBe(undefined);
            expect(collectionItem.path).toBe('collection-item-dxi');
            expect(collectionItem.propertyName).toBe('collectionItems');
            expect(collectionItem.isCollection).toBe(true);
            expect(collectionItem.hasTemplate).toBe(undefined);
        });

        it("should set the 'root' property for nested components", function() {
            let rootNestedComponent = metas.DxComplexWidget.nestedComponents.filter(c => c.className === 'DxoProperty')[0];
            expect(rootNestedComponent.root).toBe(true);
            let nestedComponent = metas.DxComplexWidget.nestedComponents.filter(c => c.className === 'DxoNested')[0];
            expect(nestedComponent.root).toBe(undefined);
        });

        it("should generate collection nested components with templates", function() {
            let collectionItemWithTemplate = metas.DxComplexWidget.nestedComponents.filter(c => c.className === 'DxiCollectionItemWithTemplate')[0];
            expect(collectionItemWithTemplate).not.toBe(undefined);
            expect(collectionItemWithTemplate.hasTemplate).toBe(true);
        });

    });

});
