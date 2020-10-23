import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';

@Component({
  selector: 'hospitality-bot-summary-main',
  templateUrl: './summary-main.component.html',
  styleUrls: ['./summary-main.component.scss']
})
export class SummaryMainComponent implements OnInit {

  reservationData;
  isReservationData = false;
  constructor(
    private _reservationService: ReservationService,
    private _hotelService: HotelService,
    private _templateLoadingService: TemplateLoaderService,
    private _paymentDetailsService: PaymentDetailsService,
  ) { }

  ngOnInit(): void {
    this.getReservationDetails();
  }

  private initPaymentDS() {
    const journey = this._hotelService.getCurrentJourneyConfig();
    this._paymentDetailsService
      .getPaymentConfiguration(this.reservationData.hotel.id, journey.name)
      .subscribe((response) => {
        this._paymentDetailsService.initPaymentDetailDS(
          this.reservationData,
          response
        );
      });
  }

  private getReservationDetails() {
    this._reservationService.getReservationDetails(
      this._reservationService.reservationId
    ).subscribe((reservationData) => {
      this._hotelService.hotelConfig = reservationData['hotel'];
      this.isReservationData = true;
      this._templateLoadingService.isTemplateLoading$.next(false);
      this.reservationData = reservationData;
      this._reservationService.reservationData = reservationData;
      this.initPaymentDS();
    });
  }
}
