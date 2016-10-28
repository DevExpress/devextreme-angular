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
            expect(store.write.calls.count()).toBe(7);

            expect(store.write.calls.argsFor(0)[0]).toBe(path.join("output-path", "test-widget.json"));
            expect(store.write.calls.argsFor(1)[0]).toBe(path.join("output-path", "editor-widget.json"));
            expect(store.write.calls.argsFor(4)[0]).toBe(path.join("output-path", "nested", "complex-widget-property-nested.json"));
            expect(store.write.calls.argsFor(5)[0]).toBe(path.join("output-path", "nested", "complex-widget-property.json"));
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(7);

            expect(metas.DxTestWidget).not.toBe(undefined);
            expect(metas.DxCollectionWidget).not.toBe(undefined);
            expect(metas.DxEditorWidget).not.toBe(undefined);
            expect(metas.DxExtensionWidget).not.toBe(undefined);
            expect(metas.DxComplexWidget).not.toBe(undefined);
            expect(metas.DxComplexWidgetProperty).not.toBe(undefined);
            expect(metas.DxComplexWidgetPropertyNested).not.toBe(undefined);
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

        it("should generate nested components", function() {
            expect(metas.DxComplexWidgetProperty.hostClassName).toBe('DxComplexWidget');
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxComplexWidgetProperty');

            expect(metas.DxComplexWidgetProperty.properties.map(p => p.name)).toEqual(['nested']);
        });

        it("should generate deep nested components", function() {
            expect(metas.DxComplexWidgetPropertyNested.hostClassName).toBe('DxComplexWidget');
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxComplexWidgetPropertyNested');

            expect(metas.DxComplexWidgetPropertyNested.properties.map(p => p.name)).toEqual(['deep']);
        });

    });

});
