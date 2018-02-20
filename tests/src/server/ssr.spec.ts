/* tslint:disable:component-selector */

import {
    Component
} from '@angular/core';

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

});
