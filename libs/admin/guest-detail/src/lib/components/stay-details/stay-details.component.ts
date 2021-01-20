import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FeedBackDetail } from '../../../../../guests/src/lib/data-models/feedbackDetailsConfig.model';
import { SnackBarService } from 'libs/shared/material/src';
import { GuestDetailService } from '../../services/guest-detail.service';

@Component({
  selector: 'hospitality-bot-stay-details',
  templateUrl: './stay-details.component.html',
  styleUrls: ['./stay-details.component.scss'],
})
export class StayDetailsComponent implements OnInit {
  @Input('data') guestBookings;
  @Input() parentForm;
  @Input() hotelId;

  @Output() addFGEvent = new EventEmitter();

  stayDetailsFG: FormGroup;
  feedbackConfig: FeedBackDetail;
  constructor(
    private fb: FormBuilder,
    private guestDetailService: GuestDetailService,
    private _snackbarService: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.addFormsControl();
    this.pushDataToForm();
    this.loadFeedbackCongif();
  }

  loadFeedbackCongif() {
    this.guestDetailService.getFeedback(this.hotelId)
      .subscribe((response) => {
        this.feedbackConfig = new FeedBackDetail().deserialize(response);
      }, ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message);
      })
  }

  addFormsControl(): void {
    (this.stayDetailsFG = this.fb.group({
      presentBookings: this.fb.array([]),
      upcomingBookings: this.fb.array([]),
      pastBookings: this.fb.array([]),
    })) && this.initStayDetailForm();
  }

  initStayDetailForm(): void {
    const keys = Object.keys(this.guestBookings);
    keys.forEach((key)=> {
      const stayDetailFG = this.stayDetailsFG.get(key) as FormArray;
      this.guestBookings[key].forEach((data) => {
        stayDetailFG.push(this.getStayDetailFG());
      });
    });
  }

  getStayDetailFG(): FormGroup {
    return this.fb.group({
      roomType: [''],
      arrivalDate: [''],
      departureDate: [''],
      expectedArrival: [''],
      roomNumber: [''],
      feedback: [''],
    });
  }

  pushDataToForm(): void {
    const keys = Object.keys(this.guestBookings);
    keys.forEach((key)=> {
      let stayDetails = [];
      this.guestBookings[key].forEach((data) => {
        stayDetails.push({
          roomType: data.rooms.type,
          arrivalDate: data.booking.arrivalTimeStamp,
          departureDate: data.booking.departureTimeStamp,
          expectedArrival: data.booking.expectedArrivalTimeStamp,
          roomNumber: data.rooms.roomNumber,
          feedback: data.feedback,
        });
      });
      this.stayDetailsFG.get(key).patchValue(stayDetails);
      this.addFGEvent.next({
        name: key,
        value: this.stayDetailsFG.get(key),
      });
    });
  }

  get getCurrentBooking() {
    return this.stayDetailsFG.get('presentBookings').value;
  }

  get getUpcomingBooking() {
    return this.stayDetailsFG.get('upcomingBookings').value;
  }

  get getPastBooking() {
    return this.stayDetailsFG.get('pastBookings').value;
  }
}
