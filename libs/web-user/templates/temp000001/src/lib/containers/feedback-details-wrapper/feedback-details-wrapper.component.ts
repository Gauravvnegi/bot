import { Component, ViewChild } from '@angular/core';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { FeedbackDetailsService } from './../../../../../../shared/src/lib/services/feedback-details.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { Observable } from 'rxjs';
import { IFeedbackConfigResObj } from '../../types/feedback';
import { FeedbackDetailsComponent } from '../feedback-details/feedback-details.component';

@Component({
  selector: 'hospitality-bot-feedback-details-wrapper',
  templateUrl: './feedback-details-wrapper.component.html',
  styleUrls: ['./feedback-details-wrapper.component.scss'],
})
export class FeedbackDetailsWrapperComponent extends BaseWrapperComponent {
  feedbackConfig$: Observable<IFeedbackConfigResObj>;
  @ViewChild('feedbackDetail')
  feedbackDetailCmp: FeedbackDetailsComponent;
  constructor(
    private _feedbackDetailsService: FeedbackDetailsService,
    private _reservationService: ReservationService,
    private _hotelService: HotelService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getFeedBackConfig();
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
      this._buttonService.buttonLoading$.next(this.buttonRefs['submitButton']);
      return;
    }

    let value = this.parentForm.getRawValue();
    // let data = this._feedbackDetailsService.mapFeedbackData(
    //   value && value.feedbackDetail,
    //   this._reservationService.reservationData.guestDetails.primaryGuest.id
    // );
    this.$subscription.add(
      this._feedbackDetailsService
        .addFeedback(this._reservationService.reservationId, {
          ...value.feedbackDetail,
          journey: this._hotelService.currentJourney,
          quickServices: this.feedbackDetailCmp.selectedQuickServices,
        })
        .subscribe(
          (response) => {
            this._translateService
              .get('MESSAGES.SUCCESS.FEEDBACK_COMPLETE')
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg, '', {
                  panelClass: 'success',
                });
              });
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this._stepperService.setIndex('next');
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
          }
        )
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

  goBack() {
    this._stepperService.setIndex('back');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
