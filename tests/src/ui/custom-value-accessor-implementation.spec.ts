import {
    Component,
} from '@angular/core';

import {
    ReactiveFormsModule,
    AbstractControl,
    FormGroup,
    FormControl
} from '@angular/forms';

import {
    TestBed,
    async
} from '@angular/core/testing';

import DxTextBox from 'devextreme/ui/text_box';

import {
    DxTextBoxModule
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: `
        <form [formGroup]="form">
            <div class="form-group">
                <dx-text-box formControlName="formControl"></dx-text-box>
            </div>
        </form>
    `
})
class TestContainerComponent {
    form: FormGroup;
    formControl: AbstractControl;

    ngOnInit() {
        this.form = new FormGroup({
            formControl: new FormControl(''),
        });
        this.formControl = this.form.controls['formControl'];
    }
}

describe('DxTextBox value accessor', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxTextBoxModule, ReactiveFormsModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-textbox') || fixture.nativeElement;
        return DxTextBox['getInstance'](widgetElement);
    }

    // spec
    it('should process disable/enable methods', async(() => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        fixture.componentInstance.formControl.disable();
        fixture.detectChanges();

        expect(instance.option('disabled')).toBe(true);

        fixture.componentInstance.formControl.enable();
        fixture.detectChanges();

        expect(instance.option('disabled')).toBe(false);
    }));
});
