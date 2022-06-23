import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-feedback-history',
  templateUrl: './feedback-history.component.html',
  styleUrls: ['./feedback-history.component.scss'],
})
export class FeedbackHistoryComponent implements OnInit {
  @Input() guestId;
  constructor() {}

  ngOnInit(): void {}
}
