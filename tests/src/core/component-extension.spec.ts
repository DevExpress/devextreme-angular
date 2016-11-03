/// <reference path="../../../typings/globals/jasmine/index.d.ts" />

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
    DxComponentExtension,
    DxTemplateHost,
    WatcherHelper
} from '../../../dist';

import DxButton from 'devextreme/ui/button';
let DxTestExtension = DxButton['inherit']({
    _render() {
        this.callBase();
        this.element()[0].classList.add('dx-test-extension');
    }
});

@Component({
    selector: 'dx-test-extension',
    template: '',
    providers: [DxTemplateHost, WatcherHelper]
})
export class DxTestExtensionComponent extends DxComponentExtension {
    @Input() testOption: any;
    @Output() testOptionChange: EventEmitter<any>;

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost, _watcherHelper: WatcherHelper) {
        super(elementRef, ngZone, templateHost, _watcherHelper);
        this.widgetClassName = 'dxTestExtension';
        this._events = [
            { emit: 'testOptionChange' }
        ];

        this._properties = [
            'testOption'
        ];

        this.testOptionChange = new EventEmitter();
    }

    protected _createInstance(element, options) {
        return new DxTestExtension(element, options);
    }
}

@Component({
    selector: 'test-container-component',
    template: ''
})
export class TestContainerComponent {
    @ViewChildren(DxTestExtensionComponent) innerWidgets: QueryList<DxTestExtensionComponent>;
}


describe('DevExtreme Angular 2 component extension', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent, DxTestExtensionComponent]
            });
    });

    function getWidget(element) {
        return DxTestExtension.getInstance(element);
    }

    // spec
    it('should not create widget instance by itself', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-extension> </dx-test-extension>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture.nativeElement);
        expect(instance).toBe(undefined);

    }));

    it('should instantiate widget with the createInstance() method', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-extension></dx-test-extension>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let outerComponent = fixture.componentInstance,
            innerComponent = outerComponent.innerWidgets.first,
            targetElement = document.createElement('div');

        innerComponent.createInstance(targetElement);
        let instance = getWidget(targetElement);
        expect(instance).not.toBe(undefined);

    }));

  });
