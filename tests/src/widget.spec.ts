/// <reference path="../../typings/main/ambient/jasmine/index.d.ts" />

declare var DevExpress: any;
declare var $: any;

import {
    Component,
    ElementRef,
    EventEmitter,
    ViewChildren,
    NgZone,
    Input,
    Output
} from '@angular/core';

import {
    inject,
    TestComponentBuilder
} from '@angular/core/testing';

import {
    DxComponent,
    DxTemplateHost
} from '../../dist';

// TODO: Try to replace dxButton to Widget ('require' required)
let dxTestWidget = DevExpress.ui.dxButton['inherit']({
    NAME: 'dxTestWidget',
    _render() {
        this.element()[0].classList.add('dx-test-widget');
    }
});

DevExpress.registerComponent('dxTestWidget', dxTestWidget);

@Component({
    selector: 'dx-test-widget',
    template: '',
    providers: [
        { provide: DxTemplateHost, useClass: DxTemplateHost }
    ]
})
export class DxTestWidget extends DxComponent {

    @Input() testOption: any;

    @Output() onOptionChanged: EventEmitter<any>;
    @Output() testOptionChange: EventEmitter<any>;

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost) {
        super(elementRef, ngZone, templateHost);
        this.widgetClassName = 'dxTestWidget';
        this._events = [
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'initialized', emit: 'onInitialized' }
        ];

        this._properties = [
            'testOption'
        ];

        this.onOptionChanged = new EventEmitter();
        this.testOptionChange = new EventEmitter();
    }
}

@Component({
    selector: 'test-container-component',
    template: '',
    directives: [DxTestWidget],
    queries: {
        innerWidgets: new ViewChildren(DxTestWidget)
    }
})
export class TestContainerComponent {
    constructor() {
    }
}


describe('DevExtreme Angular 2 widget', () => {
    let tcb;

    beforeEach(inject([TestComponentBuilder], _tcb => {
        tcb = _tcb;
    }));

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-test-widget') || fixture.nativeElement;
        return dxTestWidget.getInstance(widgetElement);
    }

    // specs
    it('should be rendered', done => {
       tcb
       .overrideTemplate(TestContainerComponent, '<dx-test-widget [testOption]="\'Test Value\'" > </dx-test-widget>')
       .createAsync(TestContainerComponent)
            .then(fixture => {
                fixture.detectChanges();

                let element = getWidget(fixture).element().get(0);

                expect(element.classList).toContain('dx-test-widget');

                done();
            })
            .catch(e => done.fail(e));
    });

    it('should set testOption value to insatnce', done => {
       tcb
       .overrideTemplate(TestContainerComponent, '<dx-test-widget [testOption]="\'Test Value\'" > </dx-test-widget>')
       .createAsync(TestContainerComponent)
            .then(fixture => {
                fixture.detectChanges();

                let outerComponent =  fixture.componentInstance,
                    innerComponent = outerComponent.innerWidgets.toArray()[0],
                    instance = getWidget(fixture);

                expect(instance.option('testOption')).toBe('Test Value');
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

                instance.option('testOption', 'Changed');
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

                let testComponent =  fixture.componentInstance,
                    instance = getWidget(fixture);

                testComponent.testOption = 'Changed 2';
                fixture.detectChanges();
                expect(instance.option('testOption')).toBe('Changed 2');
                done();
            })
            .catch(e => done.fail(e));
    });
});
