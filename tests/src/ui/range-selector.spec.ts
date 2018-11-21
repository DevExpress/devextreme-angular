/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxRangeSelectorModule, DxRangeSelectorComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    value = {startValue: 0, endValue: 10};
    count = 0;
    @ViewChild('rangeSelector') rangeSelector: DxRangeSelectorComponent;
    onChanged(e) {
        this.count++;
    }
}

describe('DxRangeSelector', () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxRangeSelectorModule]
            });
    });

    it('value binding should work', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                <dx-range-selector (onOptionChanged)="onChanged($event)" [value]="value"></dx-range-selector>
                <dx-range-selector #rangeSelector [(value)]="value"></dx-range-selector>`
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let component: TestContainerComponent = fixture.componentInstance;
        component.rangeSelector.value = {startValue: 0, endValue: 6};
        fixture.detectChanges();
        component.rangeSelector.value = {startValue: 0, endValue: 5};
        fixture.detectChanges();
        expect(fixture.componentInstance.count).toBe(4);
    });
});
