import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Details } from '../../../../../shared/src/lib/models/detailsConfig.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  
  detailsForm: FormGroup;
  dataSource;
  selectedGuestGroup;
  selectedGuestId;
  primaryGuest;
  guestDetails;
  items = [
    { label: 'Advance Booking', icon: '' },
    { label: 'Current Booking', icon: '' },
  ];

  PaymentData = [
    {description: 'Room Rental', unit: '1', unitPrice: 1000, amount: 3000, CGST:'5%', SGST:'9%', discount:'', totalAmount:''},
    {description: 'Breakfast', unit: '2', unitPrice: 1500, amount: 3000, CGST:'5%', SGST:'9%', discount:'', totalAmount:''},
    {description: 'Spa', unit: '1', unitPrice: 1000, amount: 1000, CGST:'5%', SGST:'9%', discount:'', totalAmount:''}
  ];

  displayedColumns: string[] = ['description', 'unit', 'unitPrice', 'amount', 'CGST', 'SGST', 'discount', 'totalAmount'];
  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService
  ) {
   this.initDetailsForm()
  }

  ngOnInit(): void {
    this.dataSource = this.PaymentData;
    this.getReservationDetails();
  }

  getReservationDetails() {
    this._reservationService
      .getReservationDetails('c4cd8e80-d21b-4496-ac56-85edf9a4ca0d')
      .subscribe((response) => {
        this.guestDetails = new Details().deserialize(response);
        console.log(this.guestDetails);
        this.addGuests(this.guestDetails);
        // this.addPackages();
      });
  }

  initDetailsForm(){
    this.detailsForm = this._fb.group({
      reservationForm : this.initReservationForm(),
      stayDetails : this.initStayDetailsForm(),
      guestDetails: this.initGuestDetailForm(),
      packageDetailsForm : this.initPackageDetailsForm(),
      paymentdetailsForm : this.initPaymentDetailsForm(),
      healthDeclareForm : this.initHealthDeclareForm()
    })
  }

  initReservationForm() {
    return this._fb.group({
      bookingId: [''],
      roomNumber: [''],
    });
  }

  initStayDetailsForm() {
    return this._fb.group({
      arrivalTime: [''],
      departureTime: [''],
      expectedArrivalTime: [''],
      roomType: [''],
      kidsCount: [''],
      adultsCount: [''],
    });
  }

  initGuestDetailForm() {
    return this._fb.group({
    });
  }

  initPackageDetailsForm(){
    return this._fb.group({
    })
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

  initHealthDeclareForm(){
    return this._fb.group({
      isAccepted:['']
    })
  }

  getDocumentFG(): FormGroup {
    return this._fb.group({
      id: [''],
      documentType: [''],
      frontUrl: [''],
      backUrl: [''],
      verificationStatus: [''],
      remark:['']
    });
  }

  getGuestFG(): FormGroup {
    return this._fb.group({
      id: [''],
      title: [''],
      firstName: [''],
      lastName: [''],
      countryCode: [''],
      phoneNumber: [''],
      email: [''],
      isPrimary: ['']
    });
  }

  getPackageFG(): FormGroup {
    return this._fb.group({
      id: [''],
      quantity: [''],
      rate: [''],
      imgUrl: [''],
      amenityName: [''],
      packageCode: [''],
      amenityDescription: [''],
      type: [''],
      active: [''],
      metadata: ['']
    })
  }

  addGuests(guestDetail) {
    this.guestDetailsForm.addControl('guests', new FormArray([]));
    guestDetail.guestDetails.forEach((guest) => {
      let controlFA = this.guestDetailsForm.get('guests') as FormArray;
      controlFA.push(this.getGuestFG());
    });

    this.addDocuments();
    this.mapValuesInForm();
    this.extractPrimaryDetails();
    this.setDefaultGuestForDocument();
  }

  addDocuments() {
    this.guests.controls.forEach((element: FormGroup, index) => {
      element.addControl('documents', new FormArray([]));
      let controlFA = element.get('documents') as FormArray;
      this.guestDetails.guestDetails[index].documents.forEach(
        (doc) => {
          controlFA.push(this.getDocumentFG());
        }
      );
    });
  }

  addPackages(){
    this.packageDetailsForm.addControl('complementaryPackage',new FormArray([]));
    this.packageDetailsForm.addControl('paidPackage',new FormArray([]));
    let complementaryControlFA = this.packageDetailsForm.get('complementaryPackage') as FormArray;
    let paidControlFA = this.packageDetailsForm.get('paidPackage') as FormArray;

    this.guestDetails.amenitiesDetails.complementaryPackage.forEach(() => {
      complementaryControlFA.push(this.getPackageFG());
    });

    this.guestDetails.amenitiesDetails.paidPackage.forEach(() => {
      paidControlFA.push(this.getPackageFG());
    });

    // this.packageDetailsForm.patchValue(this.guestDetails.amenitiesDetails);
  }

  setDefaultGuestForDocument() {
    this.guestDetails.guestDetails.forEach((guest) => {
      if (guest.isPrimary === true) {
        this.selectedGuestId = guest.id;
      }
      this.onGuestChange(guest.id);
    });
  }

  mapValuesInForm() {
    // will use patchValue only once , needs to be modified
    this.guests.patchValue(this.guestDetails.guestDetails);
    this.stayDetailsForm.patchValue(this.guestDetails.stayDetails);
    this.reservationDetailsForm.patchValue(this.guestDetails.reservationDetails);
    this.paymentDetailsForm.patchValue(this.guestDetails.paymentDetails);
    this.healDeclarationForm.patchValue(this.guestDetails.healDeclarationDetails);
    console.log(this.detailsForm);
  }

  setHealthDeclaration(status){
    // call Api to set status of the health form
    // On success , change the form value
    this.healDeclarationForm.get('isAccepted').setValue(status);
  }

  confirmHealthDocs(){
    //call Api to confirm
  }

  onGuestChange(value) {
    this.guests.controls.forEach((guest) => {
      if (guest.get('id').value === value) {
        this.selectedGuestId = value;
        this.selectedGuestGroup = guest;
      }
    });
  }

  extractPrimaryDetails() {
    this.guests.controls.forEach((guestFG) => {
      if (guestFG.get('isPrimary').value === true) {
        this.primaryGuest = guestFG;
      }
    });
  }

  get guests(): FormArray {
    return this.guestDetailsForm.get('guests') as FormArray;
  }

  get reservationDetailsForm(){
    return this.detailsForm.get('reservationForm')as FormGroup;
  } 

  get stayDetailsForm(){
    return this.detailsForm.get('stayDetails')as FormGroup;
  }

  get guestDetailsForm(){
    return this.detailsForm.get('guestDetails')as FormGroup;
  }

  get packageDetailsForm(){
    return this.detailsForm.get('packageDetailsForm') as FormGroup;
  }

  get paymentDetailsForm(){
    return this.detailsForm.get('paymentdetailsForm') as FormGroup;
  }

  get healDeclarationForm(){
    return this.detailsForm.get('healthDeclareForm') as FormGroup;
  }
}
