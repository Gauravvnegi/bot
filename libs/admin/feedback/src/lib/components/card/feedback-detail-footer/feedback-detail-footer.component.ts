import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Departmentpermission,
  FeedbackRecord,
} from '../../../data-models/feedback-card.model';

@Component({
  selector: 'hospitality-bot-feedback-detail-footer',
  templateUrl: './feedback-detail-footer.component.html',
  styleUrls: ['./feedback-detail-footer.component.scss'],
})
export class FeedbackDetailFooterComponent implements OnInit {
  @Input() feedback: FeedbackRecord;
  @Input() userPermissions: Departmentpermission[];
  $subscription = new Subscription();
  constructor() {}

  ngOnInit(): void {}

  getDepartmentAllowed() {
    return (
      this.userPermissions &&
      this.userPermissions.filter(
        (x) => x.department === this.feedback.departmentName
      ).length
    );
  }
}
