import {
  Directive,
  Renderer2,
  Input,
  OnChanges,
  ElementRef,
} from '@angular/core';

import { isEmpty } from 'lodash';

@Directive({ selector: '[file-upload-css]' })
export class FileUploadCssDirective implements OnChanges {
  @Input() url;
  constructor(private _renderer: Renderer2, private elementRef: ElementRef) {}

  ngOnChanges() {
    if (!isEmpty(this.url && this.url.trim())) {
      this.elementRef;
      this._renderer.setStyle(this.elementRef.nativeElement, 'width', '100%');
      this._renderer.setStyle(this.elementRef.nativeElement, 'height', '83%');
    } else {
      this._renderer.removeStyle(this.elementRef.nativeElement, 'width');
    }
  }
}
