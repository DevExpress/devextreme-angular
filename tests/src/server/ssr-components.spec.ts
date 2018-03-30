/* tslint:disable:component-selector */

import {
    Component
} from '@angular/core';
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
    });
});
