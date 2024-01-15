import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { DetailsTabOptions } from '@hospitality-bot/admin/reservation';
import { BookingDetailService } from '../services/booking-detail.service';

@Directive({
  selector: '[guest-details-sidebar]',
})
export class GuestDetailsDirective {
  @Input() bookingId: string;
  @Input() guestId: string;
  @Input() tabKey: DetailsTabOptions;
  constructor(
    private bookingDetailService: BookingDetailService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  @HostListener('mouseenter') onMouseEnter() {
    // Add styles for mouse enter (hover) event
    if (this.guestId || this.bookingId) {
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
      this.renderer.setStyle(this.el.nativeElement, 'color', 'darkblue');
      this.renderer.setStyle(
        this.el.nativeElement,
        'text-decoration',
        'underline'
      );
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    // Add styles for mouse leave event
    this.renderer.removeStyle(this.el.nativeElement, 'cursor');
    this.renderer.removeStyle(this.el.nativeElement, 'color');
    this.renderer.removeStyle(this.el.nativeElement, 'text-decoration');
  }
  @HostListener('click') onClick() {
    if (this.guestId || this.bookingId)
      this.bookingDetailService.openBookingDetailSidebar({
        ...(this.bookingId && { bookingId: this.bookingId }),
        ...(this.guestId && { guestId: this.guestId }),
        ...(this.tabKey && { tabKey: this.tabKey }),
      });
  }
}
