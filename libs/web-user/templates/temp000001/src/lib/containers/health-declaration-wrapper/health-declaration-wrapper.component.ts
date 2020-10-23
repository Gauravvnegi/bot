import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HealthDetailsService } from 'libs/web-user/shared/src/lib/services/health-details.service';
import { HealthDeclarationComponent } from '../health-declaration/health-declaration.component';

@Component({
  selector: 'hospitality-bot-health-declaration-wrapper',
  templateUrl: './health-declaration-wrapper.component.html',
  styleUrls: ['./health-declaration-wrapper.component.scss'],
})
export class HealthDeclarationWrapperComponent extends BaseWrapperComponent {
  @Input() parentForm;
  @Input() reservationData;
  @Input() stepperIndex;
  @Input() buttonConfig;

  @ViewChild('healthComponent') healthComponent: HealthDeclarationComponent;

  constructor(
    private _reservationService: ReservationService,
    private _healthDetailsService: HealthDetailsService,
    private _snackBarService: SnackBarService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService
  ) {
    super();
    this.self = this;
  }

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
  }

  saveHealthDeclarationDetails() {
    const dataToBeSaved = this.healthComponent.extractDataFromHealthForm();
    this._healthDetailsService
      .updateHealthForm(
        this._reservationService.reservationId,
        this._reservationService.reservationData.guestDetails.primaryGuest.id,
        dataToBeSaved
      )
      .subscribe(
        (response) => {
          if (response && response.data) {
            // this.patchHealthData(response.data, response.signatureUrl);
          }
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['nextButton']
          );
          this._stepperService.setIndex('next');
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['nextButton']
          );
        }
      );
  }

  goBack() {
    this._stepperService.setIndex('back');
  }
}
