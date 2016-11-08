/// <reference path="../../../typings/globals/jasmine/index.d.ts" />

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

    @ViewChildren(DxDataGridComponent) innerWidgets: QueryList<DxDataGridComponent>;
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
});
