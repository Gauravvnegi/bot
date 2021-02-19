import { Component } from '@angular/core';
import { GuestDetailsWrapperComponent as BaseGuestDetailsWrapperComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/guest-details-wrapper/guest-details-wrapper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { GuestDetailsService } from 'libs/web-user/shared/src/lib/services/guest-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'hospitality-bot-guest-details-wrapper',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/guest-details-wrapper/guest-details-wrapper.component.html',
  styleUrls: ['./guest-details-wrapper.component.scss'],
})
export class GuestDetailsWrapperComponent extends BaseGuestDetailsWrapperComponent {
  constructor(
    guestDetailService: GuestDetailsService,
    reservationService: ReservationService,
    stepperService: StepperService,
    buttonService: ButtonService,
    snackBarService: SnackBarService,
    translateService: TranslateService
  ) {
    super(
      guestDetailService,
      reservationService,
      stepperService,
      buttonService,
      snackBarService,
      translateService
    );
    this.self = this;
  }
}
