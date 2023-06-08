import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[roomStatus]',
})
export class RoomTypeDirective {
  @Input('roomStatus') roomStatus: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.applyDefaultStyle(this.elementRef);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.applyHoverStyle(this.elementRef);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.applyDefaultStyle(this.elementRef);
  }

  applyHoverStyle(elementRef: ElementRef) {
    elementRef.nativeElement.style.overflow = 'visible';
    elementRef.nativeElement.style.textOverflow = 'unset';
    elementRef.nativeElement.style.whiteSpace = 'normal';
    elementRef.nativeElement.style.position = 'relative';
  }

  applyDefaultStyle(elementRef: ElementRef) {
    elementRef.nativeElement.style.backgroundColor = this.getBackgroundColorByStatus(
      this.roomStatus.toLocaleLowerCase()
    );
    elementRef.nativeElement.style.padding = '7px 11.7px 7.5px 12px';
    elementRef.nativeElement.style.textOverflow = 'ellipsis';
    elementRef.nativeElement.style.overflow = 'hidden';
    elementRef.nativeElement.style.letterSpacing = '0.84px';
    elementRef.nativeElement.style.fontSize = '12px';
    elementRef.nativeElement.style.borderRadius = '8px';
    elementRef.nativeElement.style.textAlign = 'center';
    elementRef.nativeElement.style.color = this.getColorByStatus(
      this.roomStatus.toLocaleLowerCase()
    );
  }

  getColorByStatus(status: string): any {
    switch (status) {
      case 'clean':
        return '#1468f9';
      case 'dirty':
        return '#ff8f00';
      case 'inspected':
        return '#52b33f';
      case 'out_of_order':
        return '#ff0000';
      case 'out_of_service':
        return '#ff0000';
      default:
        return '#ff8f00';
    }
  }

  getBackgroundColorByStatus(status: string): any {
    switch (status) {
      case 'clean':
        return '#ddeafe';
      case 'dirty':
        return '#fdebd1';
      case 'inspected':
        return '#52b33f2e';
      case 'out_of_order':
        return '#f6d6dc';
      case 'out_of_service':
        return '#f6d6dc';
      default:
        return '#fdebd1';
    }
  }
}
