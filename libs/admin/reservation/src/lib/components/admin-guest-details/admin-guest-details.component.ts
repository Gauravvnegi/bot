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
  @Input() guestData;
  @Output()
  addFGEvent = new EventEmitter();
  @Output() isGuestInfoPatched = new EventEmitter();
  roles: string[] = [];

  stayDetailsForm: FormGroup;
  healthCardDetailsForm: FormGroup;
  guestDetailsForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    if (this.detailsData) {
      this.addFormsControls();
      this.pushDataToForm();
    } else {
      this.guestDetailsForm = this._fb.group({ guests: this._fb.array([]) });
      const guestFA = this.guestDetailsForm.get('guests') as FormArray;
      this.roles.push('');
      guestFA.push(this.getGuestFG());
      guestFA.controls[0].patchValue(this.guestData);
    }
  }

  addFormsControls() {
    this.healthCardDetailsForm = this.initHealthCardDetailsForm();
    this.stayDetailsForm = this.initStayDetailsForm();
    (this.guestDetailsForm = this._fb.group({ guests: this._fb.array([]) })) &&
      this.initGuestDetailsForm();
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
      .patchValue(this.detailsData.guestDetails.guests);
    this.addFGEvent.next({
      name: 'guestInfoDetails',
      value: this.guestDetailsForm,
    });

    this.isGuestInfoPatched.next(true);
  }

  initGuestDetailsForm() {
    const guestFA = this.guestDetailsForm.get('guests') as FormArray;
    this.detailsData.guestDetails.guests.forEach((guest) => {
      this.roles.push(guest.role);
      guestFA.push(this.getGuestFG());
    });
  }

  initHealthCardDetailsForm() {
    return this._fb.group({
      status: [''],
      remarks: [''],
      url: [''],
      temperature: [''],
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
      checkin_comments: [''],
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
      age: [''],
      status: [''],
      remarks: [''],
      label: [''],
      role: [''],
    });
  }

  updateHealthCardStatus(status) {
    const formValues = this.healthCardDetailsForm.getRawValue();
    const data = {
      stepName: 'HEALTHDECLARATION',
      state: status,
      remarks: formValues.remarks,
      temperature: formValues.temperature,
    };

    if (status === 'REJECT' && isEmpty(data.remarks)) {
      this.snackbarService.openSnackBarAsText(
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
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.SUCCESS.STATUS_UPDATED',
                priorityMessage: 'Status Updated Successfully.',
              },
              '',
              { panelClass: 'success' }
            )
            .subscribe();
        },
        (error) => {
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      );
  }

  filteredGuestForm(role1, role2?) {
    return this.guestDetailsForm.controls.guests?.value.filter(
      (guestFG) => guestFG.role === role1 || guestFG.role === role2
    );
  }
}
