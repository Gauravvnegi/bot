import { Component, OnInit, Input } from '@angular/core';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';

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

  paymentSummary;

  constructor(
    private _billSummaryService: BillSummaryService,
    private _reservationService: ReservationService,
    private _stepperService: StepperService
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getAmountSummary();
  }

  initBillSummaryDetailsDS(paymentSummary) {
    this._billSummaryService.initBillSummaryDetailDS(
      this.reservationData,
      paymentSummary
    );
  }

  getAmountSummary() {
    this._billSummaryService.getBillingSummary(this._reservationService.reservationId)
    .subscribe(summary =>{
      this.paymentSummary = summary;
      this.initBillSummaryDetailsDS(this.paymentSummary);
    })
    // const paymentData = {
    //   grossTotal: {
    //     value: 35400.0,
    //     currencyCode: 'INR',
    //   },
    //   totalTax: {
    //     value: 5400.0,
    //     currencyCode: 'INR',
    //   },
    //   paidAmount: {
    //     value: 900,
    //     currencyCode: 'INR',
    //   },
    //   packageTotal: 0,
    //   addOnPackageTotal: 0,
    //   dailyBreakdown: [
    //     {
    //       grossDailyTotal: {
    //         value: 11800.0,
    //         currencyCode: 'INR',
    //       },
    //       grossDailyTax: {
    //         value: 1800.0,
    //         currencyCode: 'INR',
    //       },
    //       grossDailyAddOnPackage: 0,
    //       grossDailyPackage: 0,
    //       postingDate: '2020-07-30',
    //       roomRatesAndPackage: [
    //         {
    //           amount: {
    //             value: 10000.0,
    //             currencyCode: 'INR',
    //           },
    //           isAddon: false,
    //           description: 'BASE RATE',
    //           code: 'BASE',
    //         },
    //       ],
    //       taxesAndFees: [
    //         {
    //           amount: {
    //             value: 35400.0,
    //             currencyCode: 'INR',
    //           },
    //           description: '5006 SGST - Room 9%',
    //           code: '1000',
    //           codeType: 'R',
    //         },
    //         {
    //           amount: {
    //             value: 900.0,
    //             currencyCode: 'INR',
    //           },
    //           discount: {
    //             value: 900,
    //             currencyCode: 'INR',
    //             percentage: 10,
    //           },
    //           description: '5005 CGST - Room 9%',
    //           code: '1000',
    //           codeType: 'R',
    //         },
    //       ],
    //     },
    //   ],
    // };
    // return paymentData;
  }

  onSubmit() {
    this._stepperService.setIndex('next');
  }
}
