import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';

import { BillSummaryService } from '../../../../../../shared/src/lib/services/bill-summary.service';
import { SummaryDetailsConfigI } from 'libs/web-user/shared/src/lib/data-models/billSummaryConfig.model';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-bill-summary-details',
  templateUrl: './bill-summary-details.component.html',
  styleUrls: ['./bill-summary-details.component.scss'],
})
export class BillSummaryDetailsComponent implements OnInit {
  private $subscription: Subscription = new Subscription();
  @Input() parentForm: FormGroup;
  @Input() reservationData;
  @Input() stepperIndex;

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
    private _hotelService: HotelService,
    private _reservationService: ReservationService,
    private _snackBarService: SnackBarService,
    private _utilityService: UtilityService,
    public dialog: MatDialog,
    private _translateService: TranslateService
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
      this.getModifiedPaymentSummary();
    }
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

    this.billSummaryDetails.packages.forEach((amenity) => {
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
            this._hotelService.hotelId,
            this._reservationService.reservationData.guestDetails.primaryGuest.id,
            formData
          )
          .subscribe(
            (response) => {
              this._summaryService.$signatureUrl.next(
                response['fileDownloadUri']
              );
              this.signature = response['fileDownloadUri'];
              this._utilityService.$signatureUploaded.next(true);
              this.$subscription.add(
                this._translateService
                  .get('MESSAGES.SUCCESS.SIGNATURE_UPLOAD_COMPLETE')
                  .subscribe((res) => {
                    this._snackBarService.openSnackBarAsText(
                      res,
                      '',
                      { panelClass: 'success' }
                    );
                  })
              );
            },
            ({ error }) => {
              this._utilityService.$signatureUploaded.next(true);
              this.$subscription.add(
                this._translateService
                  .get(`MESSAGES.ERROR.${error.type}`)
                  .subscribe((res) => {
                    this._snackBarService.openSnackBarAsText(res);
                  })
              );
            }
          )
      );
            // this._snackBarService.openSnackBarAsText(error.message)
    }
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
