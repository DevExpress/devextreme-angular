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
    complexItems = [{ text: 'Item 1' }];
    defaultTemplateItems = [{ text: 'test', disabled: false }];
    disabled = false;
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
                        <dxi-item>Item 1</dxi-item>
                        <dxi-item>Item 2</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().find('.dx-item-content').length).toBe(2);
        expect(instance.element().find('.dx-item-content').eq(0).text()).toBe('Item 1');
        expect(instance.element().find('.dx-item-content').eq(1).text()).toBe('Item 2');
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

    it('should use properties of the nested components', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item [disabled]="true">Item 1</dxi-item>
                        <dxi-item>Item 2</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().find('.dx-item').length).toBe(2);
        expect(instance.element().find('.dx-item.dx-state-disabled').length).toBe(1);
    }));

    it('nested component property bindings work', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item [disabled]="disabled">Item 1</dxi-item>
                        <dxi-item>Item 2</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        expect(instance.element().find('.dx-item.dx-state-disabled').length).toBe(0);

        testComponent.disabled = true;
        fixture.detectChanges();

        expect(instance.element().find('.dx-item.dx-state-disabled').length).toBe(1);
    }));

    it('should be able to accept items as an *ngFor components list', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item *ngFor="let item of items">{{item}}</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        expect(instance.option('items').length).toBe(1);
        expect(instance.element().find('.dx-item-content').length).toBe(1);
        expect(instance.element().find('.dx-item-content').eq(0).text()).toBe('1');

        testComponent.items.push(2);
        fixture.detectChanges();

        expect(instance.option('items').length).toBe(2);
        expect(instance.element().find('.dx-item-content').length).toBe(2);
        expect(instance.element().find('.dx-item-content').eq(0).text()).toBe('1');
        expect(instance.element().find('.dx-item-content').eq(1).text()).toBe('2');
    }));

    it('should be able to clear items rendered with *ngFor', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item *ngFor="let item of items">{{item}}</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        expect(instance.option('items').length).toBe(1);
        expect(instance.element().find('.dx-item-content').length).toBe(1);
        expect(instance.element().find('.dx-item-content').eq(0).text()).toBe('1');

        testComponent.items.pop();
        expect(testComponent.items.length).toBe(0);
        fixture.detectChanges();

        expect(instance.option('items').length).toBe(0);
        expect(instance.element().find('.dx-item-content').length).toBe(0);
    }));

    it('should respond to items changes rendered with ngFor', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item *ngFor="let item of complexItems">{{item.text}}</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = getWidget(fixture);

        expect(instance.option('items').length).toBe(1);
        expect(instance.element().find('.dx-item-content').length).toBe(1);
        expect(instance.element().find('.dx-item-content').eq(0).text()).toBe('Item 1');

        spyOn(instance, 'option').and.callThrough();
        fixture.detectChanges();
        expect(instance.option).not.toHaveBeenCalled;

        testComponent.complexItems.push({ text: 'Item 2' });
        fixture.detectChanges();

        expect(instance.option).toHaveBeenCalled;
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().find('.dx-item-content').length).toBe(2);
        expect(instance.element().find('.dx-item-content').eq(0).text()).toBe('Item 1');
        expect(instance.element().find('.dx-item-content').eq(1).text()).toBe('Item 2');

        instance.option.calls.reset();
        testComponent.complexItems[0].text = 'Changed';
        fixture.detectChanges();

        expect(instance.option).toHaveBeenCalledTimes(0);
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().find('.dx-item-content').length).toBe(2);
        expect(instance.element().find('.dx-item-content').eq(0).text()).toBe('Changed');
        expect(instance.element().find('.dx-item-content').eq(1).text()).toBe('Item 2');
        instance.option.calls.reset();
    }));

    it('should be able to set option "template" for each item', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item [template]="'testTemplate'"></dxi-item>

                        <div *dxTemplate="let item of 'testTemplate'">testTemplate</div>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.element().find('.dx-item-content').eq(0).text()).toBe('testTemplate');
    }));
});
