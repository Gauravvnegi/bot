import { Component, OnInit } from '@angular/core';
import { FeedbackDetailsComponent as BaseFeedbackDetailsComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/feedback-details/feedback-details.component';
@Component({
  selector: 'hospitality-bot-feedback-details',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/feedback-details/feedback-details.component.html',
  styleUrls: ['./feedback-details.component.scss'],
})
export class FeedbackDetailsComponent extends BaseFeedbackDetailsComponent {}
