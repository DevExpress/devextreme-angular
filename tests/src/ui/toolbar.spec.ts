/* tslint:disable:component-selector */

import {
    Component,
    ViewChildren,
    QueryList
} from '@angular/core';

import {
    TestBed,
    async
} from '@angular/core/testing';

import DxToolbar from 'devextreme/ui/toolbar';

import {
    DxToolbarModule,
    DxToolbarComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    @ViewChildren(DxToolbarComponent) innerWidgets: QueryList<DxToolbarComponent>;
}

describe('DxToolbar', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxToolbarModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-toolbar') || fixture.nativeElement;
        return DxToolbar['getInstance'](widgetElement);
    }

    // spec
    it('should not initialize the "items" property of an item if no children are declared inside the item (T472434)', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-toolbar>
                        <dxi-item>Item1</dxi-item>
                    </dx-toolbar>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        expect(instance.option('items')[0].items).toBe(undefined);
        expect(instance.element().querySelector('.dx-toolbar-item').textContent).toBe('Item1');
    }));

});
