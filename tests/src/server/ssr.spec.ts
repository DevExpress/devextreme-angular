/* tslint:disable:component-selector */

import {
    Component,
    PLATFORM_ID
} from '@angular/core';

import { isPlatformServer } from '@angular/common';

import { TransferState, makeStateKey } from '@angular/platform-browser';

import DxButton from 'devextreme/ui/button';

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

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-button') || fixture.nativeElement;
        return DxButton['getInstance'](widgetElement) as any;
    }

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

    it('should set rendererdOnServer option of integration', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-button></dx-button>`
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        const transferState: TransferState = TestBed.get(TransferState);
        const IS_PLATFORM_SERVER = 'isPlatformServer';
        let key = makeStateKey(IS_PLATFORM_SERVER);
        transferState.set(key, true as any);

        fixture.detectChanges();

        let instance = getWidget(fixture);

        expect(instance.option('integrationOptions.renderedOnServer')).toBe(true);
    });
});
