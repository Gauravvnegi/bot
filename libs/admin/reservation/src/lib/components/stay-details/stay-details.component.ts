import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-stay-details',
  templateUrl: './stay-details.component.html',
  styleUrls: ['./stay-details.component.scss'],
})
export class StayDetailsComponent implements OnInit {
  @Input('data') detailsData;
  @Input() parentForm: FormGroup;
  @Output() addFGEvent = new EventEmitter();
  @Output() isGuestInfoPatched = new EventEmitter();
  stayDetailsForm: FormGroup;
  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.addFormsControls();
    this.pushDataToForm();
  }

  addFormsControls() {
    this.stayDetailsForm = this.initStayDetailsForm();
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

  pushDataToForm() {
    this.stayDetailsForm.patchValue(this.detailsData.stayDetails);
    this.addFGEvent.next({ name: 'stayDetails', value: this.stayDetailsForm });
  }
}
