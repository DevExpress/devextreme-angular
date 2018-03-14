/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxAccordionModule,
    DxAccordionComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: `
        <dx-accordion
            [items]="items"
            [(selectedIndex)]="selectedIndex"
            [(selectedItem)]="selectedItem"
        ></dx-accordion>
    `
})
class TestContainerComponent {
    @ViewChild(DxAccordionComponent) accordion: DxAccordionComponent;

    items = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }];
    selectedItem = this.items[0];
    selectedIndex = 0;
}

describe('DxAccordion', () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxAccordionModule]
            });
    });

    it('should change bound options', () => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let component: TestContainerComponent = fixture.componentInstance;
        let instance: any = component.accordion.instance;

        expect(instance.option('selectedIndex')).toBe(0);
        expect(instance.option('selectedItem')).toBe(component.items[0]);
        expect(component.selectedIndex).toBe(0);
        expect(component.selectedItem).toBe(component.items[0]);

        component.selectedIndex = 1;
        fixture.detectChanges();

        expect(instance.option('selectedIndex')).toBe(1);
        expect(instance.option('selectedItem')).toBe(component.items[1]);
        expect(component.selectedIndex).toBe(1);
        expect(component.selectedItem).toBe(component.items[1]);
    });
});
