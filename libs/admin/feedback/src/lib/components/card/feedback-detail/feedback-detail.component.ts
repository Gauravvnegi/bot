import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { UserService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import {
  Departmentpermission,
  Departmentpermissions,
} from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailComponent implements OnInit {
  num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  @Input() feedback;
  @Input() colorMap;
  @Input() feedbackType;
  @Output() guestInfo = new EventEmitter();
  globalFeedbackConfig = feedback;
  userPermissions: Departmentpermission[];
  $subscription = new Subscription();
  constructor(
    private cardService: CardService,
    public _globalFilterService: GlobalFilterService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.listenForSelectedFeedback();
    this.getUserPermission();
  }

  listenForSelectedFeedback() {
    this.$subscription.add(
      this.cardService.$selectedFeedback.subscribe(
        (response) => (this.feedback = response)
      )
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
          this.userService.$userPermissions.next(this.userPermissions);
        })
    );
  }

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  get feedbackConfig() {
    return feedback;
  }
}
