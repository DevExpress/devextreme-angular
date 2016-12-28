/* tslint:disable:component-selector */

import {
    Component,
    ViewChildren,
    QueryList
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import DxForm from 'devextreme/ui/form';

import {
    DxFormModule,
    DxFormComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    formData = {
        name: 'Unknown'
    };
    @ViewChildren(DxFormComponent) innerWidgets: QueryList<DxFormComponent>;
}

describe('DxForm', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxFormModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-form') || fixture.nativeElement;
        return DxForm['getInstance'](widgetElement);
    }

    // spec
    it('should be able to accept items via nested dxi components (T459714)', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form id="form" [formData]="formData">
                        <dxi-item dataField="name" editorType="dxTextBox" [template]="null">
                        </dxi-item>
                    </dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.element().find('.dx-textbox').length).toBe(1);
    }));

    it('should be able to accept items recursively', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form id="form" [formData]="formData">
                        <dxi-item caption="Root Group" itemType="group" [template]="null">
                            <dxi-item dataField="name" editorType="dxTextBox" [template]="null">
                            </dxi-item>
                            <dxi-item caption="Inner Group" itemType="group" [template]="null">
                                <dxi-item dataField="name" editorType="dxTextBox" [template]="null">
                                </dxi-item>
                            </dxi-item>
                        </dxi-item>
                    </dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.element().find('.dx-textbox').length).toBe(2);
    }));

});
