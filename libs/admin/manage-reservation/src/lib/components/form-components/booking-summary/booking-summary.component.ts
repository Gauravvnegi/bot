import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OfferData, OfferList, SummaryData } from '../../../models/reservations.model';
import { ControlContainer } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: [
    './booking-summary.component.scss',
    '../../reservation.styles.scss',
  ],
})
export class BookingSummaryComponent implements OnInit {
  reservationId: string;
  @Input() isBooking: boolean;
  @Input() displayBookingOffer: boolean;
  @Input() summaryData: SummaryData;
  @Input() selectedOffer: OfferData;
  @Input() offersList: OfferList;

  @Output() onSubmitBooking: EventEmitter<void> = new EventEmitter<void>();
  @Output() onOfferSelect: EventEmitter<void> = new EventEmitter<void>();
  @Output() onOfferItemSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOfferView: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public controlContainer: ControlContainer,
    public activatedRoute: ActivatedRoute
  ) {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {}

  handleBooking(): void {
    this.onSubmitBooking.emit();
  }

  offerSelect(item?: any): void {
    if (item) {
      this.onOfferItemSelect.emit(item);
    } else {
      this.onOfferSelect.emit();
    }
  }

  handleOfferView(): void {
    this.onOfferView.emit();
  }
}
