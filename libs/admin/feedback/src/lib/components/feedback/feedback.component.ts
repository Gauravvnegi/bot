import { Component, OnInit } from '@angular/core';
import { CardNames } from 'libs/shared/constants/subscriptionConfig';

@Component({
  selector: 'hospitality-bot-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  public cards = CardNames;
  constructor() {}

  ngOnInit(): void {}
}
