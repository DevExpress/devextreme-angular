describe("metadata-generator", function() {
    var extend = require('util')._extend;
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
                    }
                },
                dxEditorWidget: {
                    Options: {
                        value: {}
                    }
                },
                dxCollectionWidget: {
                    Options: {
                        collectionProperty: {
                            IsCollection: true
                        }
                    }
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
            metas = [];
            store.write.calls.allArgs().forEach(function(args) {
                metas.push(args[1]);
            })
        });

        it("should read data using the path specified in config", function() {
            expect(store.read).toHaveBeenCalledWith(testConfig.sourceMetadataFilePath);
        });

        it("should write generated data to a separate file for each widget", function() {
            expect(store.write.calls.count()).toBe(3);
            expect(store.write.calls.argsFor(0)[0]).toBe("output-path\\test-widget.json");
            expect(store.write.calls.argsFor(1)[0]).toBe("output-path\\editor-widget.json");
        });

        it("should generate matadata", function() {
            expect(metas.length).toBe(3);
            expect(metas[0]).not.toBeNull();
            expect(metas[1]).not.toBeNull();
        });

        it("should generate proper component class name", function() {
            expect(metas[0].className).toBe("DxTestWidget");
        });

        it("should generate proper component selector", function() {
            expect(metas[0].selector).toBe("dx-test-widget");
        });

        it("should generate proper widget name", function() {
            expect(metas[0].widgetName).toBe("dxTestWidget");
        });

        it("should generate proper events", function() {
            expect(metas[0].events).toEqual([
                { emit: 'onTestEvent', subscribe: 'testEvent' },
                { emit: 'testTemplateChange' },
                { emit: 'testPropertyChange' }
            ]);
        });

        it("should generate proper properties", function() {
            expect(metas[0].properties).toEqual([
                { name: 'testTemplate', type: 'any', collection: false },
                { name: 'testProperty', type: 'any', collection: false }
            ]);
        });

        it("should generate proper collection properties", function() {
            expect(metas[2].properties).toEqual([
                { name: 'collectionProperty', type: 'any', collection: true }
            ]);
        });

        it("should detect editors", function() {
            expect(metas[0].isEditor).toBe(false);
            expect(metas[1].isEditor).toBe(true);
        });

    });

});
