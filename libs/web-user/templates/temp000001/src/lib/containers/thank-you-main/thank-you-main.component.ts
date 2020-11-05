import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { forkJoin, of } from 'rxjs';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-thank-you',
  templateUrl: './thank-you-main.component.html',
  styleUrls: ['./thank-you-main.component.scss'],
})
export class ThankYouMainComponent implements OnInit {

  isReservationData = false;
  reservationData: ReservationDetails;
  config = {
    icon: 'assets/thanku.png',
    title: 'Thank You!',
    description: '',
    emailInfo: {
      icon: 'assets/email_thanku.png',
      description: ''
    },
  };
  headerTitle = '';
  state: string;

  constructor(
    private route: ActivatedRoute,
    private _templateLoadingService: TemplateLoaderService,
    private _reservationService: ReservationService,
    private _hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
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
      this.reservationData = reservationData;
      this._reservationService.reservationData = reservationData;
      this._templateLoadingService.isTemplateLoading$.next(false);
      this.getState();
    });
  }

  getState() {
    this.state = this.route.snapshot.queryParamMap.get('state');
    switch (this.state) {
      case 'feedback':
        this.config.description = "Your feedback is completed successfully";
        this.headerTitle = 'Feedback';
        break;

      default:
        let { title } = this._hotelService.getCurrentJourneyConfig();
        this.headerTitle = title;
        this.config.description = `Your ${title} is completed successfully`;
        break;
    }
  }
}
