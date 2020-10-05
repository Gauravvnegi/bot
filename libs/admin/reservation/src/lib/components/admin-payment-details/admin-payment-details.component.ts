import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-admin-payment-details',
  templateUrl: './admin-payment-details.component.html',
  styleUrls: ['./admin-payment-details.component.scss']
})
export class AdminPaymentDetailsComponent implements OnInit {

  @Input() guestDetails;
  @Input() parentForm;

  dataSource;

  PaymentData = [
    {description: 'Room Rental', unit: '1', unitPrice: 1000, amount: 3000, CGST:'5%', SGST:'9%', discount:'', totalAmount:''},
    {description: 'Breakfast', unit: '2', unitPrice: 1500, amount: 3000, CGST:'5%', SGST:'9%', discount:'', totalAmount:''},
    {description: 'Spa', unit: '1', unitPrice: 1000, amount: 1000, CGST:'5%', SGST:'9%', discount:'', totalAmount:''}
  ];

  displayedColumns: string[] = ['description', 'unit', 'unitPrice', 'amount', 'CGST', 'SGST', 'discount', 'totalAmount'];
  
  constructor(
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dataSource = this.PaymentData;
    this.addFormsControl();
  }

  initPaymentDetailsForm(){
    return this._fb.group({
      bookingId: [''],
      arrivalTime: [''],
      departureTime: [''],
      currentDate: [''],
      expectedArrivalTime: [''],
      roomType: [''],
      roomNumber: [''],
      kidsCount: [''],
      adultsCount: [''],
      roomsCount:[''],
      title: [''],
      firstName: [''],
      lastName: [''],
      countryCode: [''],
      phoneNumber: [''],
    })
  }

  addFormsControl(){
    this.parentForm.addControl('paymentdetailsForm', this.initPaymentDetailsForm());
    this.paymentDetailsForm.patchValue(this.guestDetails.paymentDetails);
  }

  get paymentDetailsForm(){
    return this.parentForm.get('paymentdetailsForm') as FormGroup;
  }
}
