/// <reference path="../../../typings/globals/jasmine/index.d.ts" />

declare var DevExpress: any;
declare var $: any;

import {
    Component,
    ViewChildren,
    QueryList
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import {
    DxListModule,
    DxListComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    items = [1];
    @ViewChildren(DxListComponent) innerWidgets: QueryList<DxListComponent>;
}


describe('DxList', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxListModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-list') || fixture.nativeElement;
        return DevExpress.ui.dxList.getInstance(widgetElement);
    }

    // spec
    it('should react to collection change', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-list [items]="items"></dx-list>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        let spy = jasmine.createSpy('option change');
        instance.option = spy;

        testComponent.items.push(2);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith('items', [1, 2]);
    }));
});
