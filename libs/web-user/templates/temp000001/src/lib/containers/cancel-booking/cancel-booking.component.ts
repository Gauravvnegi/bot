import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.scss'],
})
export class CancelBookingComponent implements OnInit {
  constructor() {}

  isReservationData;

  reservationDetails;

  ngOnInit(): void {}
}
