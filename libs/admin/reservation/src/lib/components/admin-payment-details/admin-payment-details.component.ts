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

  // PaymentData = [
  //   {
  //     description: 'Room Rental',
  //     unit: '1',
  //     unitPrice: 1000,
  //     amount: 3000,
  //     CGST: '5%',
  //     SGST: '9%',
  //     discount: '',
  //     totalAmount: '',
  //   },
  //   {
  //     description: 'Breakfast',
  //     unit: '2',
  //     unitPrice: 1500,
  //     amount: 3000,
  //     CGST: '5%',
  //     SGST: '9%',
  //     discount: '',
  //     totalAmount: '',
  //   },
  //   {
  //     description: 'Spa',
  //     unit: '1',
  //     unitPrice: 1000,
  //     amount: 1000,
  //     CGST: '5%',
  //     SGST: '9%',
  //     discount: '',
  //     totalAmount: '',
  //   },
  // ];

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

  paymentDetailForm: FormGroup;
  @Output() addFGEvent = new EventEmitter();

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.paymentDetailForm = this._fb.group({});

    this.addFGEvent.next({
      name: 'paymentDetails',
      value: this.paymentDetailForm,
    });

    this.getPrimaryGuest();
    // this.dataSource = this.PaymentData;
    this.getModifiedPaymentSummary();
  }

  getModifiedPaymentSummary() {
    const paymentSummary = this.detailsData.paymentDetails;
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
  }

  getPrimaryGuest() {
    const guestFA = this.guestInfoDetailsFG.get('guests') as FormArray;

    guestFA.controls.forEach((guestControl: FormGroup) => {
      if (guestControl.get('isPrimary')) {
        this.primaryGuestFG = guestControl;
      }
    });
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
