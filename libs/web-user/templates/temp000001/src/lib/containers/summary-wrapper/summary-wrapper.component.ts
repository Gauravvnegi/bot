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

@Component({
  selector: 'hospitality-bot-summary-wrapper',
  templateUrl: './summary-wrapper.component.html',
  styleUrls: ['./summary-wrapper.component.scss'],
  providers: [SummaryService],
})
export class SummaryWrapperComponent extends BaseWrapperComponent
  implements OnInit, OnDestroy {
  requestForm: FormGroup;
  summaryConfig: SummaryDetailsConfigI;
  summaryDetails;
  termsStatus: boolean;

  protected inputPopupComponent = Temp000001InputPopupComponent;

  constructor(
    public dialog: MatDialog,
    protected _summaryService: SummaryService,
    protected _stepperService: StepperService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected _snackbarService: SnackBarService,
    protected _reservationService: ReservationService,
    protected _translateService: TranslateService,
    private _fb: FormBuilder
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

  onCheckinSubmit() {
    const data = {
      special_remarks: this.requestForm.get('request').value,
      // termsStatus: this.termsStatus,
    };
    debugger;
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
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackbarService.openSnackBarAsText(translatedMsg);
              });
          }
        )
    );
  }

  openThankyouPage(state) {
    this.router.navigateByUrl(
      `/thankyou?token=${this.route.snapshot.queryParamMap.get(
        'token'
      )}&entity=thankyou&state=${state}`
    );
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
