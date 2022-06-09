import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-feedback-detail-footer',
  templateUrl: './feedback-detail-footer.component.html',
  styleUrls: ['./feedback-detail-footer.component.scss'],
})
export class FeedbackDetailFooterComponent implements OnInit {
  @Input() feedback;

  constructor() {}

  ngOnInit(): void {}
}
