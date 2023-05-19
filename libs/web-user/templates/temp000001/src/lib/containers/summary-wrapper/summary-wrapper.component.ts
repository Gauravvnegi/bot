import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SummaryDetailsConfigI } from 'libs/web-user/shared/src/lib/data-models/billSummaryConfig.model';
import { Temp000001InputPopupComponent } from 'libs/web-user/templates/temp000001/src/lib/presentational/temp000001-input-popup/temp000001-input-popup.component';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { SnackBarService } from 'libs/shared/material/src';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { RegistrationCardComponent } from '../registration-card/registration-card.component';
import { RegCardService } from 'libs/web-user/shared/src/lib/services/reg-card.service';
import { FileData } from 'libs/web-user/shared/src/lib/data-models/file';
import { SummaryDetails } from 'libs/web-user/shared/src/lib/data-models/summaryConfig.model';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';

@Component({
  selector: 'hospitality-bot-summary-wrapper',
  templateUrl: './summary-wrapper.component.html',
  styleUrls: ['./summary-wrapper.component.scss'],
  providers: [SummaryService],
})
export class SummaryWrapperComponent extends BaseWrapperComponent
  implements OnInit, OnDestroy {
  protected _dialogRef: MatDialogRef<any>;
  protected regCardComponent = RegistrationCardComponent;
  regCardLoading = false;

  requestForm: FormGroup;
  summaryConfig: SummaryDetailsConfigI;
  summaryDetails;
  termsStatus: boolean;
  signatureUrl: string;
  regCardUrl: string;

  protected inputPopupComponent = Temp000001InputPopupComponent;

  constructor(
    protected _modal: ModalService,
    public dialog: MatDialog,
    protected _summaryService: SummaryService,
    protected _stepperService: StepperService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected _snackbarService: SnackBarService,
    protected _reservationService: ReservationService,
    protected _translateService: TranslateService,
    private _fb: FormBuilder,
    protected _regCardService: RegCardService,
    protected _utilityService: UtilityService,
    private _buttonService: ButtonService
  ) {
    super();
    this.self = this;
  }

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.setFieldConfiguration();
    this.setDialogData();
    this.initRequestForm();
  }

  initRequestForm() {
    this.requestForm = this._fb.group({
      request: [''],
    });
  }

  setFieldConfiguration() {
    this.summaryConfig = this._summaryService.setFieldConfigForGuestDetails();
  }

  setDialogData() {
    this.summaryDetails = {
      heading: 'Are you sure you want to Check-In ?',
      requestConfig: this.summaryConfig.request,
      controlName: 'request',
      buttonText: 'Check-In',
    };
  }

  /**
   * This was special request pop up , commenting it as of now
   */
  // onCheckinSubmit() {
  //   // if (!this.termsStatus) {
  //   //   this._snackbarService.openSnackBarAsText(
  //   //     'Please accept terms & condition'
  //   //   );
  //   //   return;
  //   // }
  //   const dialogRef = this.dialog.open(this.inputPopupComponent, {
  //     disableClose: true,
  //     autoFocus: true,
  //     data: { pageValue: this.summaryDetails, termsStatus: this.termsStatus },
  //   });

  //   this.$subscription.add(
  //     dialogRef.afterClosed().subscribe((result) => {
  //       // this.submit(result);
  //       if (result.hasOwnProperty('state')) {
  //         if (result.state === 'success') {
  //           this.openThankyouPage('checkin');
  //         }
  //       }
  //     })
  //   );
  // }

  openRegCard(regUrl: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';

    dialogConfig.data = {
      regcardUrl: regUrl,
      signatureImageUrl: this.signatureUrl,
    };
    this._dialogRef = this._modal.openDialog(
      this.regCardComponent,
      dialogConfig
    );

    this._dialogRef.componentInstance.isSubmit = true;
    this._dialogRef.componentInstance.onSave.subscribe(
      ({ regCardUrl, signatureUrl, isSave }) => {
        if (regCardUrl) this.regCardUrl = regCardUrl;
        if (signatureUrl) {
          this.signatureUrl = signatureUrl;
        }
        if (isSave) {
          this.handleCheckIn();
        } else {
          this.resetBtnState();
        }
        this._dialogRef.close();
      }
    );
  }

  handleRegCard() {
    if (this.regCardUrl) {
      this.openRegCard(this.regCardUrl);
    } else {
      this.regCardLoading = true;
      this.$subscription.add(
        this._regCardService
          .getRegCard(this._reservationService.reservationId)
          .subscribe(
            (res: FileData) => {
              this.regCardLoading = false;
              this.openRegCard(res.file_download_url);
            },
            ({ error }) => {
              this.resetBtnState();
              this.regCardLoading = false;
              this._translateService
                .get(`MESSAGES.ERROR.${error.type}`)
                .subscribe((translatedMsg) => {
                  this._snackbarService.openSnackBarAsText(translatedMsg);
                });
            }
          )
      );
    }
  }

  handleCheckIn() {
    const data = {
      special_remarks: this.requestForm.get('request').value,
      // termsStatus: this.termsStatus,
    };

    this.$subscription.add(
      this._reservationService
        .checkIn(this._reservationService.reservationData.id, data)
        .subscribe(
          (res) => {
            this._translateService
              .get(`MESSAGES.SUCCESS.CHECKIN_COMPLETE`)
              .subscribe((translatedMsg) => {
                this._snackbarService.openSnackBarAsText(translatedMsg, '', {
                  panelClass: 'success',
                });
              });
            this.openThankyouPage('checkin');
          },
          ({ error }) => {
            this.resetBtnState();
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackbarService.openSnackBarAsText(translatedMsg);
              });
          }
        )
    );
  }

  // this one is template function
  onCheckinSubmit() {
    if (this.signatureUrl || this._utilityService.$signatureUploaded.value) {
      this.handleCheckIn();
    } else this.handleRegCard();
  }

  // reset btn state if checking is not finalized
  resetBtnState() {
    this._buttonService.buttonLoading$.next(this.buttonRefs['checkinButton']);
  }

  openThankyouPage(state) {
    this.router.navigateByUrl(
      `/thankyou?token=${this.route.snapshot.queryParamMap.get(
        'token'
      )}&entity=thankyou&state=${state}`
    );
  }

  handleRequiredDetails({ regcardUrl, signatureImageUrl }) {
    this.regCardUrl = regcardUrl;
    this.signatureUrl = signatureImageUrl;
  }

  setTermsStatus(event) {
    this.termsStatus = event;
  }

  goBack() {
    this._stepperService.setIndex('back');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
