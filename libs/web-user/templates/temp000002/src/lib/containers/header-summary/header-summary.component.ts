import { Component, OnInit } from '@angular/core';
import { HeaderSummaryComponent as BaseHeaderSummaryComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/header-summary/header-summary.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
@Component({
  selector: 'hospitality-bot-header-summary',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/header-summary/header-summary.component.html',
  styleUrls: ['./header-summary.component.scss'],
})
export class HeaderSummaryComponent extends BaseHeaderSummaryComponent {
  constructor(
    stepperService: StepperService,
    date: DateService,
    dialogRef: MatDialogRef<HeaderSummaryComponent>,
    router: Router,
    route: ActivatedRoute
  ) {
    super(stepperService, date, dialogRef, router, route);
    this.context = this;
  }
}
