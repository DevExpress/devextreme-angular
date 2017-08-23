/* tslint:disable:component-selector */

import {
    Component,
    ElementRef,
    EventEmitter,
    ViewChildren,
    NgZone,
    Input,
    Output,
    ContentChildren,
    QueryList,
    Host,
    SkipSelf,
    AfterViewInit
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
    CollectionNestedOption,
    NestedOptionHost,
    extractTemplate
} from '../../../dist/core/nested-option';

let $ = require('jquery');

// TODO: Try to replace dxButton to Widget ('require' required)
import DxButton from 'devextreme/ui/button';
let DxTestWidget = DxButton['inherit']({
    _render() {
        this.callBase();
        this.element()[0].classList.add('dx-test-widget');
    }
});


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

    constructor(@SkipSelf() @Host() private _pnoh: NestedOptionHost, @Host() private _noh: NestedOptionHost) {
        super();

        this._pnoh.setNestedOption(this);
        this._noh.setHost(this);
    }
}

@Component({
    selector: 'dxi-test-collection-option',
    template: '',
    providers: [NestedOptionHost]
})
export class DxiTestCollectionOptionComponent extends CollectionNestedOption {
    @Input()
    get testOption() {
        return this._getOption('testOption');
    }
    set testOption(value: any) {
        this._setOption('testOption', value);
    }

    protected get _optionPath() {
        return 'testCollectionOption';
    }

    constructor(@SkipSelf() @Host() private _pnoh: NestedOptionHost, @Host() private _noh: NestedOptionHost) {
        super();

        this._pnoh.setNestedOption(this);
        this._noh.setHost(this, this._fullOptionPath.bind(this));
    }
}

@Component({
    selector: 'dxi-test-collection-option-with-template',
    template: '<ng-content></ng-content>',
    providers: [NestedOptionHost]
})
export class DxiTestCollectionOptionWithTemplateComponent extends CollectionNestedOption implements AfterViewInit  {
    protected get _optionPath() {
        return 'testCollectionWithTemplateOption';
    }

    get template() {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    shownEventFired = false;

    constructor(@SkipSelf() @Host() private _pnoh: NestedOptionHost, @Host() private _noh: NestedOptionHost, private element: ElementRef) {
        super();

        this._pnoh.setNestedOption(this);
        this._noh.setHost(this, this._fullOptionPath.bind(this));
    }

    ngAfterViewInit() {
        let $element = $(this.element.nativeElement);

        extractTemplate(this, this.element);

        $element.addClass('dx-visibility-change-handler');
        $element.on('dxshown', function() {
            this.shownEventFired = true;
        }.bind(this));

        this.template.render({ container: $('dx-test-widget') });
    }
}

@Component({
    selector: 'dx-test-widget',
    template: '',
    providers: [DxTemplateHost, NestedOptionHost, WatcherHelper]
})
export class DxTestWidgetComponent extends DxComponent implements AfterViewInit {
    @Input()
    get testOption(): any {
        return this._getOption('testOption');
    }
    set testOption(value: any) {
        this._setOption('testOption', value);
    };
    @Input()
    get testCollectionOption(): any {
        return this._getOption('testCollectionOption');
    }
    set testCollectionOption(value: any) {
        this._setOption('testCollectionOption', value);
    };
    @Input()
    get testCollectionOptionWithTemplate(): any {
        return this._getOption('testCollectionOptionWithTemplate');
    }
    set testCollectionOptionWithTemplate(value: any) {
        this._setOption('testCollectionOptionWithTemplate', value);
    };

    @ContentChildren(DxiTestCollectionOptionComponent)
    get testCollectionOptionChildren(): QueryList<DxiTestCollectionOptionComponent> {
        return this._getOption('testCollectionOption');
    }
    set testCollectionOptionChildren(value) {
        this.setChildren('testCollectionOption', value);
    }

    @ContentChildren(DxiTestCollectionOptionWithTemplateComponent)
    get testCollectionOptionWithTemplateChildren(): QueryList<DxiTestCollectionOptionWithTemplateComponent> {
        return this._getOption('testCollectionOptionWithTemplate');
    }
    set testCollectionOptionWithTemplateChildren(value) {
        this.setChildren('testCollectionOptionWithTemplate', value);
    }

    @ContentChildren(DxiTestCollectionOptionWithTemplateComponent)
    testCollectionOptionWithTemplateChildrens: QueryList<DxiTestCollectionOptionWithTemplateComponent>;

    @Output() onOptionChanged = new EventEmitter<any>();
    @Output() testOptionChange = new EventEmitter<any>();
    @Output() testCollectionOptionChange = new EventEmitter<any>();
    @Output() testCollectionOptionWithTemplateChange = new EventEmitter<any>();

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost, private _noh: NestedOptionHost,
        _watcherHelper: WatcherHelper) {
        super(elementRef, ngZone, templateHost, _watcherHelper);

        this._events = [
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'testOptionChange' },
            { emit: 'testCollectionOptionChange' },
            { emit: 'testCollectionOptionWithTemplate' }
        ];

        this._noh.setHost(this);
    }

    protected _createInstance(element, options) {
        return new DxTestWidget(element, options);
    }

    ngAfterViewInit() {
        this._createWidget(this.element.nativeElement);
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


describe('DevExtreme Angular widget', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [
                    TestContainerComponent,
                    DxTestWidgetComponent,
                    DxoTestOptionComponent,
                    DxiTestCollectionOptionComponent,
                    DxiTestCollectionOptionWithTemplateComponent
                ]
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

    it('nested option should update their nested options', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-test-widget>
                        <dxi-test-collection-option>
                            <dxo-test-option [testNestedOption]="testOption">
                            </dxo-test-option>
                        </dxi-test-collection-option>
                    </dx-test-widget>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        expect(instance.option('testCollectionOption')[0].testOption).toEqual({ testNestedOption: undefined });

        testComponent.testOption = 'text';
        fixture.detectChanges();

        expect(instance.option('testCollectionOption')[0].testOption).toEqual({ testNestedOption: 'text' });
    }));

    it('method template.render of nested option should trigger shownEvent after rendering', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-test-widget>
                        <dxi-test-collection-option-with-template>
                            <div>123</div>
                        </dxi-test-collection-option-with-template>
                    </dx-test-widget>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let innerWidget = fixture.componentInstance.innerWidgets.first;
        let nestedOption = innerWidget.testCollectionOptionWithTemplateChildrens.first;

        expect(nestedOption.shownEventFired).toBe(true);
    }));

  });
