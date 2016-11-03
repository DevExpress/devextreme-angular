/// <reference path="../../../typings/globals/jasmine/index.d.ts" />

import {
    Component,
    ViewChildren,
    QueryList
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import DxList from 'devextreme/ui/list';

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
    defaultTemplateItems = [{ text: 'test', disabled: false }];
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
        return DxList['getInstance'](widgetElement);
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

        spyOn(instance, 'option').and.callThrough();

        testComponent.items.push(2);
        fixture.detectChanges();

        expect(instance.option).toHaveBeenCalledWith('items', [1, 2]);
    }));

    it('should not react if the same value is assigned to the collection', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-list [items]="items"></dx-list>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        spyOn(instance, 'option').and.callThrough();

        testComponent.items = testComponent.items;
        fixture.detectChanges();

        expect(instance.option).toHaveBeenCalledTimes(1);
    }));

    it('should react to item option change', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-list [(items)]="defaultTemplateItems"></dx-list>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        testComponent.defaultTemplateItems[0].disabled = true;
        fixture.detectChanges();

        let listItem = instance.element().find('.dx-list-item');
        let listItemHasDisabledClass = listItem.hasClass('dx-state-disabled');

        expect(listItem.length).toEqual(1);
        expect(listItemHasDisabledClass).toBeTruthy();
    }));
});
