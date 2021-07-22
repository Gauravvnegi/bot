import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { HealthDetailsService } from 'libs/web-user/shared/src/lib/services/health-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { get } from 'lodash';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { HealthDeclarationComponent } from '../health-declaration/health-declaration.component';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';
import * as journeyEnums from 'libs/web-user/shared/src/lib/constants/journey';

@Component({
  selector: 'hospitality-bot-health-declaration-wrapper',
  templateUrl: './health-declaration-wrapper.component.html',
  styleUrls: ['./health-declaration-wrapper.component.scss'],
})
export class HealthDeclarationWrapperComponent extends BaseWrapperComponent {
  @ViewChild('healthComponent') healthComponent: HealthDeclarationComponent;

  constructor(
    protected _reservationService: ReservationService,
    protected _healthDetailsService: HealthDetailsService,
    protected _stepperService: StepperService,
    protected _buttonService: ButtonService,
    protected _snackBarService: SnackBarService,
    protected _translateService: TranslateService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected templateService: TemplateService
  ) {
    super();
    this.self = this;
  }

  /**
   * Function to save/update the health details for the guest on next click
   */
  saveHealthDeclarationDetails(): void {
    const status = this._healthDetailsService.validateHealthDecForm(
      this.parentForm,
      this.healthComponent.signature
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
            const { journey } = this.templateService.templateConfig;
            if (
              journey == journeyEnums.JOURNEY.preCheckin.toLocaleUpperCase()
            ) {
              this._buttonService.buttonLoading$.next(
                this.buttonRefs['submitButton']
              );
              this.openThankyouPage();
            } else {
              this._buttonService.buttonLoading$.next(
                this.buttonRefs['nextButton']
              );
              this._stepperService.setIndex('next');
            }
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            //   this._snackBarService.openSnackBarAsText(error.message);
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
          }
        )
    );
  }

  protected performActionIfNotValid(status: any[]) {
    const healthDecFG = this.parentForm.get(
      'healthDeclarationForm'
    ) as FormGroup;
    healthDecFG.markAllAsTouched();

    this._translateService
      .get(`VALIDATION.${status[0].code}`)
      .subscribe((translatedMsg) => {
        this._snackBarService.openSnackBarAsText(translatedMsg);
      });

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

  openThankyouPage() {
    this.router.navigateByUrl(
      `/thankyou?token=${this.route.snapshot.queryParamMap.get(
        'token'
      )}&entity=thankyou&state=PRECHECKIN`
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
