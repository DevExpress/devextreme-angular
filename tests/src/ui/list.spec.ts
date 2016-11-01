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

import {
    DxItemModule,
} from '../../../dist/core/item';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    items = [1];
    complexItems = [{ text: 'Item 1' }];
    @ViewChildren(DxListComponent) innerWidgets: QueryList<DxListComponent>;
}

describe('DxList', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxListModule, DxItemModule]
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
        instance.option.calls.reset();
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
        instance.option.calls.reset();
    }));

    it('should be able to accept items as a static nested components list', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dx-item>Item 1</dx-item>
                        <dx-item>Item 2</dx-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().find('.dx-list-item-content').length).toBe(2);
        expect(instance.element().find('.dx-list-item-content').eq(0).text()).toBe('Item 1');
        expect(instance.element().find('.dx-list-item-content').eq(1).text()).toBe('Item 2');
    }));

    it('should be able to accept items as an *ngFor components list', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dx-item *ngFor="let item of items">{{item}}</dx-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        expect(instance.option('items').length).toBe(1);
        expect(instance.element().find('.dx-list-item-content').length).toBe(1);
        expect(instance.element().find('.dx-list-item-content').eq(0).text()).toBe('1');

        testComponent.items.push(2);
        fixture.detectChanges();

        expect(instance.option('items').length).toBe(2);
        expect(instance.element().find('.dx-list-item-content').length).toBe(2);
        expect(instance.element().find('.dx-list-item-content').eq(0).text()).toBe('1');
        expect(instance.element().find('.dx-list-item-content').eq(1).text()).toBe('2');
    }));

    it('should respond to items changes rendered with ngFor', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dx-item *ngFor="let item of complexItems">{{item.text}}</dx-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        expect(instance.option('items').length).toBe(1);
        expect(instance.element().find('.dx-list-item-content').length).toBe(1);
        expect(instance.element().find('.dx-list-item-content').eq(0).text()).toBe('Item 1');

        spyOn(instance, 'option').and.callThrough();
        fixture.detectChanges();
        expect(instance.option).not.toHaveBeenCalled;

        testComponent.complexItems.push({ text: 'Item 2' });
        fixture.detectChanges();

        expect(instance.option).toHaveBeenCalled;
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().find('.dx-list-item-content').length).toBe(2);
        expect(instance.element().find('.dx-list-item-content').eq(0).text()).toBe('Item 1');
        expect(instance.element().find('.dx-list-item-content').eq(1).text()).toBe('Item 2');

        instance.option.calls.reset();
        testComponent.complexItems[0].text = 'Changed';
        fixture.detectChanges();

        expect(instance.option).toHaveBeenCalledTimes(0);
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().find('.dx-list-item-content').length).toBe(2);
        expect(instance.element().find('.dx-list-item-content').eq(0).text()).toBe('Changed');
        expect(instance.element().find('.dx-list-item-content').eq(1).text()).toBe('Item 2');
        instance.option.calls.reset();
    }));

});
