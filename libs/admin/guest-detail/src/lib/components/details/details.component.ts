import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { SnackBarService } from 'libs/shared/material/src';
import {
  Guest,
  GuestReservation,
} from '../../../../../guests/src/lib/data-models/guest-table.model';
import { GuestDetailService } from '../../services/guest-detail.service';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  isReservationDetailFetched: boolean = false;
  isGuestInfoPatched: boolean = false;
  @Input() guestId;
  data: Guest;
  @Input() tabKey = 'guest_details';
  @Input() hotelId;
  detailsFG: FormGroup;
  details: GuestReservation;
  reservationData;

  detailsConfig = [
    {
      key: 'guest_details',
      index: 0,
    },
    {
      key: 'document_details',
      index: 1,
    },
    {
      key: 'stay_details',
      index: 2,
    },
  ];

  @Output() onDetailsClose = new EventEmitter();

  constructor(
    private guestDetailService: GuestDetailService,
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private _snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadGuestInfo();
  }

  loadGuestInfo(): void {
    this.guestDetailService.getGuestById(this.guestId).subscribe(
      (response) => {
        this.data = new Guest().deserialize(response);
        this.loadGuestReservations();
      },
      ({ error }) => {
        this._snackBarService.openSnackBarAsText(error.message);
      }
    );
  }

  loadGuestReservations(): void {
    this.guestDetailService.getGuestReservations(this.guestId).subscribe(
      (response) => {
        this.details = new GuestReservation().deserialize(response);
        this.isReservationDetailFetched = true;
        this.initFG();
      },
      ({ error }) => {
        this._snackBarService.openSnackBarAsText(error.message);
        this.closeDetails();
      }
    );
  }

  initFG(): void {
    this.detailsFG = this.fb.group({
      stayDetails: this.fb.group({}),
      documents: this.fb.group({}),
      guestDetails: this.fb.group({}),
    });
  }

  addFGEvent(data) {
    this.detailsFG.setControl(data.name, data.value);
  }

  closeDetails() {
    this.onDetailsClose.next(true);
  }

  get guestData() {
    return {
      title: this.data.nameTitle,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      countryCode: this.data.countryCode,
      phoneNumber: this.data.phoneNumber,
      email: this.data.email,
    };
  }

  get bookingCount() {
    let count = 0;
    count += this.details.pastBookings.length;
    count += this.details.presentBookings.length;
    count += this.details.upcomingBookings.length;
    return count;
  }

  setTabKey(key: string) {
    this.tabKey = key;
  }

  get bookingTitle() {
    return this.details.presentBookings.length
      ? 'Current Booking'
      : this.details.upcomingBookings.length
      ? 'Upcoming Booking'
      : 'Past Booking';
  }

  get tabIndex() {
    let { index } = this.detailsConfig.find(
      (tabConfig) => tabConfig.key == this.tabKey
    );
    return index ? index : 0;
  }
}
