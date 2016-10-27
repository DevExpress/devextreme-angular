describe("metadata-generator", function() {
    var extend = require('util')._extend;
    var path = require('path');
    var Generator = require('../../dist/metadata-generator').default;

    var testConfig = {
            sourceMetadataFilePath: "source-path",
            outputFolderPath: "output-path"
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
                metas[metaData.widgetName] = metaData;
            })
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
            expect(metas.dxTestWidget).not.toBe(undefined);
            expect(metas.dxCollectionWidget).not.toBe(undefined);
            expect(metas.dxEditorWidget).not.toBe(undefined);
            expect(metas.dxExtensionWidget).not.toBe(undefined);
        });

        it("should generate proper component class name", function() {
            expect(metas.dxTestWidget.className).toBe("DxTestWidget");
        });

        it("should generate proper component selector", function() {
            expect(metas.dxTestWidget.selector).toBe("dx-test-widget");
        });

        it("should generate proper widget name", function() {
            expect(metas.dxTestWidget.widgetName).toBe("dxTestWidget");
        });

        it("should generate proper events", function() {
            expect(metas.dxTestWidget.events).toEqual([
                { emit: 'onTestEvent', subscribe: 'testEvent' },
                { emit: 'testTemplateChange' },
                { emit: 'testPropertyChange' }
            ]);
        });

        it("should generate proper properties", function() {
            expect(metas.dxTestWidget.properties).toEqual([
                { name: 'testTemplate', type: 'any' },
                { name: 'testProperty', type: 'any' }
            ]);
        });

        it("should generate proper collection properties", function() {
            expect(metas.dxCollectionWidget.properties).toEqual([
                { name: 'collectionProperty', type: 'any', isCollection: true },
                { name: 'dataSourceProperty', type: 'any', isCollection: true }
            ]);
        });

        it("should generate proper module name", function() {
            expect(metas.dxTestWidget.module).toBe("devextreme/test_widget");
        });

        it("should detect editors", function() {
            expect(metas.dxTestWidget.isEditor).toBe(false);
            expect(metas.dxEditorWidget.isEditor).toBe(true);
        });

        it("should detect extensions", function() {
            expect(metas.dxTestWidget.isExtension).toBe(false);
            expect(metas.dxExtensionWidget.isExtension).toBe(true);
        });

    });

});
