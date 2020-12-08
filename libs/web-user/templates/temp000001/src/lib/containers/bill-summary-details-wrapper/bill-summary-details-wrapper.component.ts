import { Component, OnInit, Input } from '@angular/core';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';

@Component({
  selector: 'hospitality-bot-bill-summary-details-wrapper',
  templateUrl: './bill-summary-details-wrapper.component.html',
  styleUrls: ['./bill-summary-details-wrapper.component.scss'],
})
export class BillSummaryDetailsWrapperComponent extends BaseWrapperComponent {
  @Input() parentForm;
  @Input() reservationData;
  @Input() stepperIndex;
  @Input() buttonConfig;
  signature: string;

  paymentSummary;

  constructor(
    private _billSummaryService: BillSummaryService,
    private _reservationService: ReservationService,
    private _stepperService: StepperService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService,
    private _buttonService: ButtonService
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.registerListeners();
    this.getAmountSummary();
  }

  registerListeners() {
    this.listenForSignatureUrl();
  }

  listenForSignatureUrl() {
    this.$subscription.add(
      this._billSummaryService.$signatureUrl.subscribe((res) => {
        if (res) {
          this.signature = res;
        }
      })
    );
  }

  initBillSummaryDetailsDS(paymentSummary) {
    this._billSummaryService.initBillSummaryDetailDS(
      this.reservationData,
      paymentSummary
    );
  }

  getAmountSummary() {
    this.$subscription.add(
      this._billSummaryService
        .getBillingSummary(this._reservationService.reservationId)
        .subscribe((summary) => {
          this.paymentSummary = summary;
          this._billSummaryService.$signatureUrl.next(
            this.paymentSummary.signatureUrl
          );
          this.initBillSummaryDetailsDS(this.paymentSummary);
        })
    )
  }

  onSummarySubmit() {
    if (!this.signature) {
      this.$subscription.add(
        this._translateService
          .get(`VALIDATION.SIGNATURE_UPLOAD_PENDING`)
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          })
      );
      return;
    }
    let formData = {
      billingSignatureUrl: this.signature,
    };
    this.$subscription.add(
      this._billSummaryService
        .bindSignatureWithSummary(
          this._reservationService.reservationId,
          formData
        )
        .subscribe(
          (res) => {
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this._stepperService.setIndex('next');
          },
          ({ error }) => {
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this.$subscription.add(
              this._translateService
                .get(`MESSAGES.ERROR.${error.type}`)
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg);
                })
            );
            // this._snackBarService.openSnackBarAsText(error.message);
          }
        )
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
