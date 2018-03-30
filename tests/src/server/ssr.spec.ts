/* tslint:disable:component-selector */

import {
    Component,
    PLATFORM_ID
} from '@angular/core';

import { isPlatformServer } from '@angular/common';

import { TransferState } from '@angular/platform-browser';

import { IS_PLATFORM_SERVER } from '../../../dist';

import {
    TestBed,
    async
} from '@angular/core/testing';

import {
    DevExtremeModule
} from '../../../dist';

import {
    componentNames
} from './component-names';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    renderedOnServer: false;
    initializedHandler(e) {
        this.renderedOnServer = e.component.option('integrationOptions.renderedOnServer');
    }
}

describe('Universal', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [
                DevExtremeModule
            ]
        });
    }));

    // spec
    componentNames.forEach((componentName) => {
        it('should render ' + componentName, async(() => {
            TestBed.overrideComponent(TestContainerComponent, {
                set: {
                    template: `<dx-${componentName}></dx-${componentName}>`
                }
            });

            let fixture = TestBed.createComponent(TestContainerComponent);
            expect(fixture.detectChanges.bind(fixture)).not.toThrow();
        }));

        
        it('should set transfer state for rendererdOnServer option of integration for ' + componentName, async(() => {
            TestBed.overrideComponent(TestContainerComponent, {
                set: {
                    template: `<dx-${componentName}></dx-${componentName}>`
                }
            });
            let platformID = TestBed.get(PLATFORM_ID);
            if (isPlatformServer(platformID)) {
                let fixture = TestBed.createComponent(TestContainerComponent);
                fixture.detectChanges();

                const transferState: TransferState = TestBed.get(TransferState);

                expect(transferState.hasKey(IS_PLATFORM_SERVER)).toBe(true);
                expect(transferState.get(IS_PLATFORM_SERVER, null as any)).toEqual(true);
            }
        }));

        it('should set rendererdOnServer option of integration for ' + componentName, async(() => {
            TestBed.overrideComponent(TestContainerComponent, {
                set: {
                    template: `<dx-${componentName} (onInitialized)="initializedHandler($event)"></dx-${componentName}>`
                }
            });
    
            let fixture = TestBed.createComponent(TestContainerComponent);
            const transferState: TransferState = TestBed.get(TransferState);
    
            transferState.set(IS_PLATFORM_SERVER, true as any);
    
            fixture.detectChanges();
    
            expect(fixture.componentInstance.renderedOnServer).toBe(true);
        }));
    });
});
