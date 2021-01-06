import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { SnackBarService } from 'libs/shared/material/src';
import { isEmpty } from 'lodash';
@Component({
  selector: 'hospitality-bot-admin-guest-details',
  templateUrl: './admin-guest-details.component.html',
  styleUrls: ['./admin-guest-details.component.scss'],
})
export class AdminGuestDetailsComponent implements OnInit {
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
    private _reservationService: ReservationService,
    private _snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.addFormsControls();
    this.pushDataToForm();
  }

  addFormsControls() {
    this.healthCardDetailsForm = this.initHealthCardDetailsForm();
    this.stayDetailsForm = this.initStayDetailsForm();
    (this.guestDetailsForm = this._fb.group({ guests: this._fb.array([]) })) &&
      this.initGuestDetailsForm();

    // this.parentForm.addControl('guestDetails', this.initGuestDetailForm());
    // this.addGuests(this.guestDetails);
  }

  pushDataToForm() {
    this.healthCardDetailsForm.patchValue(
      this.detailsData.healDeclarationDetails
    );
    this.addFGEvent.next({
      name: 'healthCardDetails',
      value: this.healthCardDetailsForm,
    });

    this.stayDetailsForm.patchValue(this.detailsData.stayDetails);
    this.addFGEvent.next({ name: 'stayDetails', value: this.stayDetailsForm });

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

  updateHealthCardStatus(status) {
    let data = {
      stepName: 'HEALTHDECLARATION',
      state: status,
      remarks: this.healthCardDetailsForm.get('remarks').value,
    };

    if (status == 'REJECT' && isEmpty(data.remarks)) {
      this._snackBarService.openSnackBarAsText(
        'Please provide a relevant remark'
      );
      // add remakrks validator as required
      return;
    }

    // remove remarks required validators

    this._reservationService
      .updateStepStatus(
        this.parentForm.get('reservationDetails').get('bookingId').value,
        data
      )
      .subscribe(
        (response) => {
          this.healthCardDetailsForm
            .get('status')
            .patchValue(status === 'ACCEPT' ? 'COMPLETED' : 'FAILED');
          this._snackBarService.openSnackBarAsText(
            'Status updated sucessfully.',
            '',
            { panelClass: 'success' }
          );
        },
        (error) => {
          this._snackBarService.openSnackBarAsText(error.error.message);
        }
      );
  }

  // get guests(): FormArray {
  //   return this.guestDetailsForm.get('guests') as FormArray;
  // }

  // get guestDetailsForm() {
  //   return this.parentForm.get('guestDetails') as FormGroup;
  // }

  // get healDeclarationForm() {
  //   return this.parentForm.get('healthDeclareForm') as FormGroup;
  // }
}
