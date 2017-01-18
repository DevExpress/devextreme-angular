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
    DxTagBoxModule,
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
                imports: [DxFormModule, DxTagBoxModule]
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
                        <dxi-item dataField="name" editorType="dxTextBox"></dxi-item>
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
                        <dxi-item caption="Root Group" itemType="group">
                            <dxi-item dataField="name" editorType="dxTextBox"></dxi-item>
                            <dxi-item caption="Inner Group" itemType="group">
                                <dxi-item dataField="name" editorType="dxTextBox"></dxi-item>
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

    it('should work with dxTagBox', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form 
                        [formData]="{}"
                        [items]="[{
                            dataField: 'name', 
                            editorType: 'dxTagBox', 
                            editorOptions: { 
                                dataSource: [{ value: 1, text: 'item 1' }, { value: 2, text: 'item 2' }, { value: 3, text: 'item 3' }],
                                displayExpr: 'text',
                                valueExpr: 'value'
                            } 
                        }]"></dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let formInstance = getWidget(fixture);
        let tagBoxInstance = formInstance.getEditor('name');

        tagBoxInstance.option('value', [2]);
        fixture.detectChanges();

        expect(formInstance.option('formData.name')).toEqual([2]);
    }));
});
