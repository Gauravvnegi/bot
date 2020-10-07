import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Details } from '../../../../../shared/src/lib/models/detailsConfig.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AdminGuestDetailsComponent } from '../admin-guest-details/admin-guest-details.component';
import { AdminDetailsService } from '../../services/admin-details.service';
import { AdminDocumentsDetailsComponent } from '../admin-documents-details/admin-documents-details.component';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  
  @ViewChild(AdminGuestDetailsComponent) guestDetailComponent: AdminGuestDetailsComponent;
  @ViewChild(AdminDocumentsDetailsComponent) documentDetailComponent: AdminDocumentsDetailsComponent;

  detailsForm: FormGroup;
  primaryGuest;
  guestDetails;
  bookingList = [
    { label: 'Advance Booking', icon: '' },
    { label: 'Current Booking', icon: '' },
  ];

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _adminDetailsService: AdminDetailsService
  ) {
   this.initDetailsForm()
  }

  ngOnInit(): void {
    this.getReservationDetails();
  }

  getReservationDetails() {
    this._reservationService
      .getReservationDetails('17b322c3-fa52-4e3d-9883-34132f6954cd')
      .subscribe((response) => {
        this.guestDetails = new Details().deserialize(response);
        this.mapValuesInForm();
        this.primaryDetails();
      });
  }

  initDetailsForm(){
    this.detailsForm = this._fb.group({
      reservationForm : this.initReservationForm(),
      stayDetails : this.initStayDetailsForm(),
      healthDeclareForm : this.initHealthDeclareForm(),
      regCardForm : this.initRegCardForm()
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

  initRegCardForm(){
    return this._fb.group({
      status:['']
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

  mapValuesInForm() {
    this.stayDetailsForm.patchValue(this.guestDetails.stayDetails);
    this.reservationDetailsForm.patchValue(this.guestDetails.reservationDetails);
    this.healDeclarationForm.patchValue(this.guestDetails.healDeclarationDetails);
    this.regCardForm.patchValue(this.guestDetails.regCardDetails);
    this.setStepsStatus();
  }

  setStepsStatus(){
    this._adminDetailsService.healthDeclarationStatus = this.healDeclarationForm.get('isAccepted').value;
  }

  confirmHealthDocs(status){
    this.guestDetailComponent.updateHealthDeclarationStatus(status);
  }

  primaryDetails() {
    this.guestDetails.guestDetails.forEach((guest) => {
      if (guest.isPrimary === true) {
        this.primaryGuest = guest;
      }
    });
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

  get healthDeclarationStatus(){
    return this._adminDetailsService.healthDeclarationStatus;
  }

  get regCardForm(){
    return this.detailsForm.get('regCardForm') as FormGroup;
  }
}
