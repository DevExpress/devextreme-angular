/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed,
    ComponentFixture
} from '@angular/core/testing';

import {
    DxFormModule,
    DxTagBoxModule,
    DxFormComponent
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    formData = {
        name: 'Unknown',
        date: new Date()
    };
    labelValues = [{ name: 'label1' }, { name: 'label2' }];
    formData1 = { labels: this.labelValues };
    @ViewChild(DxFormComponent) formComponent: DxFormComponent;

    validateForm() {
        return true;
    }
}

describe('DxForm', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxFormModule, DxTagBoxModule]
            });
    });

    function getWidget(fixture: ComponentFixture<TestContainerComponent>) {
        return fixture.componentInstance.formComponent.instance;
    }

    // spec
    it('should be able to accept items via nested dxi components (T459714)', () => {
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
        expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(1);
    });

    it('should be able to accept items recursively', () => {
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
        expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(2);
    });

    it('should be able to accept items via nested dxi components with comment from ngIf directive (#440)', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form id="form" [formData]="formData">
                        <dxi-item dataField="name" editorType="dxTextBox">
                            <dxi-validation-rule
                                *ngIf="true"
                                type="required"
                                message="item is required."
                            ></dxi-validation-rule>
                        </dxi-item>
                    </dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(1);
    });

    it('should update model after editor value was changed', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form [formData]="formData">
                        <dxi-item dataField="name" editorType="dxTextBox">
                        </dxi-item>
                    </dx-form>
                    <span id="text">{{formData.name}}<span>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.autoDetectChanges();

        let instance = getWidget(fixture);
        let input = instance.element().querySelector('input');
        input.value = 'test value';
        input.dispatchEvent(new Event('change'));

        expect(document.getElementById('text').innerText.trim()).toBe('test value');
        fixture.autoDetectChanges(false);
    });

    it('should work with dxTagBox', () => {
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
    });

    it('should work with custom validation and ngIf', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form [formData]="{ text: 1 }">
                        <dxi-item itemType="group" *ngIf="true">
                            <dxi-item dataField="text">
                                <dxi-validation-rule type="custom" [validationCallback]="validateForm">
                                </dxi-validation-rule>
                            </dxi-item>
                        </dxi-item>
                    </dx-form>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let formInstance = getWidget(fixture);
        expect(formInstance.validate()).toBeDefined();
    });

    it('should not call resetOption for rerendered nested collection components', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form [formData]="formData1">
                        <dxi-item itemType="group"
                            name="label-container">
                            <dxi-item [dataField]="'labels[' + i + ']'" *ngFor="let labelValue of labelValues; let i = index">
                                <dxo-label [text]="labelValue.name"></dxo-label>
                            </dxi-item>
                        </dxi-item>
                    </dx-form>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        let formInstance = getWidget(fixture);
        let spy = spyOn(formInstance, 'resetOption');

        fixture.componentInstance.labelValues = [{ name: 'label1' }, { name: 'label2' }, { name: 'label3' }];
        fixture.detectChanges();

        expect(spy.calls.count()).toBe(0);
        expect(formInstance.option('items[0].items[0].label.text')).toBe('label1');
    });

    it('should not call resetOption for rerendered nested components', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form [formData]="formData1">
                        <dxi-item [dataField]="'labels[' + i + ']'"  *ngFor="let labelValue of labelValues; let i = index">
                            <dxo-label [text]="labelValue.name"></dxo-label>
                        </dxi-item>
                    </dx-form>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let formInstance = getWidget(fixture);
        let spy = spyOn(formInstance, 'resetOption');

        fixture.componentInstance.labelValues = [{ name: 'label1' }, { name: 'label2' }, { name: 'label3' }];
        fixture.detectChanges();

        expect(spy.calls.count()).toBe(0);
        expect(formInstance.option('items[0].label.text')).toBe('label1');
    });

    it('should change the value of dxDateBox', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-form [formData]="formData">
                    </dx-form>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        fixture.componentInstance.formData.date = new Date(2017, 0, 1);
        fixture.detectChanges();

        let formInstance = getWidget(fixture);
        let dateBoxInstance = formInstance.getEditor('date');

        expect(dateBoxInstance.option('value')).toEqual(new Date(2017, 0, 1));
    });
});
