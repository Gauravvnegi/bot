import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  @Output() updateStatus = new EventEmitter();
  @Output() addComment = new EventEmitter();
  $subscription = new Subscription();
  feedbackFG: FormGroup;
  constructor() {
    this.feedbackFG = new FormGroup({
      comment: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  getDepartmentAllowed() {
    return (
      this.userPermissions &&
      this.userPermissions.filter(
        (x) => x.department === this.feedback?.departmentName
      ).length &&
      this.feedback?.status !== 'RESOLVED'
    );
  }

  markResolved() {
    this.updateStatus.emit();
  }

  sendMessage() {
    this.addComment.emit({ data: this.feedbackFG.getRawValue() });
  }
}
