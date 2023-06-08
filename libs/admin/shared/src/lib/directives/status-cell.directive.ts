import {
  Directive,
  Input,
  ElementRef,
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
        this.el.nativeElement.classList.add('chip-contained-default');
        break;
      case 'active':
        this.el.nativeElement.classList.add('chip-contained-active');
        break;
      case 'failed':
        this.el.nativeElement.classList.add('chip-contained-failed');
        break;
      case 'inactive':
        this.el.nativeElement.classList.add('chip-contained-inactive');
        break;

      case 'draft':
        this.el.nativeElement.classList.add('chip-contained-draft');
        break;
      case 'completed':
        this.el.nativeElement.classList.add('chip-contained-completed');
        break;

      case 'success':
        this.el.nativeElement.classList.add('chip-contained-success');
        break;
      case 'warning':
        this.el.nativeElement.classList.add('chip-contained-warning');
        break;
      case 'unavailable':
        this.el.nativeElement.classList.add('chip-contained-unavailable');
        break;
    }

    this.el.nativeElement.innerText = this.status;
  }
}
