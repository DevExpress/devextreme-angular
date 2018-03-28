/* tslint:disable:component-selector */

import {
    Component,
    PLATFORM_ID
} from '@angular/core';

import { isPlatformServer } from '@angular/common';

import { TransferState, makeStateKey } from '@angular/platform-browser';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxButtonModule
} from '../../../dist';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
}

describe('Universal', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxButtonModule]
            });
    });

    // spec
    it('should render button', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-button></dx-button>`
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        expect(fixture.detectChanges.bind(fixture)).not.toThrow();
    });

    it('should set transfer state for rendererdOnServer option of integration', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-button></dx-button>`
            }
        });
        let platformID = TestBed.get(PLATFORM_ID);
        if (isPlatformServer(platformID)) {
            let fixture = TestBed.createComponent(TestContainerComponent);
            fixture.detectChanges();

            const transferState: TransferState = TestBed.get(TransferState);
            const PLATFORM = 'platformServer';
            let key = makeStateKey(PLATFORM);

            expect(transferState.hasKey(key)).toBe(true);
            expect(transferState.get(key, null as any)).toEqual(true);
        }
    });
});
