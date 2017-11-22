/* tslint:disable:component-selector */

import {
    Component,
    ViewChildren,
    QueryList
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxDataGridModule,
    DxDataGridComponent
} from '../../../dist';

import DxDataGrid from 'devextreme/ui/data_grid';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    dataSource = [{
        string: 'String',
        date: new Date(),
        dateString: '1995/01/15',
        boolean: true,
        number: 10
    }];
    columns = [
        { dataField: 'string' },
        { dataField: 'date' },
        { dataField: 'dateString', dataType: 'date' },
        { dataField: 'boolean' },
        { dataField: 'number' }
    ];
    dataSourceWithUndefined = [{ obj: { field: undefined }}];

    @ViewChildren(DxDataGridComponent) innerWidgets: QueryList<DxDataGridComponent>;

    testMethod() {}
}


describe('DxDataGrid', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxDataGridModule]
            });
    });

    // spec
    it('should not fall into infinite loop', (done) => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-data-grid [columns]="columns" [dataSource]="dataSource"></dx-data-grid>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        setTimeout(() => {
            fixture.detectChanges();

            done();
        }, 0);
    });

    it('should react to item option change from undefined', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                <dx-data-grid 
                    [columns]="['obj.field']" 
                    [dataSource]="dataSourceWithUndefined">
                </dx-data-grid>`
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        jasmine.clock().tick(101);

        let testComponent = fixture.componentInstance;

        testComponent.dataSourceWithUndefined[0].obj.field = true;
        fixture.detectChanges();

        let cells = fixture.nativeElement.querySelectorAll('.dx-data-row td');
        let firstCellContent = cells[0].innerText;

        expect(cells.length).toEqual(1);
        expect(firstCellContent).toBe('true');

        jasmine.clock().uninstall();
    });

    it('should fire onToolbarPreparing event', () => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-data-grid (onToolbarPreparing)="testMethod()"></dx-data-grid>'
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(1);
    });

    it('should accept recursive columns defined by nested components', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                <dx-data-grid>
                    <dxi-column caption="Test">
                        <dxi-column dataField="Field"></dxi-column>
                    </dxi-column>
                </dx-data-grid>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance.innerWidgets.first.columns[0].columns).toContain({ dataField: 'Field' });
    });

    it('should destroy devextreme components in template correctly', () => {
        @Component({
            selector: 'test-container-component',
            template: ''
        })
        class TestGridComponent {
            isDestroyed = false;

            onCellPrepared(args) {
                new DxDataGrid(args.cellElement, {
                    onDisposing: () => {
                        this.isDestroyed = true;
                    }
                });
            }
        }

        TestBed.configureTestingModule({
            declarations: [TestGridComponent],
            imports: [DxDataGridModule]
        });

        TestBed.overrideComponent(TestGridComponent, {
            set: {
                template: `
                    <dx-data-grid [dataSource]="[{ text: 1 }]" (onCellPrepared)="onCellPrepared($event)">
                    </dx-data-grid>
                `
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();

        let fixture = TestBed.createComponent(TestGridComponent);
        fixture.detectChanges();
        jasmine.clock().tick(101);

        fixture.destroy();

        expect(fixture.componentInstance.isDestroyed).toBe(true);
        jasmine.clock().uninstall();
    });
});
