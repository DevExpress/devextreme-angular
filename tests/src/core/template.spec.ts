/* tslint:disable:component-selector */

import $ = require('jquery');

import {
    Component,
    ElementRef,
    EventEmitter,
    ViewChildren,
    NgZone,
    Input,
    Output,
    QueryList,
    AfterViewInit
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import {
    DxComponent,
    DxTemplateHost,
    DxTemplateModule,
    DxTemplateDirective,
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
export class DxTestWidgetComponent extends DxComponent implements AfterViewInit {
    @Input()
    get testTemplate(): any {
        return this._getOption('testTemplate');
    }
    set testTemplate(value: any) {
        this._setOption('testTemplate', value);
    };

    @Output() onOptionChanged = new EventEmitter<any>();
    @Output() testTemplateChange = new EventEmitter<any>();

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost, _watcherHelper: WatcherHelper) {
        super(elementRef, ngZone, templateHost, _watcherHelper);

        this._createEventEmitters([
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'initialized', emit: 'onInitialized' }
        ]);
    }

    protected _createInstance(element, options) {
        return new DxTestWidget(element, options);
    }

    ngAfterViewInit() {
        this._createWidget(this.element.nativeElement);
    }
}

@Component({
    selector: 'dx-test',
    template: '',
    providers: [DxTemplateHost, WatcherHelper]
})
export class DxTestComponent extends DxComponent implements AfterViewInit {
    templates: DxTemplateDirective[];

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost, _watcherHelper: WatcherHelper) {
        super(elementRef, ngZone, templateHost, _watcherHelper);
    }

    protected _createInstance() {}

    ngAfterViewInit() {
        this.templates[0].render({
            model: {},
            container: $(this.element.nativeElement),
            index: 5
        });
    }
}

@Component({
    selector: 'test-container-component',
    template: '',
    providers: [DxTemplateHost]
})
export class TestContainerComponent {
    @ViewChildren(DxTestWidgetComponent) innerWidgets: QueryList<DxTestWidgetComponent>;
}


describe('DevExtreme Angular widget\'s template', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent, DxTestWidgetComponent, DxTestComponent],
                imports: [DxTemplateModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-test-widget') || fixture.nativeElement;
        return DxTestWidget.getInstance(widgetElement);
    }

    // spec
    it('should initialize named templates #17', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test-widget>
                <div *dxTemplate="let d of 'templateName'">Template content</div>
            </dx-test-widget>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture),
            templatesHash = instance.option('integrationOptions.templates');

        expect(templatesHash['templateName']).not.toBeUndefined();
        expect(typeof templatesHash['templateName'].render).toBe('function');

    }));


    it('should add template wrapper class as template has root container', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test-widget testTemplate="templateName">
                <div *dxTemplate="let d of 'templateName'">Template content: {{d}}</div>
            </dx-test-widget>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            innerComponent = testComponent.innerWidgets.first,
            templatesHash = innerComponent.instance.option('integrationOptions.templates'),
            template = innerComponent.testTemplate,
            $container = $('<div>');

        expect(template).not.toBeUndefined;

        templatesHash[template].render({ container: $container });
        fixture.detectChanges();
        expect($container.children().eq(0).hasClass('dx-template-wrapper')).toBe(true);

    }));


    it('should have item index', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test> 
                <div *dxTemplate="let d of 'templateName'; let i = index">index: {{i}}</div>
            </dx-test>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let element = fixture.nativeElement.querySelector('div');
        expect(element.textContent).toBe('index: 5');
    }));

});

