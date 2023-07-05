import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SummaryDetailsConfigI } from 'libs/web-user/shared/src/lib/data-models/billSummaryConfig.model';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { Subscription } from 'rxjs';
import { BillSummaryService } from '../../../../../../shared/src/lib/services/bill-summary.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { AddGstComponent } from '../add-gst/add-gst.component';

@Component({
  selector: 'hospitality-bot-bill-summary-details',
  templateUrl: './bill-summary-details.component.html',
  styleUrls: ['./bill-summary-details.component.scss'],
})
export class BillSummaryDetailsComponent implements OnInit, OnDestroy {
  private $subscription: Subscription = new Subscription();
  @Input() parentForm: FormGroup;
  @Input() reservationData;
  @Input() stepperIndex;

  protected addGstComponent = AddGstComponent;

  @ViewChild('nextButton') nextButton;

  requestForm: FormGroup;
  summaryConfig: SummaryDetailsConfigI;
  signature =
    'https://nyc3.digitaloceanspaces.com/craterzone-backup/bot/12aa3dbc-a684-4381-9c6e-d6e8b8719de7/Signature/signature.png';
  summaryDetails;
  staySummaryDetails;
  billSummaryDetails;

  dataSource = [];

  displayedColumns: string[] = [
    'date',
    'description',
    'unit',
    'debitAmount',
    'creditAmount',
  ];

  constructor(
    protected _fb: FormBuilder,
    protected _summaryService: BillSummaryService,
    protected _stepperService: StepperService,
    protected _hotelService: HotelService,
    protected _reservationService: ReservationService,
    protected _utilityService: UtilityService,
    public dialog: MatDialog,
    protected _snackBarService: SnackBarService,
    protected _translateService: TranslateService
  ) {
    this.initRequestForm();
  }

  ngOnInit(): void {
    this.setFieldConfiguration();
    this.setDialogData();
    this.getSummaryDetails();
  }

  setFieldConfiguration() {
    this.summaryConfig = this._summaryService.setFieldConfigForGuestDetails();
  }

  setDialogData() {
    this.summaryDetails = {
      heading: 'Are you sure you want to Check-In ?',
      requestConfig: this.summaryConfig.request,
      form: this.requestForm,
      controlName: 'request',
      buttonText: 'Check-In',
    };
  }

  /**
   * Initialize form
   */
  initRequestForm() {
    this.requestForm = this._fb.group({
      request: [''],
    });
  }

  getSummaryDetails() {
    this.staySummaryDetails = this.staySummary;
    this.billSummaryDetails = this.billSummary;
    if (this.staySummaryDetails && this.billSummaryDetails) {
      // this.getModifiedPaymentSummary();
      this.dataSource = this.billSummaryDetails.billItems;
    }
  }

  getModifiedPaymentSummary() {
    this.billSummaryDetails.billItems.forEach((item) => {
      let { date, description, unit, debitAmount, creditAmount } = item;
      this.dataSource.push();
    });
  }

  openDialog() {
    this._stepperService.setIndex('next');
  }

  signatureUploadFile(event) {
    if (event.file) {
      let formData = new FormData();
      formData.append('files', event.file);

      this.$subscription.add(
        this._summaryService
          .uploadSignature(
            this._reservationService.reservationId,
            this._hotelService.entityId,
            this._reservationService.reservationData.guestDetails.primaryGuest
              .id,
            formData
          )
          .subscribe(
            (response) => {
              this._summaryService.$signatureUrl.next(
                response['fileDownloadUri']
              );
              this.signature = response['fileDownloadUri'];
              this._utilityService.$signatureUploaded.next(true);
              this._translateService
                .get('MESSAGES.SUCCESS.SIGNATURE_UPLOAD_COMPLETE')
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg, '', {
                    panelClass: 'success',
                  });
                });
            },
            ({ error }) => {
              this._utilityService.$signatureUploaded.next(true);
              this._translateService
                .get(`MESSAGES.ERROR.${error.type}`)
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg);
                });
            }
          )
      );
    }
  }

  openAddGSTDetails() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    const modalDialog = this.dialog.open(this.addGstComponent, dialogConfig);

    // this.$subscription.add(
    //   modalDialog.componentInstance.isRenderedEvent.subscribe((val) => {
    //     if (val === true) {
    //       modalDialog.componentInstance.showAppStatusForm = true;
    //     }
    //   })
    // );
  }

  get staySummary() {
    return this._summaryService.billSummaryDetails.staySummary;
  }

  get billSummary() {
    return this._summaryService.billSummaryDetails.billSummary;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
