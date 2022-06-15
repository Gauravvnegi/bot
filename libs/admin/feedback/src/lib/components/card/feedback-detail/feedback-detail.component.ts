import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  UserService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import {
  Departmentpermission,
  Departmentpermissions,
  FeedbackRecord,
  UserList,
} from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';
import { FeedbackTableService } from '../../../services/table.service';
import * as FileSaver from 'file-saver';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { card } from '../../../constants/card';

@Component({
  selector: 'hospitality-bot-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailComponent implements OnInit {
  num = card.num;
  @Input() feedback: FeedbackRecord;
  @Input() colorMap;
  @Input() feedbackType;
  @Output() guestInfo = new EventEmitter();
  feedbackFG: FormGroup;
  globalFeedbackConfig = feedback;
  userPermissions: Departmentpermission[];
  assigneeList;
  $subscription = new Subscription();
  globalQueries;
  constructor(
    protected cardService: CardService,
    public _globalFilterService: GlobalFilterService,
    protected userService: UserService,
    protected _adminUtilityService: AdminUtilityService,
    protected tableService: FeedbackTableService,
    protected _snackbarService: SnackBarService
  ) {
    this.feedbackFG = new FormGroup({
      assignee: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.listenForSelectedFeedback();
    this.assigneeList = new UserList().deserialize([]);
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.feedbackType = data['filter'].value.feedback.feedbackType;
        this.getUserPermission();
      })
    );
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
          this.cardService.$assigneeChange.next({ status: true });
        })
    );
  }

  checkForNumber(item) {
    return isNaN(item);
  }

  /**
   * @function exportCSV To export CSV report for feedback.
   */
  exportCSV(): void {
    const queries = [
      ...this.globalQueries,
      {
        feedbackType: this.feedbackType,
        ids: this.feedback.feedbackId,
      },
    ];
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };
    this.$subscription.add(
      this.tableService.exportCSV(config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            `Feedback_export_${new Date().getTime()}.csv`
          );
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  updateFeedbackState() {
    let data = {
      status: card.feedbackState.status,
    };
    this.tableService.updateFeedbackState(this.feedback.id, data).subscribe(
      (response) => {
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'Status Updated Successfully.',
              priorityMessage: 'Status Updated Successfully..',
            },
            '',
            {
              panelClass: 'success',
            }
          )
          .subscribe();
        this.feedback.status = response.status;
        this.cardService.$assigneeChange.next({ status: true });
      },
      ({ error }) => {
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: error.message,
              priorityMessage: error.message,
            },
            ''
          )
          .subscribe();
      }
    );
  }

  addComment(event) {
    let data = {
      notes: event.data.comment,
    };
    this.tableService.updateFeedbackState(this.feedback.id, data).subscribe(
      (response) => {
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'Message sent.',
              priorityMessage: 'Message sent Successfully..',
            },
            '',
            {
              panelClass: 'success',
            }
          )
          .subscribe();
        this.cardService.$assigneeChange.next({ status: true });
      },
      ({ error }) => {
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: error.message,
              priorityMessage: error.message,
            },
            ''
          )
          .subscribe();
      }
    );
  }

  get feedbackServices() {
    if (this.feedback) {
      if (this.feedbackType === feedback.types.transactional)
        return this.feedback.feedback.services.services;
      return this.feedback.feedback.services;
    } else [];
  }

  get feedbackConfig() {
    return feedback;
  }
}
