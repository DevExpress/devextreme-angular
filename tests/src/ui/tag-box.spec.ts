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
    DxTagBoxModule,
    DxTagBoxComponent
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    @ViewChild(DxTagBoxComponent) tagBox: DxTagBoxComponent;

    value: number[] = [];
    testMethod() {}
}

describe('DxTagBox', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxTagBoxModule]
            });
    });

    // spec
    it('value change should be fired once', async(() => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-tag-box [items]="[1, 2, 3]" [(value)]="value" (onValueChanged)="testMethod()">
                    </dx-tag-box>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        expect(testSpy).toHaveBeenCalledTimes(0);

        let instance: any = fixture.componentInstance.tagBox.instance;
        instance.option('value', [2]);

        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(1);
    }));
});
