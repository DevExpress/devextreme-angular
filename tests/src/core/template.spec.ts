/// <reference path="../../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../../typings/globals/jquery/index.d.ts" />

import $ = require('jquery');

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
    DxTemplateHost,
    DxTemplateModule,
    RenderData,
    WatcherHelper
} from '../../../dist';

// TODO: Try to replace dxButton to Widget ('require' required)
import DxButton from 'devextreme/ui/button';
let DxTestWidget = DxButton['inherit']({
    _render() {
        this.element()[0].classList.add('dx-test-widget');
    }
});

@Component({
    selector: 'dx-test-widget',
    template: '',
    providers: [DxTemplateHost, WatcherHelper]
})
export class DxTestWidgetComponent extends DxComponent {
    @Input() testTemplate: any;

    @Output() onOptionChanged: EventEmitter<any>;
    @Output() testTemplateChange: EventEmitter<any>;

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost, _watcherHelper: WatcherHelper) {
        super(elementRef, ngZone, templateHost, _watcherHelper);
        this.widgetClassName = 'dxTestWidget';
        this._events = [
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'initialized', emit: 'onInitialized' }
        ];

        this._properties = [
            'testTemplate'
        ];

        this.onOptionChanged = new EventEmitter();
        this.testTemplateChange = new EventEmitter();
    }

    protected _createInstance(element, options) {
        return new DxTestWidget(element, options);
    }
}

@Component({
    selector: 'test-container-component',
    template: ''
})
export class TestContainerComponent {
    @ViewChildren(DxTestWidgetComponent) innerWidgets: QueryList<DxTestWidgetComponent>;
}


describe('DevExtreme Angular 2 widget\'s template', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent, DxTestWidgetComponent],
                imports: [DxTemplateModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-test-widget') || fixture.nativeElement;
        return DxTestWidget.getInstance(widgetElement);
    }

    // spec
    it('should initialize template options of a widget', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test-widget>
                <div *dxTemplate="let d of 'testTemplate'">Template content</div>
            </dx-test-widget>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        expect(instance.option('testTemplate')).not.toBeUndefined();
        expect(typeof instance.option('testTemplate')).toBe('function');
    }));

    it('should initialize named templates #17', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test-widget>
                <div *dxTemplate="let d of 'testTemplate'">Template content</div>
            </dx-test-widget>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture),
            templatesHash = instance.option('_templates');

        expect(templatesHash['testTemplate']).not.toBeUndefined();
        expect(typeof templatesHash['testTemplate'].render).toBe('function');

    }));

    it('should implement the TemplateBase interface', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test-widget>
                <div *dxTemplate="let d of 'testTemplate'">Template content</div>
            </dx-test-widget>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture),
            templatesHash = instance.option('_templates'),
            template = templatesHash['testTemplate'],
            renderData: RenderData = {
                model: {},
                itemIndex: 0,
                container: $('<div>')
            },
            newDiv = document.createElement('div');

        newDiv.innerHTML = 'Template content';

        let renderResult = template.render(renderData)[0];
        expect(newDiv.isEqualNode(renderResult)).toBe(true);

        expect(template.owner()).toBe(instance);

        expect(template.source() instanceof $).toBe(true);

        template.dispose();
        expect(template.owner()).toBeNull();

    }));

    /*
        TODO
        Interpolation doesn't work in the test for unclear reason if we specify it as follows:
        <div *dxTemplate='let d of 'testTemplate''>Template content {{d}}</div>
    */
    it('should nonrmalize template function arguments order (#17)', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test-widget>
                <div *dxTemplate="let d of 'testTemplate'">Template content: {{d}}</div>
            </dx-test-widget>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            innerComponent = testComponent.innerWidgets.first,
            template = innerComponent.testTemplate,
            $container = $('<div>');

        expect(template).not.toBeUndefined;

        template($container);
        fixture.detectChanges();
        expect($container.text()).toBe('Template content: ');

        template('test', $container);
        fixture.detectChanges();
        expect($container.text()).toBe('Template content: test');

        template($container, 'test');
        fixture.detectChanges();
        expect($container.text()).toBe('Template content: test');

        template('test', $container, 0);
        fixture.detectChanges();
        expect($container.text()).toBe('Template content: test');

    }));


});

