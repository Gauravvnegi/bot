import { Component } from '@angular/core';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';

@Component({
  selector: 'hospitality-bot-bill-summary-details-wrapper',
  templateUrl: './bill-summary-details-wrapper.component.html',
  styleUrls: ['./bill-summary-details-wrapper.component.scss'],
})
export class BillSummaryDetailsWrapperComponent extends BaseWrapperComponent {
  signature: string;

  paymentSummary;

  constructor(
    private _billSummaryService: BillSummaryService,
    private _reservationService: ReservationService,
    private _stepperService: StepperService,
    private _buttonService: ButtonService,
    private utilService: UtilityService
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
    );
  }

  onSummarySubmit() {
    if (!this.signature) {
      this.utilService.showErrorMessage(`VALIDATION.SIGNATURE_UPLOAD_PENDING`);
      this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
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
            this.utilService.showErrorMessage(error);
            // this._snackBarService.openSnackBarAsText(error.message);
          }
        )
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
