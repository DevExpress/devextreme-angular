/* tslint:disable:component-selector */

import {
    Component
} from '@angular/core';
import {
    TestBed
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

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [
                DevExtremeModule
            ]
        });
    });

    // spec
    it('should render all components', () => {
        // TODO: Fix drawer on a server side
        let filteredComponentNames = componentNames.filter(name => name !== 'drawer');

        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    ${filteredComponentNames.map((name) => `<dx-${name}></dx-${name}>`).join('')}
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        expect(fixture.detectChanges.bind(fixture)).not.toThrow();
    });
});
