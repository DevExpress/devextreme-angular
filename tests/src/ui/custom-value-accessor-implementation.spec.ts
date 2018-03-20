/* tslint:disable:component-selector */

import {
    Component,
    OnInit
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
                <dx-text-box formControlName="formControl" [(ngModel)]="value" (valueChange)="testMethod()"></dx-text-box>
            </div>
        </form>
    `
})
class TestContainerComponent implements OnInit {
    form: FormGroup;
    value = '';
    formControl: AbstractControl;

    ngOnInit() {
        this.form = new FormGroup({
            formControl: new FormControl(''),
        });
        this.formControl = this.form.controls['formControl'];
    }
    testMethod() { }
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
        return DxTextBox['getInstance'](widgetElement) as any;
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

    it('should change the value', async(() => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        fixture.componentInstance.value = 'text';
        fixture.detectChanges();

        expect(instance.option('value')).toBe('text');
    }));

    it('should change touched option', async(() => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        expect(fixture.componentInstance.formControl.touched).toBe(false);

        instance.focus();
        instance.blur();

        expect(fixture.componentInstance.formControl.touched).toBe(true);
    }));

    it('should not fire valueChange event after value changing (T614207)', () => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let component = fixture.componentInstance,
            testSpy = spyOn(component, 'testMethod');

        component.value = 'text';
        fixture.detectChanges();

        expect(testSpy).toHaveBeenCalledTimes(0);
    });
});
