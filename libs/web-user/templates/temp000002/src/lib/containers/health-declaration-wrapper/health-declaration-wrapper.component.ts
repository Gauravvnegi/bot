import { Component } from '@angular/core';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { HealthDetailsService } from 'libs/web-user/shared/src/lib/services/health-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { HealthDeclarationWrapperComponent as BaseHealthDeclarationWrapperComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/health-declaration-wrapper/health-declaration-wrapper.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';
@Component({
  selector: 'hospitality-bot-health-declaration-wrapper',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/health-declaration-wrapper/health-declaration-wrapper.component.html',
  styleUrls: ['./health-declaration-wrapper.component.scss'],
})
export class HealthDeclarationWrapperComponent extends BaseHealthDeclarationWrapperComponent {
  constructor(
    reservationService: ReservationService,
    healthDetailsService: HealthDetailsService,
    stepperService: StepperService,
    buttonService: ButtonService,
    snackBarService: SnackBarService,
    translateService: TranslateService,
    router: Router,
    route: ActivatedRoute,
    protected templateService: TemplateService
  ) {
    super(
      reservationService,
      healthDetailsService,
      stepperService,
      buttonService,
      snackBarService,
      translateService,
      router,
      route,
      templateService
    );
    this.self = this;
  }
}
