import { Component, OnInit } from '@angular/core';
import { FeedbackMainComponent as BaseFeedbackMainComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/feedback-main/feedback-main.component';

@Component({
  selector: 'hospitality-bot-feedback-main',
  templateUrl: './feedback-main.component.html',
  styleUrls: ['./feedback-main.component.scss'],
})
export class FeedbackMainComponent extends BaseFeedbackMainComponent {}
