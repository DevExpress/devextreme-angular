/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import {
    DxTabPanelModule,
    DxTabPanelComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: `
    <dx-tab-panel 
        [dataSource]="tabPanelItems"
        [selectedIndex]="selectedIndex">
    </dx-tab-panel>
    `
})
class TestContainerComponent {
    @ViewChild(DxTabPanelComponent) tabPanel: DxTabPanelComponent;

    tabPanelItems: number[] = [0];
    selectedIndex = 0;
}

describe('DxTagBox', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxTabPanelModule]
            });
    });

    // spec
    it('option, dependenced on dataSource, slould be applyed', async(() => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let component: any = fixture.componentInstance;
        component.tabPanelItems.push(1);
        component.selectedIndex = 1;
        fixture.detectChanges();

        let instance: any = component.tabPanel.instance;
        expect(instance.option('items').length).toBe(2);
        expect(instance.option('selectedIndex')).toBe(1);
    }));
});
