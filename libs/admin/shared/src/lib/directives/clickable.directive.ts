import {
  Directive,
  Input,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({ selector: '[click-allow]' })
export class ClickableDirective implements OnInit {
  constructor(protected elementRef: ElementRef) {}

  ngOnInit() {}

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.classList.add('clickable-card');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.classList.remove('clickable-card');
  }
}
