import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Details } from '../../../../../shared/src/lib/models/detailsConfig.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  guestDetailsForm: FormGroup;
  guestDetails;

  constructor(
    private _fb: FormBuilder,
    private _reservationService : ReservationService
  ) {
    this.initGuestDetailForm();
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

  initGuestDetailForm() {
    this.guestDetailsForm = this._fb.group({
      arrivalTime: ['', [Validators.required]],
      departureTime: ['', [Validators.required]],
      expectedArrivalTime: ['', [Validators.required]],
      roomType: ['', [Validators.required]],
      kidsCount: ['', [Validators.required]],
      adultsCount: ['', [Validators.required]],
    });
  }

  addGuests(guest){
    this.guestDetailsForm.addControl('guests', new FormArray([]));
    guest.guestDetails.forEach(guest => {
      let controlFA = this.guestDetailsForm.get(
        'guests'
      ) as FormArray;
      controlFA.push(this.getGuestFG());
    });

   this.guestDetailsForm.patchValue(this.guestDetails.stayDetails);
   this.guestDetailsForm.get('guests').patchValue(this.guestDetails.guestDetails);
   console.log(this.guestDetailsForm);
  }

  getGuestFG(): FormGroup {
    return this._fb.group({
      title: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      countryCode: ['',[Validators.required]],
      phoneNumber: ['',[Validators.required]],
      email: ['',[Validators.required]],
    });
  }
}
