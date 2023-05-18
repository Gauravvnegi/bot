import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';


@Component({
  selector: 'hospitality-bot-admin-payment-details',
  templateUrl: './admin-payment-details.component.html',
  styleUrls: ['./admin-payment-details.component.scss'],
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
    FAILED: {
      label: 'Failed',
      class: 'status-button--failure',
    },
    REFUND: {
      label: 'Refund',
      class: 'status-button--refund'
    }
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
    'status',
    'paymentMethod',
    'remarks',
    'cashierName',
    'totalAmount',
  ];

  // data = [
  //   {
  //     transactionId: 'ABC120202',
  //     created: 1683716985376,
  //     status: 'SUCCESS',
  //     paymentMode: 'Mode',
  //     remarks: 'Remark',
  //     amount: 100
  //   },
  //   {
  //     transactionId: 'ABC120202',
  //     created: 1683716985376,
  //     status: 'REFUND',
  //     paymentMode: 'Mode',
  //     remarks: 'Remark',
  //     amount: 100
  //   },
  //   {
  //     transactionId: 'ABC120202',
  //     created: 1683716985376,
  //     status: 'FAILED',
  //     paymentMode: 'Mode',
  //     remarks: 'Remark',
  //     amount: 100
  //   },
  //   {
  //     transactionId: 'ABC120202',
  //     created: 1683716985376,
  //     status: 'SUCCESS',
  //     paymentMode: 'Mode',
  //     remarks: 'Remark',
  //     amount: 100
  //   }
  // ]

  paymentDetailForm: FormGroup;
  @Output() addFGEvent = new EventEmitter();

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('Parent Form ->', this.parentForm);
    console.log('Details Data ->', this.detailsData);
  }

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
    this.transactionHistory = []; // Clear the array before populating it
    console.log(this.detailsData.paymentDetails.transactionHistory);
    // this.transactionHistory = this.data.map(
    this.transactionHistory = this.detailsData.paymentDetails.transactionHistory.map(
      (transaction) => {
        const {
          transactionId,
          created,
          status,
          paymentMode,
          remarks,
          amount,
        } = transaction;
        const cashierName = 'Cashier';

        return {
          transactionId,
          created,
          status,
          paymentMode,
          remarks,
          cashierName,
          amount,
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
    if (dueAmount === 0) {
      return 'COMPLETED';
    } else {
      return 'INITIATED';
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

