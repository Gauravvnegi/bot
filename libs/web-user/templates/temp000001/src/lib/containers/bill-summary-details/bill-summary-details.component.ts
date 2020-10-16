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
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';

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
  signature;
  summaryDetails;
  staySummaryDetails;
  billSummaryDetails;

  constructor(
    private _fb: FormBuilder,
    private _summaryService: BillSummaryService,
    private _dateService: DateService,
    private _stepperService: StepperService,
    private _docService: DocumentDetailsService,
    public dialog: MatDialog,
    private _utilityService: UtilityService
  ) {
    this.initRequestForm();
  }

  ngOnInit(): void {
    this.setFieldConfiguration();
    this.setDialogData();
    this.staySummaryDetails = this.staySummary;
    this.billSummaryDetails = this.billSummary;
    this.modifyData();
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

  modifyData() {
    this.staySummaryDetails.arrivalDate = this.convertTimestampToDate(
      this.staySummaryDetails.arrivalDate
    );
    this.staySummaryDetails.departureDate = this.convertTimestampToDate(
      this.staySummaryDetails.departureDate
    );
  }

  convertTimestampToDate(input) {
    return this._dateService.convertTimestampToDate(input);
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

  signatureUploadFile(event) {
    const formData = new FormData();
    formData.append('doc_type', 'signature');
    formData.append('doc_page', 'front');
    formData.append('file', event.file);
    this._docService
      .uploadDocumentFile(
        this.reservationData.id,
        this.reservationData.guestDetails.primaryGuest.id,
        formData
      )
      .subscribe((res) => {
        this._utilityService.$signatureUploaded.next(true);
      }, (err) => this._utilityService.$signatureUploaded.next(false));
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
