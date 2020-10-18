import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';

import { BillSummaryService } from '../../../../../../shared/src/lib/services/bill-summary.service';
import { InputPopupComponent } from '../../../../../../shared/src/lib/presentational/input-popup/input-popup.component';
import { SummaryDetailsConfigI } from 'libs/web-user/shared/src/lib/data-models/billSummaryConfig.model';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { HealthDetailsService } from 'libs/web-user/shared/src/lib/services/health-details.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'hospitality-bot-bill-summary-details',
  templateUrl: './bill-summary-details.component.html',
  styleUrls: ['./bill-summary-details.component.scss'],
})
export class BillSummaryDetailsComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() reservationData;
  @Input() stepperIndex;

  @ViewChild('nextButton') nextButton;

  requestForm: FormGroup;
  summaryConfig: SummaryDetailsConfigI;
  signature="https://nyc3.digitaloceanspaces.com/craterzone-backup/bot/12aa3dbc-a684-4381-9c6e-d6e8b8719de7/Signature/signature.png";
  summaryDetails;
  staySummaryDetails;
  billSummaryDetails;

  dataSource = [];

  displayedColumns: string[] = [
    'label',
    'unit',
    'unitPrice',
    'amount',
    'CGST',
    'SGST',
    'discount',
    'totalAmount',
  ];

  constructor(
    private _fb: FormBuilder,
    private _summaryService: BillSummaryService,
    private _stepperService: StepperService,
    private _healthDetailsService: HealthDetailsService,
    private _reservationService: ReservationService,
    private _snackBarService: SnackBarService,
    public dialog: MatDialog
  ) {
      this.initRequestForm();
  }

  ngOnInit(): void {
    this.setFieldConfiguration();
    this.setDialogData();
    this.staySummaryDetails = this.staySummary;
    this.billSummaryDetails = this.billSummary;
    this.getModifiedPaymentSummary();
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

  getModifiedPaymentSummary() {
    const paymentSummary = this.billSummaryDetails;
    let {
      label,
      description,
      unit,
      unitPrice,
      amount,
      discount,
      totalAmount,
      taxAndFees,
    } = paymentSummary.roomRates;
    
    this.dataSource.push({
      label,
      description,
      unit,
      unitPrice,
      amount,
      discount,
      totalAmount,
      currency: paymentSummary.currency,
      ...Object.assign(
        {},
        ...taxAndFees.map((taxType) => ({
          [taxType.type]: taxType.value,
        }))
      ),
    });

    this.billSummaryDetails.packages.forEach(amenity => {
      let {
        label,
        description,
        unit,
        unitPrice,
        amount,
        discount,
        totalAmount,
        taxAndFees,
      } = amenity;

      this.dataSource.push({
        label,
        description,
        unit,
        unitPrice,
        amount,
        discount,
        totalAmount,
        currency: paymentSummary.currency,
        ...Object.assign(
          {},
          ...taxAndFees.map((taxType) => ({
            [taxType.type]: taxType.value,
          }))
        ),
      });
    });
  }

  openDialog() {
    // const dialogRef = this.dialog.open(InputPopupComponent,{
    //   disableClose: true,
    //   autoFocus: true,
    //   height: '300px',
    //   width: '550px',
    //   data: { pageValue: this.summaryDetails }
    // });

    this._stepperService.setIndex('next');

    // dialogRef.afterClosed().subscribe(result => {
    //   this.submit(result);
    // });
  }

  // signatureUploadFile(event) {
  //   const formData = new FormData();
  //   formData.append('doc_type', 'signature');
  //   formData.append('doc_page', 'front');
  //   formData.append('file', event.file);
  //   this._docService
  //     .uploadDocumentFile(
  //       this.reservationData.id,
  //       this.reservationData.guestDetails.primaryGuest.id,
  //       formData
  //     )
  //     .subscribe((res) => {});
  // }

  signatureUploadFile(event) {
    if (event.file) {
      let formData = new FormData();
      formData.append('file', event.file);

      this._healthDetailsService
        .uploadSignature(
          this._reservationService.reservationId,
          this._reservationService.reservationData.guestDetails.primaryGuest.id,
          formData
        )
        .subscribe((response) => {
          this.signature = response.fileDownloadUrl;
          this._snackBarService.openSnackBarAsText(
            'Signature upload successful',
            '',
            { panelClass: 'success' }
          );
        });
    }
  }

  get staySummary() {
    return this._summaryService.billSummaryDetails.staySummary;
  }

  get billSummary() {
    return this._summaryService.billSummaryDetails.billSummary;
  }

  submit(result) {
    console.log(result);
  }
}
