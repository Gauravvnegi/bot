import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { UserService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import {
  Departmentpermission,
  Departmentpermissions,
  UserList,
} from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';
import { FeedbackDetailComponent } from '../../card';

@Component({
  selector: 'hospitality-bot-feedback-detail-modal',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailModalComponent extends FeedbackDetailComponent
  implements OnInit {
  @Output() onDetailsClose = new EventEmitter();
  globalFeedbackConfig = feedback;
  userPermissions: Departmentpermission[];
  $subscription = new Subscription();
  assigneeList;
  constructor(
    protected cardService: CardService,
    public _globalFilterService: GlobalFilterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected userService: UserService
  ) {
    super(cardService, _globalFilterService, userService);
    this.feedbackFG = new FormGroup({
      assignee: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getUserPermission();
  }

  close() {
    this.onDetailsClose.emit();
  }

  getUserPermission() {
    this.$subscription.add(
      this.userService
        .getUserPermission(this.data.feedbackType)
        .subscribe((response) => {
          this.userPermissions = new Departmentpermissions().deserialize(
            response.userCategoryPermission
          );
          this.assigneeList = new UserList().deserialize(
            [response, ...response.childUser],
            this.data.feedback.departmentName
          );
          this.feedbackFG?.patchValue({ assignee: this.data.feedback?.userId });
        })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
