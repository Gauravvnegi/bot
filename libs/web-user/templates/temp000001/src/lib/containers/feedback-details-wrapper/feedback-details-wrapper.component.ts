import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FeedbackDetailsService } from './../../../../../../shared/src/lib/services/feedback-details.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';

@Component({
  selector: 'hospitality-bot-feedback-details-wrapper',
  templateUrl: './feedback-details-wrapper.component.html',
  styleUrls: ['./feedback-details-wrapper.component.scss'],
})
export class FeedbackDetailsWrapperComponent extends BaseWrapperComponent
  implements OnInit {
  @Input() parentForm;
  @Input() reservationData;
  @Input() stepperIndex;

  feedBackConfig;

  constructor(
    private _feedbackDetailsService: FeedbackDetailsService,
    private _reservationService: ReservationService,
    private _stepperService: StepperService,
    private _snackBarService: SnackBarService,
    private _buttonService: ButtonService
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getFeedBackConfig();
  }

  initFeedbackConfigDS() {
    this._feedbackDetailsService.initFeedbackConfigDS(this.feedBackConfig);
  }

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
  }

  getFeedBackConfig() {
    this._feedbackDetailsService.getFeedback().subscribe((response) => {
      this.feedBackConfig = response;
      this.initFeedbackConfigDS();
    });
  }

  saveFeedbackDetails() {
    let value = this.parentForm.getRawValue();
    let data = this._feedbackDetailsService.mapFeedbackData(
      value && value.feedbackDetail
    );

    this._feedbackDetailsService
      .addFeedback(this._reservationService.reservationId, data)
      .subscribe(
        (response) => {
          this._snackBarService.openSnackBarAsText('Feedback successfull', '', {
            panelClass: 'success',
          });
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['submitButton']
          );
          //  this._stepperService.setIndex('next');
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.cause);
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['submitButton']
          );
        }
      );
  }

  goBack() {
    this._stepperService.setIndex('back');
  }
}
