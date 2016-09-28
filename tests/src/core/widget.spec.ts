/// <reference path="../../../typings/main/ambient/jasmine/index.d.ts" />

declare var DevExpress: any;
declare var $: any;
declare var sinon: any;

import {
    Component,
    ElementRef,
    EventEmitter,
    ViewChildren,
    NgZone,
    Input,
    Output,
    QueryList
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import {
    DxComponent,
    DxTemplateHost
} from '../../../dist';

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
    providers: [DxTemplateHost]
})
export class DxTestWidgetComponent extends DxComponent {
    @Input() testOption: any;

    @Output() onOptionChanged: EventEmitter<any>;
    @Output() onInitialized: EventEmitter<any>;
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
        this.onInitialized = new EventEmitter();
        this.testOptionChange = new EventEmitter();
    }
}

@Component({
    selector: 'test-container-component',
    template: ''
})
export class TestContainerComponent {
    testOption: string;
    @ViewChildren(DxTestWidgetComponent) innerWidgets: QueryList<DxTestWidgetComponent>;
    testMethod() {
    }
}


describe('DevExtreme Angular 2 widget', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent, DxTestWidgetComponent]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-test-widget') || fixture.nativeElement;
        return dxTestWidget.getInstance(widgetElement);
    }

    // spec
    it('should be rendered', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget [testOption]="\'Test Value\'" > </dx-test-widget>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let element = getWidget(fixture).element().get(0);

        expect(element.classList).toContain('dx-test-widget');

    }));

    it('should set testOption value to insatnce', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget [testOption]="\'Test Value\'" > </dx-test-widget>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let outerComponent = fixture.componentInstance,
            innerComponent = outerComponent.innerWidgets.first,
            instance = getWidget(fixture);

        expect(instance.option('testOption')).toBe('Test Value');
        expect(innerComponent.testOption).toBe('Test Value');

    }));

    it('should change component option value', async(() => {
        let fixture = TestBed.createComponent(DxTestWidgetComponent);
        fixture.detectChanges();

        let component = fixture.componentInstance,
            instance = getWidget(fixture);

        instance.option('testOption', 'Changed');
        expect(component.testOption).toBe('Changed');

    }));

    it('should change instance option value and fire optionChanged event', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget [testOption]="testOption"></dx-test-widget>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        testComponent.testOption = 'Changed 2';
        fixture.detectChanges();
        expect(instance.option('testOption')).toBe('Changed 2');

    }));

    it('should fire onInitialized event', async(() => {
        let testSpy = sinon.spy(TestContainerComponent.prototype, 'testMethod');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget (onInitialized)="testMethod()"></dx-test-widget>'
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        expect(testSpy.calledOnce).toBe(true);

    }));
  });
