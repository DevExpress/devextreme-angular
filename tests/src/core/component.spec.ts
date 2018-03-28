/* tslint:disable:component-selector */

import {
    Component,
    ElementRef,
    EventEmitter,
    ViewChildren,
    NgZone,
    Input,
    Output,
    QueryList,
    OnDestroy,
    PLATFORM_ID,
    Inject
} from '@angular/core';

import { TransferState } from '@angular/platform-browser';
import { BrowserTransferStateModule } from '@angular/platform-browser';

import {
    TestBed,
    async,
    ComponentFixtureAutoDetect
} from '@angular/core/testing';

import {
    DxComponent,
    DxTemplateHost,
    WatcherHelper
} from '../../../dist';

// TODO: Try to replace dxButton to Widget ('require' required)
import DxButton from 'devextreme/ui/button';
let DxTestWidget = DxButton['inherit']({
    _render() {
        this.callBase();
        this.element().classList.add('dx-test-widget');
    }
});

DxTestWidget.defaultOptions({
    options: {
        text: 'test text'
    }
});

@Component({
    selector: 'dx-test-widget',
    template: '',
    providers: [DxTemplateHost, WatcherHelper]
})
export class DxTestWidgetComponent extends DxComponent implements OnDestroy {
    @Input()
    get testOption(): any {
        return this._getOption('testOption');
    }
    set testOption(value: any) {
        this._setOption('testOption', value);
    };
    @Input()
    get text(): any {
        return this._getOption('text');
    }
    set text(value: any) {
        this._setOption('text', value);
    };

    @Output() onOptionChanged = new EventEmitter<any>();
    @Output() onInitialized = new EventEmitter<any>();
    @Output() onDisposing = new EventEmitter<any>();
    @Output() onContentReady = new EventEmitter<any>();
    @Output() testOptionChange = new EventEmitter<any>();
    @Output() textChange = new EventEmitter<any>();

    constructor(elementRef: ElementRef,
        ngZone: NgZone,
        templateHost: DxTemplateHost,
        _watcherHelper: WatcherHelper,
         transferState: TransferState,
        @Inject(PLATFORM_ID) platformId: any) {
        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { emit: 'testOptionChange' },
            { emit: 'textChange' }
        ]);
    }

    protected _createInstance(element, options) {
        return new DxTestWidget(element, options);
    }

    ngOnDestroy() {
        this._destroyWidget();
    }
}

@Component({
    selector: 'test-container-component',
    template: ''
})
export class TestContainerComponent {
    visible = true;
    testOption: string;
    onStableCallCount = 0;

    @ViewChildren(DxTestWidgetComponent) innerWidgets: QueryList<DxTestWidgetComponent>;

    constructor(ngZone: NgZone) {
        ngZone.onStable.subscribe(() => {
            this.onStableCallCount++;
        });
    }

    testMethod() {
    }
}


describe('DevExtreme Angular widget', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [BrowserTransferStateModule],
                declarations: [TestContainerComponent, DxTestWidgetComponent]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-test-widget') || fixture.nativeElement;
        return DxTestWidget.getInstance(widgetElement);
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

        let element = getWidget(fixture).element();

        expect(element.classList).toContain('dx-test-widget');

    }));

    it('should be disposed', async(() => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');

        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget *ngIf="visible" (onDisposing)="testMethod()"></dx-test-widget>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        fixture.componentInstance.visible = false;
        fixture.detectChanges();

        expect(testSpy).toHaveBeenCalledTimes(1);
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

    it('should emit testOptionChange event', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget [testOption]="\'Test Value\'" (testOptionChange)="testMethod()"></dx-test-widget>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let component = fixture.componentInstance,
            instance = getWidget(fixture),
            testSpy = spyOn(component, 'testMethod');

        instance.option('testOption', 'new value');
        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(1);
    }));

    it('should change component option value', async(() => {
        let fixture = TestBed.createComponent(DxTestWidgetComponent);
        fixture.detectChanges();

        let component = fixture.componentInstance,
            instance = getWidget(fixture);

        instance.option('testOption', 'Changed');
        expect(component.testOption).toBe('Changed');

    }));

    it('should change instance option value', async(() => {
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

    it('should change instance option value by component option setter', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget [testOption]="testOption"></dx-test-widget>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance.innerWidgets.first,
            instance = getWidget(fixture);

        testComponent.testOption = 'Changed 2';
        fixture.detectChanges();
        expect(instance.option('testOption')).toBe('Changed 2');

    }));

    it('should fire optionChanged event', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget [testOption]="testOption" (onOptionChanged)="testMethod()"></dx-test-widget>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        let testSpy = spyOn(testComponent, 'testMethod');
        testComponent.testOption = 'Changed 2';
        fixture.detectChanges();
        expect(instance.option('testOption')).toBe('Changed 2');
        expect(testSpy).toHaveBeenCalledTimes(1);

    }));

    it('should fire onInitialized event', async(() => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget (onInitialized)="testMethod()"></dx-test-widget>'
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(1);

    }));

    it('should fire onContentReady event', async(() => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget (onContentReady)="testMethod()"></dx-test-widget>'
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(1);

    }));

    it('should unsubscribe events', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget></dx-test-widget>'
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture),
            spy = jasmine.createSpy('spy');

        instance.on('optionChanged', spy);
        instance.off('optionChanged', spy);

        instance.option('testOption', 'new value');
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(0);
    }));

    it('should unsubscribe all events', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget></dx-test-widget>'
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture),
            spy = jasmine.createSpy('spy');

        instance.on('optionChanged', spy);
        instance.off('optionChanged');

        instance.option('testOption', 'new value');
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(0);
    }));

    it('should have correct context in events', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget></dx-test-widget>'
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        instance.on('optionChanged', function() {
            expect(this).toBe(instance);
        });
        instance.option('testOption', 'new value');
    }));

    it('should fire unknown subscribed events', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget></dx-test-widget>'
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        instance.on('unknownEvent', function() {
            expect(this).toBe(instance);
        });
        instance.fireEvent('unknownEvent');
    }));

    it('ngZone onStable should not called recursively (T551347)', async(() => {
        TestBed.configureTestingModule(
        {
            declarations: [ TestContainerComponent, DxTestWidgetComponent ],
            providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
        });
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-test-widget></dx-test-widget>
                    <dx-test-widget></dx-test-widget>
                    <dx-test-widget></dx-test-widget>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);

        expect(fixture.componentInstance.onStableCallCount).toBe(1);

        fixture.autoDetectChanges(false);
    }));

    it('should not be failed when two-way binding in markup is used for ininitial option', () => {
        TestBed.configureTestingModule(
        {
            declarations: [ TestContainerComponent, DxTestWidgetComponent ],
            providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
        });
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-test-widget #widget></dx-test-widget>
                    <div id="test">{{widget.text}}</div>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);

        expect(document.getElementById('test').innerText).toBe('test text');
        fixture.autoDetectChanges(false);
    });

  });
