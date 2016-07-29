/// <reference path="../../typings/main/ambient/jasmine/index.d.ts" />

declare var DevExpress: any;
declare var $: any;

import {
    Component,
    ElementRef,
    EventEmitter,
    ViewChildren,
    NgZone,
    provide
} from "@angular/core"

import {
    it,
    describe,
    expect,
    inject,
    beforeEach,
    beforeEachProviders,
    TestComponentBuilder
} from "@angular/core/testing";

import {
    DxComponent,
    DxTemplateHost,
    DxTemplate
} from "../../dist";

describe('DevExtreme Angular 2 widget', () => {
    let tcb;

    beforeEach(inject([TestComponentBuilder], _tcb => {
        tcb = _tcb;
    }));

    function getWidget(fixture) {
        var widgetElement = fixture.nativeElement.querySelector(".dx-test-widget") || fixture.nativeElement;
        return dxTestWidget.getInstance(widgetElement);
    }

    //specs
    it('should be rendered', done => {
       tcb
       .overrideTemplate(TestContainerComponent, '<dx-test-widget [testOption]="\'Test Value\'"></dx-test-widget>')
       .createAsync(TestContainerComponent)
            .then(fixture => {
                fixture.detectChanges();

                let element = getWidget(fixture).element().get(0);

                expect(element.classList).toContain("dx-test-widget");

                done();
            })
            .catch(e => done.fail(e));
    });

    it('should set testOption value to insatnce', done => {
       tcb
       .overrideTemplate(TestContainerComponent, '<dx-test-widget [testOption]="\'Test Value\'"></dx-test-widget>')
       .createAsync(TestContainerComponent)
            .then(fixture => {
                fixture.detectChanges();

                let outerComponent =  fixture.componentInstance,
                    innerComponent = outerComponent.innerWidgets.toArray()[0],
                    instance = getWidget(fixture);

                expect(instance.option("testOption")).toBe('Test Value');
                expect(innerComponent.testOption).toBe('Test Value');

                done();
            })
            .catch(e => done.fail(e));
    });

    it('should change component option value', done => {
       tcb.createAsync(DxTestWidget)
            .then(fixture => {
                fixture.detectChanges();

                let component =  fixture.componentInstance,
                    instance = getWidget(fixture);

                instance.option("testOption", "Changed");
                expect(component.testOption).toBe('Changed');

                done();
            })
            .catch(e => done.fail(e));
    });

    it('should change instance option value and fire optionChanged event', done => {
       tcb
       .overrideTemplate(TestContainerComponent, '<dx-test-widget [testOption]="testOption"></dx-test-widget>')
       .createAsync(TestContainerComponent)
            .then(fixture => {
                fixture.detectChanges();

                var testComponent =  fixture.componentInstance,
                    instance = getWidget(fixture);

                testComponent.testOption = "Changed 2";
                fixture.detectChanges();
                expect(instance.option("testOption")).toBe('Changed 2');
                done();
            })
            .catch(e => done.fail(e));
    });

    it('should initialize template options of a widget', done => {
       tcb
       .overrideTemplate(TestContainerComponent, `
            <dx-test-widget>
                <div *dxTemplate="let d = data of 'testTemplate'">Template content</div>
            </dx-test-widget>
       `)
       .createAsync(TestContainerComponent)
            .then(fixture => {
                fixture.detectChanges();

                let testComponent = fixture.componentInstance,
                    innerComponent = testComponent.innerWidgets.toArray()[0],
                    instance = getWidget(fixture);

                expect(instance.option("testTemplate")).not.toBeUndefined;
                expect(typeof instance.option("testTemplate")).toBe("function");

                done();
            })
            .catch(e => done.fail(e));
    });

    it('should initialize named templates #17', done => {
       tcb
       .overrideTemplate(TestContainerComponent, `
            <dx-test-widget>
                <div *dxTemplate="let d = data of 'testTemplate'">Template content</div>
            </dx-test-widget>
       `)
       .createAsync(TestContainerComponent)
            .then(fixture => {
                fixture.detectChanges();

                let testComponent = fixture.componentInstance,
                    innerComponent = testComponent.innerWidgets.toArray()[0],
                    instance = getWidget(fixture),
                    templatesHash = instance.option("_templates");

                expect(templatesHash["testTemplate"]).not.toBeUndefined;
                expect(typeof templatesHash["testTemplate"].render).toBe("function");

                done();
            })
            .catch(e => done.fail(e));
    });

    /*  
        TODO
        Interpolation doesn't work in the test for unclear reason if we specify it as follows:
        <div *dxTemplate="let d = data of 'testTemplate'">Template content {{d}}</div>
    */
    it('should nonrmalize template function arguments order (#17)', done => {
       tcb
       .overrideTemplate(TestContainerComponent, `
            <dx-test-widget>
                <div *dxTemplate="let d = data of 'testTemplate'">Template content</div>
            </dx-test-widget>
       `)
       .createAsync(TestContainerComponent)
            .then(fixture => {
                fixture.detectChanges();

                let testComponent = fixture.componentInstance,
                    innerComponent = testComponent.innerWidgets.toArray()[0],
                    instance = getWidget(fixture),
                    template = innerComponent.testTemplate,
                    $container = $("<div>");

                expect(template).not.toBeUndefined;

                template($container); 
                expect($container.text()).toBe("Template content");

                template("test", $container);
                expect($container.text()).toBe("Template content");

                template($container, "test");
                expect($container.text()).toBe("Template content");

                done();
            })
            .catch(e => done.fail(e));
    });

});

//TODO: Try to replace dxButton to Widget ('require' required)
var dxTestWidget = DevExpress.ui.dxButton["inherit"]({
    NAME: "dxTestWidget",
    _render(){
        this.element()[0].classList.add("dx-test-widget");
    }
});

DevExpress.registerComponent("dxTestWidget", dxTestWidget);

@Component({
    selector: 'dx-test-widget',
    template:'',
    inputs: ['testOption', 'testTemplate'],
    outputs:['testOptionChange', "onOptionChanged", "testTemplateChange"],
    providers: [
        provide(DxTemplateHost, { useClass: DxTemplateHost })
    ]
})
export class DxTestWidget extends DxComponent{
    testOption: any;
    testTemplate: any;
    onOptionChanged: EventEmitter<any>;
    testOptionChange: EventEmitter<any>; 
    testTemplateChange: EventEmitter<any>; 

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost) {
        super(elementRef, ngZone, templateHost);
        this.widgetClassName = 'dxTestWidget';
        this._events = [
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'initialized', emit: 'onInitialized' }
        ];

        this._properties = [
            'testOption',
            'testTemplate'
        ]

        this.onOptionChanged = new EventEmitter();
        this.testOptionChange = new EventEmitter();
        this.testTemplateChange = new EventEmitter();
    }
}

@Component({
    selector: 'test-container-component',
    template:'',
    directives: [DxTestWidget, DxTemplate],
    queries: {
        innerWidgets: new ViewChildren(DxTestWidget)
    }
})
export class TestContainerComponent {
    constructor() {
    }
}