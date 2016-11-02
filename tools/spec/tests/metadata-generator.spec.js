describe("metadata-generator", function() {
    var extend = require('util')._extend;
    var path = require('path');
    var Generator = require('../../dist/metadata-generator').default;

    var testConfig = {
            sourceMetadataFilePath: "source-path",
            outputFolderPath: "output-path",
            nestedOutputFolderPath: "output-path/nested"
        };

    var testSourceMetadata = {
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
                },
                dxComplexWidget: {
                    Options: {
                        property: {
                            Options: {
                                nested: {
                                    Options: {
                                        deep: {}
                                    }
                                }
                            }
                        }
                    },
                    Module: 'test_widget'
                },
                dxAnotherComplexWidget: {
                    Options: {
                        property: {
                            Options: {
                                anotherNested: {}
                            }
                        }
                    },
                    Module: 'test_widget'
                },
                dxWidgetWithComplexCollections: {
                    Options: {
                        items: {
                            IsCollection: true,
                            SingularName: "item",
                            Options: {
                                text: { }
                            }
                        },
                        templatedItems: {
                            IsCollection: true,
                            SingularName: "templatedItem",
                            Options: {
                                text: { },
                                template: {
                                    IsTemplate: true
                                }
                            }
                        }
                    },
                    Module: 'test_widget'
                }
            }
        };

    var noop = function() {};

    describe("when generates", function() {
        var store,
            generator,
            metas;

        beforeEach(function() {
            store = {
                read: jasmine.createSpy().and.returnValue(testSourceMetadata),
                write: jasmine.createSpy()
            };
            generator = new Generator(store);
            generator.generate(testConfig);
            metas = {};
            store.write.calls.allArgs().forEach(function(args) {
                var metaData = args[1];
                metas[metaData.className] = metaData;
            })
        });

        it("should read data using the path specified in config", function() {
            expect(store.read).toHaveBeenCalledWith(testConfig.sourceMetadataFilePath);
        });

        it("should write generated data to a separate file for each widget", function() {
            expect(store.write.calls.count()).toBe(9);

            expect(store.write.calls.argsFor(0)[0]).toBe(path.join("output-path", "test-widget.json"));
            expect(store.write.calls.argsFor(1)[0]).toBe(path.join("output-path", "editor-widget.json"));
            expect(store.write.calls.argsFor(7)[0]).toBe(path.join("output-path", "nested", "property.json"));
            expect(store.write.calls.argsFor(8)[0]).toBe(path.join("output-path", "nested", "nested.json"));
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(9);

            expect(metas.DxTestWidget).not.toBe(undefined);
            expect(metas.DxCollectionWidget).not.toBe(undefined);
            expect(metas.DxEditorWidget).not.toBe(undefined);
            expect(metas.DxExtensionWidget).not.toBe(undefined);
            expect(metas.DxComplexWidget).not.toBe(undefined);
            expect(metas.DxAnotherComplexWidget).not.toBe(undefined);
            expect(metas.DxoProperty).not.toBe(undefined);
            expect(metas.DxoNested).not.toBe(undefined);
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

        it("should generate nested components with merged properties", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');

            expect(metas.DxoProperty.properties.map(p => p.name)).toEqual(['nested', 'anotherNested']);
            expect(metas.DxoProperty.optionName).toEqual('property');
        });

        it("should generate deep nested components", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoNested');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).not.toContain('DxoNested');

            expect(metas.DxoNested.properties.map(p => p.name)).toEqual(['deep']);
            expect(metas.DxoNested.optionName).toEqual('nested');
        });

        it("should generate collection nested components", function() {
            let itemsProp = metas.DxWidgetWithComplexCollections.properties[0]; 
            expect(itemsProp).not.toBe(undefined);
            expect(itemsProp.name).toBe('items');
            expect(itemsProp.isCollection).toBe(true);
            expect(itemsProp.isComplexCollection).toBe(true);
            expect(itemsProp.type.className).toBe('DxWidgetWithComplexCollectionsItemComponent');
            expect(itemsProp.type.selector).toBe('dx-widget-with-complex-collections-item');
            expect(itemsProp.type.hasTemplate).toBe(undefined);
            expect(itemsProp.type.properties.length).toBe(1);
            expect(itemsProp.type.properties[0].name).toBe('text');

            let templatedItemsProp = metas.DxWidgetWithComplexCollections.properties[1]; 
            expect(templatedItemsProp).not.toBe(undefined);
            expect(templatedItemsProp.name).toBe('templatedItems');
            expect(templatedItemsProp.isCollection).toBe(true);
            expect(templatedItemsProp.isComplexCollection).toBe(true);
            expect(templatedItemsProp.type.className).toBe('DxWidgetWithComplexCollectionsTemplatedItemComponent');
            expect(templatedItemsProp.type.selector).toBe('dx-widget-with-complex-collections-templated-item');
            expect(templatedItemsProp.type.hasTemplate).toBe(true);
            expect(templatedItemsProp.type.properties.length).toBe(1);
            expect(templatedItemsProp.type.properties[0].name).toBe('text');
        });

    });

});
