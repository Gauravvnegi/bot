import { Component, OnInit } from '@angular/core';
import { PaymentDetailsWrapperComponent as BasePaymentDetailsWrapperComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/payment-details-wrapper/payment-details-wrapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'libs/shared/material/src';

import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';

@Component({
  selector: 'hospitality-bot-payment-details-wrapper',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/payment-details-wrapper/payment-details-wrapper.component.html',
  styleUrls: ['./payment-details-wrapper.component.scss'],
})
export class PaymentDetailsWrapperComponent extends BasePaymentDetailsWrapperComponent {
  constructor(
    paymentDetailsService: PaymentDetailsService,
    reservationService: ReservationService,
    stepperService: StepperService,
    buttonService: ButtonService,
    hotelService: HotelService,
    billSummaryService: BillSummaryService,
    router: Router,
    route: ActivatedRoute,
    snackBarService: SnackBarService,
    translateService: TranslateService
  ) {
    super(
      paymentDetailsService,
      reservationService,
      stepperService,
      buttonService,
      hotelService,
      billSummaryService,
      router,
      route,
      snackBarService,
      translateService
    );
    this.self = this;
  }
}
