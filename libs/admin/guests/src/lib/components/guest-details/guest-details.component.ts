import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { isEmpty } from 'lodash';

@Component({
  selector: 'hospitality-bot-guest-details',
  templateUrl: './guest-details.component.html',
  styleUrls: ['./guest-details.component.scss']
})
export class GuestDetailsComponent implements OnInit {
  @Input('data') detailsData;
  @Input() parentForm: FormGroup;
  @Output()
  addFGEvent = new EventEmitter();
  @Output() isGuestInfoPatched = new EventEmitter();

  stayDetailsForm: FormGroup;
  healthCardDetailsForm: FormGroup;
  guestDetailsForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    debugger;
    this.addFormsControls();
    this.pushDataToForm();
  }

  addFormsControls() {
    (this.guestDetailsForm = this._fb.group({ guests: this._fb.array([]) })) &&
      this.initGuestDetailsForm();

    // this.parentForm.addControl('guestDetails', this.initGuestDetailForm());
    // this.addGuests(this.guestDetails);
  }

  pushDataToForm() {
    this.guestDetailsForm
      .get('guests')
      .patchValue(this.detailsData.guestDetails);
    this.addFGEvent.next({
      name: 'guestInfoDetails',
      value: this.guestDetailsForm,
    });

    this.isGuestInfoPatched.next(true);
  }

  initGuestDetailsForm() {
    const guestFA = this.guestDetailsForm.get('guests') as FormArray;
    this.detailsData.guestDetails.forEach((guest) => {
      guestFA.push(this.getGuestFG());
    });

    //this.mapValuesInForm();
    // this.extractPrimaryDetails();
  }

  initHealthCardDetailsForm() {
    return this._fb.group({
      status: [''],
      remarks: [''],
      url: [''],
    });
  }

  initStayDetailsForm() {
    return this._fb.group({
      arrivalDate: [''],
      departureDate: [''],
      expectedArrivalTime: [''],
      roomType: [''],
      kidsCount: [''],
      adultsCount: [''],
      roomNumber: [''],
      special_comments: [''],
      checkin_comments:['']
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
      isPrimary: [''],
      nationality: [''],
      isInternational: [''],
      selectedDocumentType: [''],
      status: [''],
      remarks: [''],
    });
  }

  // addGuests(guestDetail) {
  //   this.guestDetailsForm.addControl('guests', new FormArray([]));
  //   guestDetail.guestDetails.forEach((guest) => {
  //     let controlFA = this.guestDetailsForm.get('guests') as FormArray;
  //     controlFA.push(this.getGuestFG());
  //   });

  //   this.mapValuesInForm();
  //   this.extractPrimaryDetails();
  // }

  // mapValuesInForm() {
  //   this.guests.patchValue(this.guestDetails.guestDetails);
  // }

  // extractPrimaryDetails() {
  //   this.guests.controls.forEach((guestFG) => {
  //     if (guestFG.get('isPrimary').value === true) {
  //       this.primaryGuest = guestFG;
  //     }
  //   });
  // }

  // editHealthStatus() {
  //   this.isActionEdit = true;
  // }

}
