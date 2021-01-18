import { Component } from '@angular/core';
import { SummaryComponent as BaseSummaryComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/summary/summary.component';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
@Component({
  selector: 'hospitality-bot-summary',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/summary/summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent extends BaseSummaryComponent {
  constructor(
    stepperService: StepperService,
    fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    reservationService: ReservationService
  ) {
    super(stepperService, fb, route, router, reservationService);
    this.context = this;
  }
}
