import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ConfigService,
  CountryCodeList,
  Option,
  guestSalutation,
  kidAgesList,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from 'libs/shared/material/src';
import { isEmpty } from 'lodash';
import { UpdateGuestPayload } from '../../models/guest-table.model';
import { ReservationService } from '../../services/reservation.service';
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

  activeState: boolean[] = [true, true, true, true, true, true, true];
  editGuestIndex = -1;
  editGuestInitialData = {};
  isUpdatingGuest = false;
  code: Option[] = [];

  readonly titleOptions = guestSalutation;
  readonly kidAgesList = kidAgesList;

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private snackbarService: SnackBarService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.getCountryCode();

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
    this.activeState = this.guestFA.controls.map((item) => true);
  }

  get guestFA() {
    return this.guestDetailsForm.get('guests') as FormArray;
  }

  /**
   * To check whether the guest details are submitted or not
   */
  get hasSharedGuestDetails() {
    return this.guestFA?.controls
      ?.filter((control) => control.value.role === 'sharer')
      ?.reduce((prev, control, idx) => prev && control.value.firstName, true);
  }

  handleEdit(idx: number, isCancel = false) {
    const isSave = this.editGuestIndex === idx;

    if (isCancel) {
      this.guestFA.at(idx).patchValue(this.editGuestInitialData);
      this.editGuestInitialData = {};
      this.editGuestIndex = -1;
    } else if (isSave) {
      this.isUpdatingGuest = true;

      const payloadData = new UpdateGuestPayload().deserialize(
        this.guestFA.value[idx]
      );

      this._reservationService
        .updateGuest(payloadData?.id, payloadData)
        .subscribe(
          (res) => {
            const currentGuestDetails = this.guestFA.at(idx).value;

            if (res?.type !== 'NON_RESIDENT_GUEST') {
              this._reservationService.$reinitializeGuestDetails.next(true);
            }

            const label = currentGuestDetails.label;
            this.snackbarService.openSnackBarAsText(
              `${label} details updated`,
              '',
              { panelClass: 'success' }
            );

            this.editGuestInitialData = {};
            this.editGuestIndex = -1;
            this.isUpdatingGuest;
          },
          () => {
            this.isUpdatingGuest = false;
          }
        );
    } else {
      if (this.editGuestIndex !== -1) {
        this.snackbarService.openSnackBarAsText(
          'Please save the changes first.'
        );
      } else {
        this.activeState[idx] = true;
        this.editGuestIndex = idx;
        this.editGuestInitialData = { ...this.guestFA.at(idx).value };
      }
    }
  }

  getCountryCode() {
    this.configService.getCountryCode().subscribe(
      (res) => {
        let data = new CountryCodeList().deserialize(res);

        this.code = data.records.map((element) => ({
          label: element.label + ' (' + element.value + ')',
          value: element.value,
        }));
      },
      () => {}
    );
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
      remarks: ['', [Validators.maxLength(200)]],
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
      remarks: ['', [Validators.maxLength(200)]],
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
        (error) => {}
      );
  }

  filteredGuestForm(role1, role2?) {
    return this.guestDetailsForm.controls.guests?.value.filter(
      (guestFG) => guestFG.role === role1 || guestFG.role === role2
    );
  }
}
