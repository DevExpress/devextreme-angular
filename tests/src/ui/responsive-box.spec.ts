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

import DxResponsiveBox from 'devextreme/ui/responsive_box';

import {
    DxResponsiveBoxModule,
    DxResponsiveBoxComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    @ViewChildren(DxResponsiveBoxComponent) innerWidgets: QueryList<DxResponsiveBoxComponent>;
    screenByWidth() {
        return 'sm';
    }
}

describe('DxResponsiveBox', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxResponsiveBoxModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-responsivebox') || fixture.nativeElement;
        return DxResponsiveBox['getInstance'](widgetElement);
    }

    // spec
    it('should be able to accept item locations as dxi components', async(() => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-responsive-box
                        [rows]="[{ ratio: 1 }]"
                        [cols]="[{ ratio: 1 }]"
                        [height]="480"
                        singleColumnScreen="sm"
                        [(screenByWidth)]="screen">
                        <dxi-item>
                            <dxi-location
                                [row]="0"
                                [col]="0"
                                [colspan]="1"
                                screen="lg">
                            </dxi-location>
                            <p>Header</p>
                        </dxi-item>
                    </dx-responsive-box>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);
        fixture.detectChanges();

        expect(instance.option('items')[0].location.length).toBe(1);
        expect(instance.option('items')[0].location[0].row).toBe(0);
        expect(instance.option('items')[0].location[0].col).toBe(0);
        expect(instance.option('items')[0].location[0].colspan).toBe(1);
        expect(instance.option('items')[0].location[0].screen).toBe('lg');
    }));

});
