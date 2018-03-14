/* tslint:disable:component-selector */

import {
    Component,
    ViewChildren,
    QueryList
} from '@angular/core';

import { TestBed } from '@angular/core/testing';

import DxAccordion from 'devextreme/ui/accordion';

import {
    DxAccordionModule,
    DxAccordionComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    items = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }];
    selectedItem = this.items[0];
    selectedIndex = 0;

    @ViewChildren(DxAccordionComponent) innerWidgets: QueryList<DxAccordionComponent>;
}

describe('DxAccordion', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxAccordionModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-accordion') || fixture.nativeElement;
        return DxAccordion['getInstance'](widgetElement) as any;
    }

    it('should change bound options', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-accordion [items]="items" [(selectedIndex)]="selectedIndex" [(selectedItem)]="selectedItem">
                    </dx-accordion>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let accordion = fixture.componentInstance;
        let instance = getWidget(fixture);

        expect(instance.option('selectedIndex')).toBe(0);
        expect(instance.option('selectedItem')).toBe(accordion.items[0]);
        expect(accordion.selectedIndex).toBe(0);
        expect(accordion.selectedItem).toBe(accordion.items[0]);

        accordion.selectedIndex = 1;
        fixture.detectChanges();

        expect(instance.option('selectedIndex')).toBe(1);
        expect(instance.option('selectedItem')).toBe(accordion.items[1]);
        expect(accordion.selectedIndex).toBe(1);
        expect(accordion.selectedItem).toBe(accordion.items[1]);
    });
});
