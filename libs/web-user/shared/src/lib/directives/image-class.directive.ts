import {
  Directive,
  HostListener,
  Renderer2,
  HostBinding,
  ElementRef,
  Input,
} from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

@Directive({ selector: '[imageClass]' })
export class ImageClassDirective {
  @Input() styleConfig;
  @HostListener('click', ['$event'])
  clickEvent(event) {
    if (
      this._elemRef.nativeElement.classList.contains('service-background-color')
    ) {
      this.renderer.removeClass(
        event.currentTarget,
        'service-background-color'
      );

      this.renderer.removeStyle(
        this._elemRef.nativeElement,
        'background-color'
      );
    } else {
      this.renderer.addClass(
        this._elemRef.nativeElement,
        'service-background-color'
      );
      this.renderer.setStyle(
        this._elemRef.nativeElement,
        'background-color',
        this.styleConfig
      );
    }
  }

  constructor(private renderer: Renderer2, private _elemRef: ElementRef) {}

  ngOnInit() {}
}
