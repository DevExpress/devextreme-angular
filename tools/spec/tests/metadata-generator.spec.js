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
                            testProperty: {
                                PrimitiveTypes: [
                                    "boolean"
                                ]
                            },
                            multitypeTestProperty: {
                                PrimitiveTypes: [
                                    "string",
                                    "number"
                                ]
                            }
                        },
                        Module: 'test_widget'
                    },
                    dxEditorWidget: {
                        Options: {
                            onValueChanged: {}
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
                    },
                    dxVizWidget: {
                        Options: {
                            value: {}
                        },
                        Module: 'viz/test_widget'
                    }
                }
            });
        });

        it("should read data using the path specified in config", function() {
            expect(store.read).toHaveBeenCalledWith(testConfig.sourceMetadataFilePath);
        });

        it("should write generated data to a separate file for each widget", function() {
            expect(store.write.calls.count()).toBe(5);

            expect(store.write.calls.argsFor(0)[0]).toBe(path.join("output-path", "test-widget.json"));
            expect(store.write.calls.argsFor(1)[0]).toBe(path.join("output-path", "editor-widget.json"));
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(5);

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
                { emit: 'testPropertyChange' },
                { emit: 'multitypeTestPropertyChange' }
            ]);
        });

        it("should generate proper properties", function() {
            expect(metas.DxTestWidget.properties).toEqual([
                { name: 'testTemplate', type: 'any' },
                { name: 'testProperty', type: 'boolean' },
                { name: 'multitypeTestProperty', type: 'string|number' }
            ]);
        });

        it("should generate proper collection properties", function() {
            expect(metas.DxCollectionWidget.properties).toEqual([
                { name: 'collectionProperty', type: 'any', isCollection: true },
                { name: 'dataSourceProperty', type: 'any', isCollection: true }
            ]);
        });

        it("should generate proper viz property", function() {
            expect(metas.DxTestWidget.isViz).toBe(false);
            expect(metas.DxVizWidget.isViz).toBe(true);
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
                            },
                            externalPropertyItems: { // DxiExternalPropertyItem
                                IsCollection: true,
                                SingularName: 'externalPropertyItem',
                                ItemComplexTypes: [
                                    'ExternalPropertyType'
                                ]
                            },
                            widgetReference: {
                                ComplexTypes: [
                                    'dxAnotherComplexWidgetOptions'
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
            expect(store.write.calls.count()).toBe(15);

            let writeToPathCount = (path) => {
                return store.write.calls
                    .allArgs()
                    .filter(args => args[0] === path).length;
            };

            expect(writeToPathCount(path.join("output-path", "complex-widget.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "another-complex-widget.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "base", "external-property-type.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "base", "external-property-type-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "base", "another-complex-widget-options.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "nested.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "nested-item-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "nested-external-property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "collection-item.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "collection-item-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "collection-item-with-template-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "widget-reference.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "external-property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "external-property-item-dxi.json"))).toBe(1);
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(15);

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
            expect(metas.DxoWidgetReference).not.toBe(undefined);
            expect(metas.DxoAnotherComplexWidgetOptions).not.toBe(undefined);
            expect(metas.DxiExternalPropertyType).not.toBe(undefined);
            expect(metas.DxiExternalPropertyItem).not.toBe(undefined);
        });

        it("should generate nested components with merged properties", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');

            expect(metas.DxoProperty.properties.map(p => p.name)).toEqual(['nested', 'nestedItems', 'anotherNested']);
            expect(metas.DxoProperty.optionName).toBe('property');
        });

        it("should generate proper properties of base components", function() {
            expect(metas.DxoExternalPropertyType.properties.map(p => p.name)).toEqual(['nestedExternalProperty']);
            expect(metas.DxoExternalPropertyType.className).toBe('DxoExternalPropertyType');
            expect(metas.DxoExternalPropertyType.path).toBe('external-property-type');
            expect(metas.DxoExternalPropertyType.baseClass).toBe('NestedOption');
            expect(metas.DxoExternalPropertyType.basePath).toBe('../../../core/nested-option');
        });

        it("should generate proper properties of base collection components", function() {
            expect(metas.DxiExternalPropertyType.properties.map(p => p.name)).toEqual(['nestedExternalProperty']);
            expect(metas.DxiExternalPropertyType.className).toBe('DxiExternalPropertyType');
            expect(metas.DxiExternalPropertyType.path).toBe('external-property-type-dxi');
            expect(metas.DxiExternalPropertyType.baseClass).toBe('CollectionNestedOption');
            expect(metas.DxiExternalPropertyType.basePath).toBe('../../../core/nested-option');
        });

        it("should generate proper properties of collection nested components with base class", function() {
            expect(metas.DxiExternalPropertyItem.className).toBe('DxiExternalPropertyItem');
            expect(metas.DxiExternalPropertyItem.path).toBe('external-property-item-dxi');
            expect(metas.DxiExternalPropertyItem.baseClass).toBe('DxiExternalPropertyType');
            expect(metas.DxiExternalPropertyItem.basePath).toBe('./base/external-property-type-dxi');
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

        it("should generate recursive external nested components", function() {
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

    describe("collection of complex types", function() {

        beforeEach(function() {
            setupContext({
                Widgets: {
                    dxComplexWidget: {
                        Options: {
                            externalProperty: { // DxoExternalProperty
                                ComplexTypes: [
                                    'ExternalPropertyType',
                                    'ExternalPropertyType2'
                                ]
                            },
                            externalPropertyItems: { // DxiExternalPropertyItem
                                IsCollection: true,
                                SingularName: 'externalPropertyItem',
                                ItemComplexTypes: [
                                    'ExternalPropertyType',
                                    'ExternalPropertyType2'
                                ]
                            }
                        },
                        Module: 'test_widget'
                    }
                },
                ExtraObjects: {
                    ExternalPropertyType: {
                        Options: {
                            property: {
                                Options: {
                                    nestedProperty1: {}
                                }
                            },
                            property1: {
                            }
                        }
                    },
                    ExternalPropertyType2: {
                        Options: {
                            property: {
                                Options: {
                                    nestedProperty2: {}
                                }
                            },
                            property2: {
                            }
                        }
                    }
                }
            });
        });

        it("should write generated data to a separate file for each widget", function() {
            expect(store.write.calls.count()).toBe(4);

            let writeToPathCount = (path) => {
                return store.write.calls
                    .allArgs()
                    .filter(args => args[0] === path).length;
            };

            expect(writeToPathCount(path.join("output-path", "complex-widget.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "external-property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "external-property-item-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "property.json"))).toBe(1);
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(4);

            expect(metas.DxComplexWidget).not.toBe(undefined);
            expect(metas.DxoExternalProperty).not.toBe(undefined);
            expect(metas.DxiExternalPropertyItem).not.toBe(undefined);
            expect(metas.DxoProperty).not.toBe(undefined);
        });

        it("should generate nested components with merged properties", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoExternalProperty');

            expect(metas.DxoExternalProperty.properties.map(p => p.name)).toEqual(['property', 'property1', 'property2']);
            expect(metas.DxoExternalProperty.optionName).toBe('externalProperty');
        });

        it("should generate collection nested components with merged properties", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxiExternalPropertyItem');

            expect(metas.DxiExternalPropertyItem.properties.map(p => p.name)).toEqual(['property', 'property1', 'property2']);
            expect(metas.DxiExternalPropertyItem.optionName).toBe('externalPropertyItems');
        });

        it("should generate nested components with merged properties of external types", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');

            expect(metas.DxoProperty.properties.map(p => p.name)).toEqual(['nestedProperty1', 'nestedProperty2']);
            expect(metas.DxoProperty.optionName).toBe('property');
        });
    });

});
