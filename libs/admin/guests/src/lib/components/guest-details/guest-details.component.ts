import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

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
    this.addFormsControls();
    this.pushDataToForm();
  }

  addFormsControls() {
    (this.guestDetailsForm = this._fb.group({ guests: this._fb.array([]) })) &&
      this.initGuestDetailsForm();
  }

  pushDataToForm() {
    let guestData = [this.detailsData.guests.primaryGuest];
    this.detailsData.guests.secondaryGuest.forEach((data) => guestData.push(data));
    this.guestDetailsForm
      .get('guests')
      .patchValue(guestData);
    this.addFGEvent.next({
      name: 'guestDetails',
      value: this.guestDetailsForm,
    });

    this.isGuestInfoPatched.next(true);
  }

  initGuestDetailsForm() {
    const guestFA = this.guestDetailsForm.get('guests') as FormArray;
    guestFA.push(this.getGuestFG());
    this.detailsData.guests.secondaryGuest.forEach((guest) => {
      guestFA.push(this.getGuestFG());
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
      documents: [[]],
      status: [''],
      remarks: [''],
    });
  }

}
