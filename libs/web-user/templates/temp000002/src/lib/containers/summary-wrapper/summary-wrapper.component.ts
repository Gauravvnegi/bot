import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { SummaryWrapperComponent as BaseSummaryWrapperComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/summary-wrapper/summary-wrapper.component';
import { Temp000002InputPopupComponent } from '../../presentational/temp000002-input-popup/temp000002-input-popup.component';
@Component({
  selector: 'hospitality-bot-summary-wrapper',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/summary-wrapper/summary-wrapper.component.html',
  styleUrls: ['./summary-wrapper.component.scss'],
})
export class SummaryWrapperComponent extends BaseSummaryWrapperComponent {
  constructor(
    dialog: MatDialog,
    summaryService: SummaryService,
    stepperService: StepperService,
    router: Router,
    route: ActivatedRoute,
    _snackbarService: SnackBarService
  ) {
    super(
      dialog,
      summaryService,
      stepperService,
      router,
      route,
      _snackbarService
    );
    this.self = this;
  }
  protected inputPopupComponent = Temp000002InputPopupComponent;
}
