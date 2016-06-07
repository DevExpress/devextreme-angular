/// <reference path="../../typings/main/ambient/jasmine/index.d.ts" />
/// <reference path="../../dist/index.d.ts" />

var DevExpress = window["DevExpress"];

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
    beforeEachProviders
} from "@angular/core/testing";

import{
    TestComponentBuilder
} from "@angular/compiler/testing";

import {
    DxComponent, 
    DxTemplateHost
} from "../../dist";

describe('DevExtreme Angular 2 widget', () => {
    let tcb;
  
    //setup
    beforeEachProviders(() => [
        TestComponentBuilder
    ]);

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
    inputs: ['testOption'],
    outputs:['testOptionChange', "onOptionChanged"],
    providers: [
        provide(DxTemplateHost, { useClass: DxTemplateHost })
    ]
})
export class DxTestWidget extends DxComponent{
    testOption: any;
    onOptionChanged: EventEmitter<any>;
    testOptionChange: EventEmitter<any>;
    
    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost) {
        super(elementRef, ngZone, templateHost);
        this.widgetClassName = 'dxTestWidget';
        this._events = [
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'initialized', emit: 'onInitialized' }
        ];

        this._properties = [
            'this.testOption'
        ]

        this.onOptionChanged = new EventEmitter();
        this.testOptionChange = new EventEmitter();
    }
}

@Component({
    selector: 'test-container-component',
    template:'',
    directives: [DxTestWidget],
    queries: {
        innerWidgets: new ViewChildren(DxTestWidget)
    }
})
export class TestContainerComponent {
    constructor() {

    }
}