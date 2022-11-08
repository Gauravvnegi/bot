import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '@hospitality-bot/admin/shared';
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
export class FeedbackDetailFooterComponent implements OnInit, OnDestroy {
  @Input() feedback: FeedbackRecord;
  @Input() userPermissions: Departmentpermission[];
  @Output() updateStatus = new EventEmitter();
  @Output() addComment = new EventEmitter();
  $subscription = new Subscription();
  @Input() feedbackFG: FormGroup;
  items = [
    { id: 1, name: 'Ram ', department: 'Department' },
    { id: 2, name: 'Shyam ', department: 'Department' },
  ];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.feedbackFG.addControl('comment', new FormControl(''));
  }

  getNicknameLoggedinUser() {
    const userData = this.userService.userDetails;
    if (userData) {
      const nameList = [userData.firstName, userData.lastName];
      return nameList
        .map((i, index) => {
          if ([0, 1].includes(index)) return i.charAt(0);
          else return '';
        })
        .join('')
        .toUpperCase();
    }
    return '';
  }

  /**
   * @function getDepartmentAllowed Returns if user have permission, department name and marked as Resolved.
   */
  getDepartmentAllowed() {
    return (
      this.userPermissions &&
      this.userPermissions.filter(
        (x) => x.department === this.feedback?.departmentName
      ).length
    );
  }

  markResolved() {
    this.updateStatus.emit({ data: this.feedbackFG.getRawValue() });
  }

  sendMessage() {
    this.addComment.emit({ data: this.feedbackFG.getRawValue() });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
