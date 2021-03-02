import { Component } from '@angular/core';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'hospitality-bot-bill-summary-details-wrapper',
  templateUrl: './bill-summary-details-wrapper.component.html',
  styleUrls: ['./bill-summary-details-wrapper.component.scss'],
})
export class BillSummaryDetailsWrapperComponent extends BaseWrapperComponent {
  signature: string;

  paymentSummary;

  constructor(
    protected _billSummaryService: BillSummaryService,
    protected _reservationService: ReservationService,
    protected _stepperService: StepperService,
    protected _buttonService: ButtonService,
    protected _snackBarService: SnackBarService,
    protected _translateService: TranslateService,
    protected router: Router,
    protected route: ActivatedRoute
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
        .subscribe(
          (summary) => {
            this.paymentSummary = summary;
            this._billSummaryService.$signatureUrl.next(
              this.paymentSummary.signatureUrl
            );
            this.initBillSummaryDetailsDS(this.paymentSummary);
          },
          ({ error }) => {
            if (error.type === 'DOCUMENT_NULL') {
              this.router.navigateByUrl(
                `/invoice-not-generated?token=${this.route.snapshot.queryParamMap.get(
                  'token'
                )}&entity=invoice-not-generated`
              );
            } else {
              this._translateService
                .get(`MESSAGES.ERROR.${error.type}`)
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg);
                });
            }
          }
        )
    );
  }

  onSummarySubmit() {
    if (!this.signature) {
      this._translateService
        .get(`VALIDATION.SIGNATURE_UPLOAD_PENDING`)
        .subscribe((translatedMsg) => {
          this._snackBarService.openSnackBarAsText(translatedMsg);
        });
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
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
          }
        )
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
