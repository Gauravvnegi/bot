import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { ThankYouService } from 'libs/web-user/shared/src/lib/services/thank-you.service';
import { SnackBarService } from 'libs/shared/material/src';

@Component({
  selector: 'hospitality-bot-thank-you',
  templateUrl: './thank-you-main.component.html',
  styleUrls: ['./thank-you-main.component.scss'],
})
export class ThankYouMainComponent implements OnInit {

  isReservationData = false;
  reservationData: ReservationDetails;
  $subscription: Subscription = new Subscription();
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
    private _hotelService: HotelService,
    private _thankyouService: ThankYouService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
  }

  private getReservationDetails() {
    this.$subscription.add(
      this._reservationService.getReservationDetails(
        this._reservationService.reservationId
      ).subscribe((reservationData) => {
        this._hotelService.hotelConfig = reservationData['hotel'];
        this.isReservationData = true;
        this.reservationData = reservationData;
        this._reservationService.reservationData = reservationData;
        this._templateLoadingService.isTemplateLoading$.next(false);
        this.getState();
      })
    );
  }

  explore() {
    this.$subscription.add(
      this._thankyouService.explore(this._reservationService.reservationId)
        .subscribe((response) => {
          window.location.href = `https://${response.botRedirectUrl}`;
        }, ({ error }) => this._snackbarService.openSnackBarAsText(error))
    );
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

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
