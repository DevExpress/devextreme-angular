/// <reference path="../../../typings/globals/jasmine/index.d.ts" />

import {
    Component,
    ElementRef,
    EventEmitter,
    ViewChildren,
    NgZone,
    Input,
    Output,
    QueryList,
    Host,
    SkipSelf
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import { WatcherHelper } from '../../../dist/core/watcher-helper';
import {
    DxComponent,
    DxTemplateHost
} from '../../../dist';

import {
    NestedOption,
    NestedOptionHost
} from '../../../dist/core/nested-option';

// TODO: Try to replace dxButton to Widget ('require' required)
import DxButton from 'devextreme/ui/button';
let DxTestWidget = DxButton['inherit']({
    _render() {
        this.callBase();
        this.element()[0].classList.add('dx-test-widget');
    }
});

@Component({
    selector: 'dx-test-widget',
    template: '',
    providers: [DxTemplateHost, NestedOptionHost, WatcherHelper]
})
export class DxTestWidgetComponent extends DxComponent {
    @Input()
    get testOption(): any {
        return this._getOption('testOption');
    }
    set testOption(value: any) {
        this._setOption('testOption', value);
    };

    @Output() onOptionChanged = new EventEmitter<any>();
    @Output() testOptionChange = new EventEmitter<any>();

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost, private _noh: NestedOptionHost,
        _watcherHelper: WatcherHelper) {
        super(elementRef, ngZone, templateHost, _watcherHelper);

        this._events = [
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'testOptionChange' }
        ];

        this._noh.setHost(this);
    }

    protected _createInstance(element, options) {
        return new DxTestWidget(element, options);
    }
}


@Component({
    selector: 'dxo-test-option',
    template: '',
    providers: [NestedOptionHost]
})
export class DxoTestOptionComponent extends NestedOption {
    @Input()
    get testNestedOption() {
        return this._getOption('testNestedOption');
    }
    set testNestedOption(value: any) {
        this._setOption('testNestedOption', value);
    }

    protected get _optionPath() {
        return 'testOption';
    }

    constructor(@SkipSelf() @Host() private _pnoh: NestedOptionHost, @Host() private _noh: NestedOptionHost, element: ElementRef) {
        super(element);

        this._pnoh.setNestedOption(this);
        this._noh.setHost(this);
    }
}

@Component({
    selector: 'test-container-component',
    template: ''
})
export class TestContainerComponent {
    testOption: string;
    @ViewChildren(DxTestWidgetComponent) innerWidgets: QueryList<DxTestWidgetComponent>;
}


describe('DevExtreme Angular 2 widget', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent, DxTestWidgetComponent, DxoTestOptionComponent]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-test-widget') || fixture.nativeElement;
        return DxTestWidget.getInstance(widgetElement);
    }

    // spec
    it('option should be initially setted', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget><dxo-test-option testNestedOption="test"></dxo-test-option></dx-test-widget>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        expect(instance.option('testOption')).toEqual({ testNestedOption: 'test' });
    }));

    it('option should be setted dynamically', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-widget><dxo-test-option [testNestedOption]="testOption"></dxo-test-option></dx-test-widget>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        testComponent.testOption = 'text';
        fixture.detectChanges();

        expect(instance.option('testOption')).toEqual({ testNestedOption: 'text' });
    }));

  });
