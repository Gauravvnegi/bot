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
  primaryGuest;
  guestDetails;
  bookingList = [
    { label: 'Advance Booking', icon: '' },
    { label: 'Current Booking', icon: '' },
  ];

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService
  ) {
   this.initDetailsForm()
  }

  ngOnInit(): void {
    this.getReservationDetails();
  }

  getReservationDetails() {
    this._reservationService
      .getReservationDetails('c4cd8e80-d21b-4496-ac56-85edf9a4ca0d')
      .subscribe((response) => {
        this.guestDetails = new Details().deserialize(response);
        console.log(this.guestDetails);
        this.mapValuesInForm();
      });
  }

  initDetailsForm(){
    this.detailsForm = this._fb.group({
      reservationForm : this.initReservationForm(),
      stayDetails : this.initStayDetailsForm(),
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

  initHealthDeclareForm(){
    return this._fb.group({
      isAccepted:['']
    })
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

  // addGuests(guestDetail) {
  //   this.guestDetailsForm.addControl('guests', new FormArray([]));
  //   guestDetail.guestDetails.forEach((guest) => {
  //     let controlFA = this.guestDetailsForm.get('guests') as FormArray;
  //     controlFA.push(this.getGuestFG());
  //   });

  //   this.addDocuments();
  //   this.mapValuesInForm();
  //   this.extractPrimaryDetails();
  //   this.setDefaultGuestForDocument();
  // }

  // addPackages(){
  //   this.packageDetailsForm.addControl('complementaryPackage',new FormArray([]));
  //   this.packageDetailsForm.addControl('paidPackage',new FormArray([]));
  //   let complementaryControlFA = this.packageDetailsForm.get('complementaryPackage') as FormArray;
  //   let paidControlFA = this.packageDetailsForm.get('paidPackage') as FormArray;

  //   this.guestDetails.amenitiesDetails.complementaryPackage.forEach(() => {
  //     complementaryControlFA.push(this.getPackageFG());
  //   });

  //   this.guestDetails.amenitiesDetails.paidPackage.forEach(() => {
  //     paidControlFA.push(this.getPackageFG());
  //   });
  // }

  mapValuesInForm() {
    this.stayDetailsForm.patchValue(this.guestDetails.stayDetails);
    this.reservationDetailsForm.patchValue(this.guestDetails.reservationDetails);
    this.healDeclarationForm.patchValue(this.guestDetails.healDeclarationDetails);
    console.log(this.detailsForm);
  }

  confirmHealthDocs(){
    //call Api to confirm
  }

  get primaryDetails() {
    this.guests &&
    this.guests.controls.forEach((guestFG) => {
      if (guestFG.get('isPrimary').value === true) {
        this.primaryGuest = guestFG;
      }
    });
    return this.primaryGuest;
  }

  get guests(): FormArray {
    return this.guestDetailsForm && 
    this.guestDetailsForm.get('guests') as FormArray;
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

  get healDeclarationForm(){
    return this.detailsForm.get('healthDeclareForm') as FormGroup;
  }
}
