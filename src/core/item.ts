import {
  Component,
  ElementRef,
  NgModule
} from '@angular/core';

@Component({
  selector: 'dx-item',
  template: `<ng-content></ng-content>`
})
export class DxItemComponent {
  constructor(private _element: ElementRef) {
      this.template = this.template.bind(this);
  }
  template(item: DxItemComponent, index, container) {
    return container.append(this._element.nativeElement);
  }
}

@NgModule({
  imports: [],
  declarations: [
    DxItemComponent
  ],
  exports: [
    DxItemComponent
  ],
})
export class DxItemModule { }
