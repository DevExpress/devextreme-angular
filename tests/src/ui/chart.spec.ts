/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxChartModule, DxChartComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    @ViewChild(DxChartComponent) chart: DxChartComponent;
}

describe('DxChart', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxChartModule]
            });
    });

    // spec
    it('visualizsation widgets should have display:"block" style', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-chart [dataSource]="[]"></dx-chart>`
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

         let outerComponent = fixture.componentInstance,
             chart = outerComponent.chart,
             element: any = chart.instance.element();

        expect(element.css('display')).toBe('block');
    });
});
