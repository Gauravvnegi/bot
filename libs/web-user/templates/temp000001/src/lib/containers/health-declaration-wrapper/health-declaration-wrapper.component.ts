import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HealthDetailsService } from 'libs/web-user/shared/src/lib/services/health-details.service';
import { HealthDeclarationComponent } from '../health-declaration/health-declaration.component';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { get } from 'lodash';

@Component({
  selector: 'hospitality-bot-health-declaration-wrapper',
  templateUrl: './health-declaration-wrapper.component.html',
  styleUrls: ['./health-declaration-wrapper.component.scss'],
})
export class HealthDeclarationWrapperComponent extends BaseWrapperComponent {
  @ViewChild('healthComponent') healthComponent: HealthDeclarationComponent;

  constructor(
    private _reservationService: ReservationService,
    private _healthDetailsService: HealthDetailsService,
    private _snackBarService: SnackBarService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _translateService: TranslateService
  ) {
    super();
    this.self = this;
  }

  /**
   * Function to save/update the health details for the guest on next click
   */
  saveHealthDeclarationDetails() {
    const status = this._healthDetailsService.validateHealthDecForm(
      this.parentForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
      return;
    }

    const dataToBeSaved = this.healthComponent.extractDataFromHealthForm();
    this.$subscription.add(
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
            this.$subscription.add(
              this._translateService
                .get(`MESSAGES.ERROR.${error.type}`)
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg);
                })
            );
            //   this._snackBarService.openSnackBarAsText(error.message);
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
          }
        )
    );
  }

  private performActionIfNotValid(status: any[]) {
    const healthDecFG = this.parentForm.get(
      'healthDeclarationForm'
    ) as FormGroup;
    healthDecFG.markAllAsTouched();

    this.$subscription.add(
      this._translateService
        .get(`VALIDATION.${status[0].code}`)
        .subscribe((translatedMsg) => {
          this._snackBarService.openSnackBarAsText(translatedMsg);
        })
    );

    if (get(status[0], ['data', 'index']) >= 0) {
      this.healthComponent.accordion.closeAll();
      const allPanels = this.healthComponent.panelList.toArray();
      allPanels[status[0].data.index].open();
    } else {
      this.healthComponent.accordion.openAll();
    }
    return;
  }

  goBack() {
    this._stepperService.setIndex('back');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
