import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { ThankYouService } from 'libs/web-user/shared/src/lib/services/thank-you.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-thank-you',
  templateUrl: './thank-you-main.component.html',
  styleUrls: ['./thank-you-main.component.scss'],
})
export class ThankYouMainComponent implements OnInit {
  isReservationData: boolean = false;
  reservationData: ReservationDetails;
  $subscription: Subscription = new Subscription();
  config = {
    icon: 'assets/thanku.png',
    title: 'Thank You!',
    description: '',
    emailInfo: {
      icon: 'assets/email_thanku.png',
      description: '',
    },
  };
  headerTitle: string = '';
  state: string;

  constructor(
    protected route: ActivatedRoute,
    protected _templateLoadingService: TemplateLoaderService,
    protected _reservationService: ReservationService,
    protected _hotelService: HotelService,
    protected _thankyouService: ThankYouService,
    protected _snackBarService: SnackBarService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
  }

  protected getReservationDetails() {
    this.$subscription.add(
      this._reservationService
        .getReservationDetails(this._reservationService.reservationId)
        .subscribe((reservationData) => {
          this._hotelService.hotelConfig = reservationData['hotel'];
          this._hotelService.titleConfig$.next(reservationData['hotel']);
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
      this._thankyouService
        .explore(this._reservationService.reservationId)
        .subscribe(
          (response) => {
            if (response.botRedirectUrl) {
              window.location.href = `https://${response.botRedirectUrl}`;
            } else {
              window.location.href = response.websiteUrl;
            }
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
          }
        )
    );
  }

  getState() {
    this.state = this.route.snapshot.queryParamMap.get('state');
    let { title } = this._hotelService.getCurrentJourneyConfig();
    this.headerTitle = title;
    this.config.description = `Your ${title} is completed successfully`;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
