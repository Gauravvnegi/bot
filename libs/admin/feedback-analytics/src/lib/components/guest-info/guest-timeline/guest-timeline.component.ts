import { Component, Input, OnInit } from '@angular/core';
import { GuestDetails } from '../../../data-models/feedback-card.model';

@Component({
  selector: 'hospitality-bot-guest-timeline',
  templateUrl: './guest-timeline.component.html',
  styleUrls: ['./guest-timeline.component.scss'],
})
export class GuestTimelineComponent implements OnInit {
  @Input() guestId: string;
  @Input() guestReservations: GuestDetails;
  constructor() {}

  ngOnInit(): void {}
}
