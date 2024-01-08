import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { UserService } from '@hospitality-bot/admin/shared';
import { PaymentStatus } from 'libs/admin/finance/src/lib/components/transaction-history-data-table/transaction-history-data-table.component';
import { PaymentType } from 'libs/admin/finance/src/lib/types/history';
import { of } from 'rxjs';

@Component({
  selector: 'hospitality-bot-admin-payment-details',
  templateUrl: './admin-payment-details.component.html',
  styleUrls: [
    './admin-payment-details.component.scss',
    '../accordion-style.scss',
  ],
})
export class AdminPaymentDetailsComponent implements OnInit {
  @Input('data') detailsData;
  @Input() parentForm;
  primaryGuestFG: FormGroup;

  dataSource = [];
  transactionHistory = [];

  paymentStatus = {
    SUCCESS: {
      label: 'Paid',
      class: 'status-button--success',
    },
    FAILURE: {
      label: 'Failed',
      class: 'status-button--failure',
    },
    REFUND: {
      label: 'Refund',
      class: 'status-button--refund',
    },
  };

  displayedColumns: string[] = [
    'label',
    'unit',
    'unitPrice',
    'amount',
    'discount',
    'CGST',
    'SGST',
    'totalAmount',
  ];

  transactionHistoryCols: string[] = [
    'transactionId',
    'dateTime',
    'paymentType',
    'paymentMethod',
    'remarks',
    'cashierName',
    'totalAmount',
  ];

  paymentDetailForm: FormGroup;
  @Output() addFGEvent = new EventEmitter();

  constructor(private _fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.paymentDetailForm = this._fb.group({});

    this.addFGEvent.next({
      name: 'paymentDetails',
      value: this.paymentDetailForm,
    });

    this.getPrimaryGuest();
    this.getModifiedPaymentSummary();
    this.getModifiedTransactionHistory();
  }

  getModifiedTransactionHistory() {
    const getCashierName = async (cashierId: string) => {
      const res = await this.userService
        .getUserDetailsById(cashierId)
        .toPromise();
      return (res?.firstName ?? '') + ' ' + (res?.lastName ?? '');
    };

    this.transactionHistory = []; // Clear the array before populating it
    this.transactionHistory = this.detailsData.paymentDetails.transactionHistory.map(
      (transaction) => {
        const {
          transactionId,
          created,
          status,
          paymentMode,
          remarks,
          amount,
          currency,
          cashierId,
          paymentType,
        } = transaction;
        return {
          transactionId,
          created,
          status,
          paymentMode,
          remarks,
          amount,
          currency,
          paymentType,
          cashierName: cashierId
            ? getCashierName(cashierId)
            : of('-').toPromise(),
        };
      }
    );
  }

  getModifiedPaymentSummary() {
    const paymentSummary = this.detailsData.paymentDetails;
    const {
      label,
      description,
      unit,
      base,
      amount,
      totalAmount,
      cgstAmount,
      sgstAmount,
      discount,
    } = paymentSummary.roomRates;

    this.dataSource.push({
      label,
      description,
      unit,
      base,
      amount,
      totalAmount,
      cgstAmount,
      sgstAmount,
      discount,
      currency: paymentSummary.currency,
    });
  }

  getPrimaryGuest() {
    const guestFA = this.guestInfoDetailsFG.get('guests') as FormArray;

    guestFA.controls.forEach((guestControl: FormGroup) => {
      if (guestControl.get('isPrimary').value) {
        this.primaryGuestFG = guestControl;
      }
    });
  }

  // getStatusButtonClass(status: string) {
  //   const statusConfig = this.paymentStatus[status] || {};
  //   return {
  //     'status-button': true,
  //     [statusConfig.class]: !!statusConfig.class,
  //   };
  // }

  // getStatusLabel(status: TransactionStatus) {
  //   return status === TransactionStatus.SUCCESS ? 'Paid' : 'Failed';
  // }

  getPaymentStatus(): string {
    const dueAmount = this.detailsData.paymentDetails.dueAmount;
    const paidAmount = this.detailsData.paymentDetails.paidAmount;
    if (dueAmount === 0) {
      return 'COMPLETED';
    } else if (paidAmount === 0) {
      return 'PENDING';
    } else {
      return 'INITIATED';
    }
  }

  getStatusTextAndClass(
    paymentType: PaymentType,
    status: 'SUCCESS' | 'FAILURE'
  ): { text: string; class: string } {
    switch (true) {
      case paymentType === PaymentType.PAYMENT &&
        status === PaymentStatus.SUCCESS:
        return { text: 'Paid', class: 'chip-contained-success' };

      case paymentType === PaymentType.REFUND &&
        status === PaymentStatus.SUCCESS:
        return { text: 'Refund', class: 'chip-contained-paid' };

      case (paymentType === PaymentType.PAYMENT ||
        paymentType === PaymentType.REFUND) &&
        status === PaymentStatus.FAILURE:
        return { text: 'Failed', class: 'chip-contained-unpaid' };

      default:
        return { text: '--', class: 'default-chip-class' };
    }
  }

  get reservationDetailsFG() {
    return this.parentForm.get('reservationDetails') as FormGroup;
  }

  get stayDetailsFG() {
    return this.parentForm.get('stayDetails') as FormGroup;
  }

  get guestInfoDetailsFG() {
    return this.parentForm.get('guestInfoDetails') as FormGroup;
  }

  get healthCardDetailsFG() {
    return this.parentForm.get('healthCardDetails') as FormGroup;
  }

  get regCardDetailsFG() {
    return this.parentForm.get('regCardDetails') as FormGroup;
  }
}
