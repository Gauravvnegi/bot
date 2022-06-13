import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { UserService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import {
  Departmentpermission,
  Departmentpermissions,
  FeedbackRecord,
  UserList,
} from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailComponent implements OnInit {
  num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  @Input() feedback: FeedbackRecord;
  @Input() colorMap;
  @Input() feedbackType;
  @Output() guestInfo = new EventEmitter();
  feedbackFG: FormGroup;
  globalFeedbackConfig = feedback;
  userPermissions: Departmentpermission[];
  assigneeList;
  $subscription = new Subscription();
  constructor(
    protected cardService: CardService,
    public _globalFilterService: GlobalFilterService,
    protected userService: UserService
  ) {
    this.feedbackFG = new FormGroup({
      assignee: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.listenForSelectedFeedback();
    this.getUserPermission();
    this.assigneeList = new UserList().deserialize([]);
  }

  listenForSelectedFeedback() {
    this.$subscription.add(
      this.cardService.$selectedFeedback.subscribe((response) => {
        this.feedback = response;
        this.feedbackFG?.patchValue({ assignee: response?.userId });
        if (response)
          this.assigneeList = new UserList().deserialize(
            [
              this.userService.userPermissions,
              ...this.userService.userPermissions.childUser,
            ],
            response.departmentName
          );
      })
    );
  }

  getUserPermission() {
    this.$subscription.add(
      this.userService
        .getUserPermission(this.feedbackType)
        .subscribe((response) => {
          this.userPermissions = new Departmentpermissions().deserialize(
            response.userCategoryPermission
          );
          this.userService.userPermissions = response;
        })
    );
  }

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  setAssignee(event) {
    this.$subscription.add(
      this.cardService
        .updateFeedbackAssignee(this.feedback.id, event.value)
        .subscribe((response) => {
          this.cardService.$assigneeChange.next({
            status: true,
            data: response,
          });
        })
    );
  }

  get feedbackConfig() {
    return feedback;
  }
}
