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

