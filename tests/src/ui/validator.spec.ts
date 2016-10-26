/// <reference path="../../../typings/globals/jasmine/index.d.ts" />

import {
    Component,
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import DxTextBox from 'devextreme/ui/text_box';

import {
    DxTextBoxModule,
    DxValidatorModule
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    text = 'Some text';
    validationRules = [
        {
            type: 'required',
            message: 'Report number is required.'
        }
    ];
}


describe('DxValidator', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxTextBoxModule, DxValidatorModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-textbox') || fixture.nativeElement;
        return DxTextBox['getInstance'](widgetElement);
    }

    // spec
    it('should work with dx-validator', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-text-box [value]="text">
                        <dx-validator [validationRules]="validationRules"></dx-validator>
                    </dx-text-box>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        fixture.detectChanges();
        expect(instance.element().is('.dx-invalid')).toBe(false);

        testComponent.text = '';
        fixture.detectChanges();
        expect(instance.element().is('.dx-invalid')).toBe(true);

        testComponent.text = 'Some text';
        fixture.detectChanges();
        expect(instance.element().is('.dx-invalid')).toBe(false);
    }));
});
