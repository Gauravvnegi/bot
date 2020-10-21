import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { forkJoin, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute
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
    forkJoin(
      this._reservationService.getReservationDetails(
        this._reservationService.reservationId
      ),
      of(true)
    ).subscribe(([reservationData, val]) => {
      this._hotelService.hotelConfig = reservationData['hotel'];
      this.isReservationData = true;
      this._templateLoadingService.isTemplateLoading$.next(false);
      this.reservationData = reservationData;
      this._reservationService.reservationData = reservationData;
      this.initPaymentDS();
      // this.setPaymentStatus();
    });
  }

  openFeedback() {
    this.router.navigateByUrl(`/feedback?token=${this.route.snapshot.queryParamMap.get('token')}&entity=feedback`);
  }
}
