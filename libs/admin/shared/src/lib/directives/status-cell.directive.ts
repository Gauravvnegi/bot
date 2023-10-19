import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FlagType } from '../types/table.type';

@Directive({
  selector: '[statusCell]',
})
export class StatusCellDirective implements OnChanges {
  @Input() status: string;
  @Input() type: FlagType;
  @Input() variant: 'contained' | 'outlined' | 'standard' = 'contained';

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.status || changes.type) {
      this.updateClasses();
    }
  }

  private updateClasses() {
    this.el.nativeElement.className = 'status-cell';
    switch (this.type) {
      case 'default':
        this.el.nativeElement.classList.add(`chip-${this.variant}-default`);
        break;

      case 'active':
        this.el.nativeElement.classList.add(`chip-${this.variant}-active`);
        break;

      case 'failed':
        this.el.nativeElement.classList.add(`chip-${this.variant}-failed`);
        break;

      case 'inactive':
        this.el.nativeElement.classList.add(`chip-${this.variant}-inactive`);
        break;

      case 'draft':
        this.el.nativeElement.classList.add(`chip-${this.variant}-draft`);
        break;

      case 'completed':
        this.el.nativeElement.classList.add(`chip-${this.variant}-completed`);
        break;

      case 'success':
        this.el.nativeElement.classList.add(`chip-${this.variant}-success`);
        break;

      case 'warning':
        this.el.nativeElement.classList.add(`chip-${this.variant}-warning`);
        break;

      case 'unavailable':
        this.el.nativeElement.classList.add(`chip-${this.variant}-unavailable`);
        break;

      case 'paid':
        this.el.nativeElement.classList.add(`state-${this.variant}-paid`);
        break;

      case 'unpaid':
        this.el.nativeElement.classList.add(`state-${this.variant}-unpaid`);
        break;
    }

    this.el.nativeElement.innerText = this.status;
  }
}
