import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { FeedbackDetailsService } from 'libs/web-user/shared/src/lib/services/feedback-details.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { forkJoin, of, Subscription, Observable } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { IFeedbackConfigResObj } from '../../types/feedback';

@Component({
  selector: 'hospitality-bot-feedback-main',
  templateUrl: './feedback-main.component.html',
  styleUrls: ['./feedback-main.component.scss'],
})
export class FeedbackMainComponent implements OnInit {
  private $subscription: Subscription = new Subscription();
  paymentStatusData;
  isReservationData = false;
  parentForm: FormGroup;
  reservationDetails: ReservationDetails;

  feedbackConfig$: Observable<IFeedbackConfigResObj>;

  @ViewChild('saveButton') saveButton;
  constructor(
    private _reservationService: ReservationService,
    private _hotelService: HotelService,
    private _templateLoadingService: TemplateLoaderService,
    private fb: FormBuilder,
    private _feedbackDetailsService: FeedbackDetailsService,
    private _buttonService: ButtonService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
    this.parentForm = this.fb.group({});
  }

  private getReservationDetails() {
    this.$subscription.add(
      forkJoin(
        this._reservationService.getReservationDetails(
          this._reservationService.reservationId
        ),
        of(true)
      ).subscribe(([reservationData, val]) => {
        this._hotelService.hotelConfig = reservationData['hotel'];
        this.isReservationData = true;
        this.reservationDetails = reservationData;
        this._reservationService.reservationData = reservationData;
        this._templateLoadingService.isTemplateLoading$.next(false);
        this.getFeedBackConfig();
      })
    );
  }

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
  }

  getFeedBackConfig() {
    this.feedbackConfig$ = this._feedbackDetailsService.getHotelFeedbackConfig({
      hotelId: this._hotelService.hotelId,
    });
  }

  saveFeedbackDetails() {
    const status = this._feedbackDetailsService.validateFeedbackDetailForm(
      this.parentForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      this._buttonService.buttonLoading$.next(this.saveButton);
      return;
    }

    let value = this.parentForm.getRawValue();
    let data = this._feedbackDetailsService.mapFeedbackData(
      value && value.feedbackDetail,
      this._reservationService.reservationData.guestDetails.primaryGuest.id
    );

    this.$subscription.add(
      this._feedbackDetailsService
        .addFeedback(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            // this._snackBarService.openSnackBarAsText('Feedback successful', '', {
            //   panelClass: 'success',
            // });
            this._buttonService.buttonLoading$.next(this.saveButton);
            this.openThankyouPage('feedback');
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            this._buttonService.buttonLoading$.next(this.saveButton);
          }
        )
    );
  }

  openThankyouPage(state) {
    this.router.navigateByUrl(
      `/thankyou?token=${this.route.snapshot.queryParamMap.get(
        'token'
      )}&entity=thankyou&state=${state}`
    );
  }

  private performActionIfNotValid(status: any[]) {
    this._translateService
      .get(`VALIDATION.${status[0].code}`)
      .subscribe((translatedMsg) => {
        this._snackBarService.openSnackBarAsText(translatedMsg);
      });
    return;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
