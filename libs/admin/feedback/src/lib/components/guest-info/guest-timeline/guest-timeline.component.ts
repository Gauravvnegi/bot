import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-guest-timeline',
  templateUrl: './guest-timeline.component.html',
  styleUrls: ['./guest-timeline.component.scss'],
})
export class GuestTimelineComponent implements OnInit {
  @Input() guestId: string;
  constructor() {}

  ngOnInit(): void {}
}
