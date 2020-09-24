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
  guestDetailsForm: FormGroup;
  reservationDetailsForm: FormGroup;
  primaryGuest;
  guestDetails;
  items;

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService
  ) {
    this.initGuestDetailForm();
    this.initReservationForm();
  }

  ngOnInit(): void {
    this.getReservationDetails();
    this.items = [
      { label: 'Advance Booking', icon: '' },
      { label: 'Current Booking', icon: '' },
    ];
  }

  getReservationDetails() {
    this._reservationService
      .getReservationDetails('e5997cce-49bd-4a92-a013-dec264c47e68')
      .subscribe((response) => {
        this.guestDetails = new Details().deserialize(response);
        this.addGuests(this.guestDetails);
      });
  }

  initReservationForm() {
    this.reservationDetailsForm = this._fb.group({
      bookingId: [''],
      roomNumber: [''],
    });
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

  addGuests(guest) {
    this.guestDetailsForm.addControl('guests', new FormArray([]));
    guest.guestDetails.forEach((guest) => {
      let controlFA = this.guestDetailsForm.get('guests') as FormArray;
      controlFA.push(this.getGuestFG());
    });

    this.guestDetailsForm.patchValue(this.guestDetails.stayDetails);
    this.guestDetailsForm
      .get('guests')
      .patchValue(this.guestDetails.guestDetails);
    this.reservationDetailsForm.patchValue(
      this.guestDetails.reservationDetails
    );
    this.extractPrimaryDetails();
  }

  extractPrimaryDetails() {
    this.guests.controls.forEach((guestFG) => {
      if (guestFG.get('isPrimary').value === true) {
        this.primaryGuest = guestFG;
      }
    });
  }

  getGuestFG(): FormGroup {
    return this._fb.group({
      title: [''],
      firstName: [''],
      lastName: [''],
      countryCode: [''],
      phoneNumber: [''],
      email: [''],
      isPrimary: [''],
    });
  }

  get guests(): FormArray {
    return this.guestDetailsForm.get('guests') as FormArray;
  }
}
