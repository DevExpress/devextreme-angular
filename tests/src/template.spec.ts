/// <reference path="../../typings/main/ambient/jasmine/index.d.ts" />

declare var DevExpress: any;
declare var $: any;

import {
    Component,
    ElementRef,
    EventEmitter,
    ViewChildren,
    NgZone,
    provide,
    Input,
    Output
} from '@angular/core';

import {
    inject,
    TestComponentBuilder
} from '@angular/core/testing';

import {
    DxComponent,
    DxTemplateHost,
    DxTemplate,
    RenderData
} from '../../dist';

// TODO: Try to replace dxButton to Widget ('require' required)
let dxTestWidget = DevExpress.ui.dxButton['inherit']({});

DevExpress.registerComponent('dxTestWidget', dxTestWidget);

@Component({
    selector: 'dx-test-widget',
    template: '',
    providers: [
        provide(DxTemplateHost, { useClass: DxTemplateHost })
    ]
})
export class DxTestWidget extends DxComponent {
    @Input() testTemplate: any;

    @Output() onOptionChanged: EventEmitter<any>;
    @Output() testTemplateChange: EventEmitter<any>;

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost) {
        super(elementRef, ngZone, templateHost);
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
}

@Component({
    selector: 'test-container-component',
    template: '',
    directives: [DxTestWidget, DxTemplate],
    queries: {
        innerWidgets: new ViewChildren(DxTestWidget)
    }
})
export class TestContainerComponent {
    constructor() {
    }
}


describe('DevExtreme Angular 2 widget\'s template', () => {
    let tcb;

    beforeEach(inject([TestComponentBuilder], _tcb => {
        tcb = _tcb;
    }));

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-test-widget') || fixture.nativeElement;
        return dxTestWidget.getInstance(widgetElement);
    }

    // spec
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

                let instance = getWidget(fixture);

                expect(instance.option('testTemplate')).not.toBeUndefined();
                expect(typeof instance.option('testTemplate')).toBe('function');

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

                let instance = getWidget(fixture),
                    templatesHash = instance.option('_templates');

                expect(templatesHash['testTemplate']).not.toBeUndefined();
                expect(typeof templatesHash['testTemplate'].render).toBe('function');

                done();
            })
            .catch(e => done.fail(e));
    });

    it('should implement the DevExpress.ui.TemplateBase interface', done => {
        tcb
            .overrideTemplate(TestContainerComponent, `
            <dx-test-widget>
                <div *dxTemplate="let d = data of 'testTemplate'">Template content</div>
            </dx-test-widget>
       `)
            .createAsync(TestContainerComponent)
            .then(fixture => {
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

                done();
            })
            .catch(e => done.fail(e));
    });

    /*
        TODO
        Interpolation doesn't work in the test for unclear reason if we specify it as follows:
        <div *dxTemplate='let d = data of 'testTemplate''>Template content {{d}}</div>
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
                    template = innerComponent.testTemplate,
                    $container = $('<div>');

                expect(template).not.toBeUndefined;

                template($container);
                expect($container.text()).toBe('Template content');

                template('test', $container);
                expect($container.text()).toBe('Template content');

                template($container, 'test');
                expect($container.text()).toBe('Template content');

                template('test', $container, 0);
                expect($container.text()).toBe('Template content');

                done();
            })
            .catch(e => done.fail(e));
    });


});

