import { Component, OnInit } from '@angular/core';
import { FeedbackDetailsWrapperComponent as BaseFeedbackDetailsWrapperComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/feedback-details-wrapper/feedback-details-wrapper.component';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { FeedbackDetailsService } from './../../../../../../shared/src/lib/services/feedback-details.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';

@Component({
  selector: 'hospitality-bot-feedback-details-wrapper',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/feedback-details-wrapper/feedback-details-wrapper.component.html',
  styleUrls: ['./feedback-details-wrapper.component.scss'],
})
export class FeedbackDetailsWrapperComponent extends BaseFeedbackDetailsWrapperComponent {
  constructor(
    feedbackDetailsService: FeedbackDetailsService,
    reservationService: ReservationService,
    hotelService: HotelService,
    stepperService: StepperService,
    buttonService: ButtonService,
    snackBarService: SnackBarService,
    translateService: TranslateService
  ) {
    super(
      feedbackDetailsService,
      reservationService,
      hotelService,
      stepperService,
      buttonService,
      snackBarService,
      translateService
    );
    this.self = this;
  }
}
