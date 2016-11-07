/// <reference path="../../../typings/globals/jasmine/index.d.ts" />

import {
    Component,
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import DxSelectBox from 'devextreme/ui/select_box';

import {
    DxSelectBoxModule,
    DxTextBoxModule,
    DxTemplateModule
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
}

describe('DxSelectBox', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxSelectBoxModule, DxTextBoxModule, DxTemplateModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-selectbox') || fixture.nativeElement;
        return DxSelectBox['getInstance'](widgetElement);
    }

    // spec
    it('field template should work', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-select-box fieldTemplate="myTemplate">
                        <div *dxTemplate="let data of 'myTemplate'">
                            <dx-text-box [value]="data"></dx-text-box>
                        </div>
                    </dx-select-box>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        expect(instance.element().find('.dx-textbox').length).toBe(1);
    }));
});
