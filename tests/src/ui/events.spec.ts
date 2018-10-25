/* tslint:disable:component-selector */

import {
    Component, NgZone
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxDataGridModule
} from '../../../dist';

import * as readyCallbacks from 'devextreme/core/utils/ready_callbacks';
import * as events from 'devextreme/events';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
}


describe('global events', () => {

    // spec
    it('should be subscribed within Angular Zone', () => {
        let readyCallbacksCalls = 0;
        readyCallbacks.fire();

        readyCallbacks.add(() => {
            readyCallbacksCalls++;
            NgZone.assertInAngularZone();
        });
        expect(readyCallbacksCalls).toBe(0);

        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [DxDataGridModule]
        });

        TestBed.overrideComponent(TestContainerComponent, {
            set: { template: `` }
        });

        TestBed.createComponent(TestContainerComponent);
        expect(readyCallbacksCalls).toBe(1);
    });

});

describe('events', () => {

    it('should be fired within Angular Zone', () => {
        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [DxDataGridModule]
        });

        TestBed.overrideComponent(TestContainerComponent, {
            set: { template: `
                <div class="elem"><div>
            ` }
        });

        const fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        const element = fixture.nativeElement.querySelector('.elem');
        let counter = 0;
        fixture.ngZone.runOutsideAngular(() => {
            events.on(element, 'click', () => {
                expect(NgZone.isInAngularZone()).toBe(true);
                counter++;
            });
        });

        element.click();
        expect(counter).toBe(1);
    });

});
