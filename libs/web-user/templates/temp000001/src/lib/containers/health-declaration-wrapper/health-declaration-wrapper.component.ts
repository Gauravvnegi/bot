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
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { CheckinDateAlertComponent } from 'libs/web-user/shared/src/lib/presentational/checkin-date-alert/checkin-date-alert.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';

@Component({
  selector: 'hospitality-bot-health-declaration-wrapper',
  templateUrl: './health-declaration-wrapper.component.html',
  styleUrls: ['./health-declaration-wrapper.component.scss'],
})
export class HealthDeclarationWrapperComponent extends BaseWrapperComponent {
  @ViewChild('healthComponent') healthComponent: HealthDeclarationComponent;
  protected _dialogRef: MatDialogRef<any>;
  protected checkInDialogRef: MatDialogRef<CheckinDateAlertComponent>;
  protected checkInDateAlert = CheckinDateAlertComponent;
  modalVisible = false;

  constructor(
    protected _reservationService: ReservationService,
    protected _healthDetailsService: HealthDetailsService,
    protected _stepperService: StepperService,
    protected _buttonService: ButtonService,
    protected _snackBarService: SnackBarService,
    protected _translateService: TranslateService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected templateService: TemplateService,
    protected _modal: ModalService,
    protected dateService: DateService
  ) {
    super();
    this.self = this;
  }

  ngOnInit() {
    this.registerListeners();
  }
  registerListeners() {
    this.listenForSummaryDetails();
  }

  listenForSummaryDetails() {
    this.$subscription.add(
      this._stepperService.stepperSelectedIndex$.subscribe((index) => {
        if (
          this.templateService.templateData[this.templateService.templateId]
        ) {
          let data;
          this.templateService.templateData[
            this.templateService.templateId
          ].stepConfigs.find((item, ix) => {
            if (item.component.name === 'health-declaration-wrapper') {
              data = ix;
            }
          });
          if (data === index) {
            this.checkForTodaysBooking(
              this._reservationService.reservationData
            );
          }
        }
      })
    );
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
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this._stepperService.setIndex('next');
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

  checkForTodaysBooking(data) {
    const diff = DateService.getDateDifference(
      +data.arrivalTime,
      +this.dateService.getCurrentTimeStamp()
    );
    const stayDetailDay = DateService.convertTimestampToDate(
      +data.arrivalTime,
      'DD'
    );
    const currentDay = DateService.convertTimestampToDate(
      +this.dateService.getCurrentTimeStamp(),
      'DD'
    );
    if (diff > 0 && !this.modalVisible) {
      this.openCheckinDateModal();
    } else if (+diff === 0 && +stayDetailDay > +currentDay) {
      this.openCheckinDateModal();
    }
  }

  openCheckinDateModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'checkin-modal-component';
    this.modalVisible = true;
    this.checkInDialogRef = this._modal.openDialog(this.checkInDateAlert, {
      disableClose: true,
      id: 'checkin-modal-component',
    });
    this.checkInDialogRef.disableClose = true;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
