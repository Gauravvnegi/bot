import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appNumber]',
})
export class NumberDirective {
  @Input() regexStr = /^[0-9]+(\.[0-9]{0,2}){0,1}$/;
  private regex: RegExp = new RegExp(this.regexStr);
  private specialKeys: Array<string> = ['Backspace', 'ArrowLeft', 'ArrowRight'];
  constructor(private el: ElementRef) {}
  @HostListener('keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current = this.el.nativeElement.value;
    const next = current.concat(event.key);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
