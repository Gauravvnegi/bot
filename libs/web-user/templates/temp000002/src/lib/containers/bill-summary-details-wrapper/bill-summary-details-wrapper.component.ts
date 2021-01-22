import { Component, OnInit } from '@angular/core';
import { BillSummaryDetailsWrapperComponent as BaseBillSummaryDetailsWrapperComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/bill-summary-details-wrapper/bill-summary-details-wrapper.component';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'hospitality-bot-bill-summary-details-wrapper',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/bill-summary-details-wrapper/bill-summary-details-wrapper.component.html',
  styleUrls: ['./bill-summary-details-wrapper.component.scss'],
})
export class BillSummaryDetailsWrapperComponent extends BaseBillSummaryDetailsWrapperComponent {
  constructor(
    billSummaryService: BillSummaryService,
    reservationService: ReservationService,
    stepperService: StepperService,
    buttonService: ButtonService,
    snackBarService: SnackBarService,
    translateService: TranslateService
  ) {
    super(
      billSummaryService,
      reservationService,
      stepperService,
      buttonService,
      snackBarService,
      translateService
    );
    this.self = this;
  }
}
