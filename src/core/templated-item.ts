import {
  ElementRef
} from '@angular/core';

export default class DxTemplatedItemComponent {
  constructor(private _element: ElementRef) {
      this.template = this.template.bind(this);
  }
  template(item: DxTemplatedItemComponent, index, container) {
    return container.append(this._element.nativeElement);
  }
}

