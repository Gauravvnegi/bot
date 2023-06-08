import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[statusCell]'
})
export class StatusCellDirective implements OnChanges {
  @Input() status: string;
  @Input() type: string;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.status || changes.type) {
      this.updateClasses();
    }
  }

  private updateClasses() {
    this.el.nativeElement.className = 'status-cell';

    switch (this.type) {
      case 'active':
        this.el.nativeElement.classList.add('state-active');
        break;
      case 'inactive':
        this.el.nativeElement.classList.add('state-inactive');
        break;
      case 'temp-inactive':
        this.el.nativeElement.classList.add('state-temp-inactive');
        break;
      case 'draft':
        this.el.nativeElement.classList.add('state-draft');
        break;
      case 'success':
        this.el.nativeElement.classList.add('state-success');
        break;
      case 'fulfilled':
        this.el.nativeElement.classList.add('state-fulfilled');
        break;
      case 'unavailable':
        this.el.nativeElement.classList.add('state-unavailable');
        break;
      case 'temp-unavailable':
        this.el.nativeElement.classList.add('state-temp-unavailable');
        break;
    }

    this.el.nativeElement.innerText = this.status;
  }
}
