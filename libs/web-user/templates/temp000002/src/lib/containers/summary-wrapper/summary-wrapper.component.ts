import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { RegCardService } from 'libs/web-user/shared/src/lib/services/reg-card.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { SummaryWrapperComponent as BaseSummaryWrapperComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/summary-wrapper/summary-wrapper.component';
import { Temp000002InputPopupComponent } from '../../presentational/temp000002-input-popup/temp000002-input-popup.component';
import { RegistrationCardComponent } from '../registration-card/registration-card.component';

@Component({
  selector: 'hospitality-bot-summary-wrapper',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/summary-wrapper/summary-wrapper.component.html',
  styleUrls: ['./summary-wrapper.component.scss'],
})
export class SummaryWrapperComponent extends BaseSummaryWrapperComponent {
  protected regCardComponent = RegistrationCardComponent;

  constructor(
    _modal: ModalService,
    dialog: MatDialog,
    summaryService: SummaryService,
    stepperService: StepperService,
    router: Router,
    route: ActivatedRoute,
    _snackbarService: SnackBarService,
    _reservationService: ReservationService,
    _translateService: TranslateService,
    _fb: FormBuilder,
    _regCardService: RegCardService,
    _utilityService: UtilityService,
    _buttonService: ButtonService
  ) {
    super(
      _modal,
      dialog,
      summaryService,
      stepperService,
      router,
      route,
      _snackbarService,
      _reservationService,
      _translateService,
      _fb,
      _regCardService,
      _utilityService,
      _buttonService
    );
    this.self = this;
  }
  protected inputPopupComponent = Temp000002InputPopupComponent;
}
