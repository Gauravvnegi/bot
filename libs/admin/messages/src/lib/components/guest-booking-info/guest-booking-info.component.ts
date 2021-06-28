import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-guest-booking-info',
  templateUrl: './guest-booking-info.component.html',
  styleUrls: ['./guest-booking-info.component.scss'],
})
export class GuestBookingInfoComponent implements OnInit {
  @Input() data;
  constructor() {}

  ngOnInit(): void {}
}
