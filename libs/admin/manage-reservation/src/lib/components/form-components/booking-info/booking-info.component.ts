import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import { BookingConfig } from '../../../models/reservations.model';
import * as moment from 'moment';

@Component({
  selector: 'hospitality-bot-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.scss', '../../reservation.styles.scss'],
})
export class BookingInfoComponent implements OnInit {
  startMinDate = new Date();
  endMinDate = new Date();

  statusOptions: Option[] = [
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Wait Listed', value: 'WAIT_LISTED' },
    { label: 'No Show', value: 'NO_SHOW' },
    { label: 'In Session', value: 'IN_SESSION' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  // reservationTypes: Option[] = [
  //   { label: 'Dine-in', value: 'DINEIN' },
  //   { label: 'delivery', value: 'DELIVERY' },
  // ];

  @Input() configData: BookingConfig;
  @Input() bookingType: string = 'Hotel';
  @Input() reservationTypes: Option[] = [];
  reservationInfoFormGroup: FormGroup;

  constructor(public controlContainer: ControlContainer) {
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.endMinDate.setTime(this.endMinDate.getTime() - 5 * 60 * 1000);
  }

  ngOnInit(): void {
    // const startTime = moment(this.startMinDate).unix() * 1000;
    // const endTime = moment(this.endMinDate).unix() * 1000;
  }
}
