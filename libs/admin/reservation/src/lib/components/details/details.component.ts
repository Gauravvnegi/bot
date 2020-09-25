import { Component, OnInit, ɵConsole } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Details } from '../../../../../shared/src/lib/models/detailsConfig.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  guestDetailsForm: FormGroup;
  documentsdetailsForm: FormGroup;
  reservationDetailsForm: FormGroup;
  selectedGuest;
  selectedDocument;
  primaryGuest;
  guestDetails;

  constructor(
    private _fb: FormBuilder,
    private _reservationService : ReservationService
  ) {
    this.initGuestDetailForm();
    this.initReservationForm();
   }

  ngOnInit(): void {
    this.getReservationDetails();
  }

  getReservationDetails(){
    this._reservationService.getReservationDetails('e5997cce-49bd-4a92-a013-dec264c47e68')
    .subscribe(response =>{
      this.guestDetails = new Details().deserialize(response);
      this.addGuests(this.guestDetails);
    })
  }

  initReservationForm(){
    this.reservationDetailsForm = this._fb.group({
      bookingId: [''],
      roomNumber: ['']
    })
  }

  initGuestDetailForm() {
    this.guestDetailsForm = this._fb.group({
      arrivalTime: [''],
      departureTime: [''],
      expectedArrivalTime: [''],
      roomType: [''],
      kidsCount: [''],
      adultsCount: [''],
    });
  }

  getDocumentFG(): FormGroup{
    return this._fb.group({
      id: [''],
      documentType: [''],
      frontUrl: [''],
      backUrl: [''],
      verificationStatus:['']
    })
  }

  addGuests(guestDetail){
    this.guestDetailsForm.addControl('guests', new FormArray([]));
    guestDetail.guestDetails.forEach(guest => {
      let controlFA = this.guestDetailsForm.get(
        'guests'
      ) as FormArray;
      controlFA.push(this.getGuestFG());
    });
    
    this.addDocuments();
    this.mapValuesInForm();
    this.extractPrimaryDetails();
    this.setDefaultGuestForDocument();
  }

  addDocuments(){
    this.guests.controls.forEach((element:FormGroup, index) => {
      element.addControl('documents', new FormArray([]));
      let controlFA = element.get('documents') as FormArray;
      this.guestDetails.guestDetails[index].documentDetails.docFile.forEach(doc => {
        controlFA.push(this.getDocumentFG());
      });
    });
  }

  setDefaultGuestForDocument(){
    this.guestDetails.guestDetails.forEach(guest => {
      if(guest.isPrimary === true){
        this.selectedGuest = guest.id;
      }
      this.onGuestChange(guest.id);
    });
  }

  mapValuesInForm(){
    this.guestDetailsForm.patchValue(this.guestDetails.stayDetails);
    this.guestDetailsForm.get('guests').patchValue(this.guestDetails.guestDetails);
    this.guests.controls.forEach((guest, index) =>{
      guest.get('documents').patchValue(this.guestDetails.guestDetails[index].documentDetails.docFile);
    })
    this.reservationDetailsForm.patchValue(this.guestDetails.reservationDetails);
  }

  onGuestChange(value){
    this.guests.controls.forEach(guest =>{
      if(guest.get('id').value === value){
        this.selectedDocument = guest.get('documents');
      }
    })
  }

  extractPrimaryDetails(){
    this.guests.controls.forEach(guestFG => {
      if(guestFG.get('isPrimary').value === true){
        this.primaryGuest = guestFG;
      }
    });
  }

  getGuestFG(): FormGroup {
    return this._fb.group({
      id:[''],
      title: [''],
      firstName: [''],
      lastName: [''],
      countryCode: [''],
      phoneNumber: [''],
      email: [''],
      isPrimary: [''],
      remark:['']
    });
  }

  get guests(): FormArray {
    return this.guestDetailsForm.get('guests') as FormArray;
  } 
}
