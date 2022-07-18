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

  displayedColumns: string[] = [
    'label',
    'unit',
    'unitPrice',
    'amount',
    'discount',
    'totalAmount',
  ];

  paymentDetailForm: FormGroup;
  @Output() addFGEvent = new EventEmitter();

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.paymentDetailForm = this._fb.group({});

    this.addFGEvent.next({
      name: 'paymentDetails',
      value: this.paymentDetailForm,
    });

    this.getPrimaryGuest();
    this.getModifiedPaymentSummary();
  }

  getModifiedPaymentSummary() {
    const paymentSummary = this.detailsData.paymentDetails;
    paymentSummary.packages.forEach((amenity) => {
      const {
        label,
        description,
        unit,
        base,
        amount,
        totalAmount,
        discount,
      } = amenity;

      this.dataSource.push({
        label,
        description,
        unit,
        base,
        amount,
        totalAmount,
        discount,
        currency: paymentSummary.currency,
      });
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
