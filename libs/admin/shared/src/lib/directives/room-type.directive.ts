import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { RoomStatus } from 'libs/admin/room/src/lib/types/service-response';

@Directive({
  selector: '[roomStatus]',
})
export class RoomTypeDirective {
  @Input('roomStatus') roomStatus: RoomStatus;

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
      this.roomStatus
    );
    elementRef.nativeElement.style.padding = '7px 11.7px 7.5px 12px';
    elementRef.nativeElement.style.textOverflow = 'ellipsis';
    elementRef.nativeElement.style.overflow = 'hidden';
    elementRef.nativeElement.style.letterSpacing = '0.84px';
    elementRef.nativeElement.style.fontSize = '12px';
    elementRef.nativeElement.style.borderRadius = '8px';
    elementRef.nativeElement.style.textAlign = 'center';
    elementRef.nativeElement.style.color = this.getColorByStatus(
      this.roomStatus
    );
  }

  getColorByStatus(status: RoomStatus): any {
    switch (status) {
      case 'CLEAN':
        return '#1468f9';
      case 'DIRTY':
        return '#ff8f00';
      case 'INSPECTED':
        return '#52b33f';
      case 'OUT_OF_ORDER':
        return '#ff0000';
      case 'OUT_OF_SERVICE':
        return '#ff0000';
      default:
        return '#ff8f00';
    }
  }

  getBackgroundColorByStatus(status: RoomStatus): any {
    switch (status) {
      case 'CLEAN':
        return '#ddeafe';
      case 'DIRTY':
        return '#fdebd1';
      case 'INSPECTED':
        return '#52b33f2e';
      case 'OUT_OF_ORDER':
        return '#f6d6dc';
      case 'OUT_OF_SERVICE':
        return '#f6d6dc';
      default:
        return '#fdebd1';
    }
  }
}
