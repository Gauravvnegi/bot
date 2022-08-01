import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  UserService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { card } from '../../../constants/card';
import { feedback } from '../../../constants/feedback';
import {
  Departmentpermission,
  Departmentpermissions,
  FeedbackRecord,
  UserList,
} from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';
import { FeedbackTableService } from '../../../services/table.service';

@Component({
  selector: 'hospitality-bot-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailComponent implements OnInit, OnDestroy {
  @ViewChild('feedbackChat') private feedbackChat: ElementRef;
  num = card.num;
  @Input() feedback: FeedbackRecord;
  @Input() colorMap;
  @Input() feedbackType;
  @Output() guestInfo = new EventEmitter();
  @Input() outlets;
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
    this.listenForFeedbackTypeChanged();
    this.listenForSelectedFeedback();
    this.assigneeList = new UserList().deserialize([]);
  }

  /**
   * @function listenForFeedbackTypeChanged To listen the local tab change.
   */
  listenForFeedbackTypeChanged(): void {
    this.$subscription.add(
      this.tableService.$feedbackType.subscribe((response) => {
        this.feedbackType = response;
        this.getUserPermission();
      })
    );
  }

  listenForSelectedFeedback() {
    this.$subscription.add(
      this.cardService.$selectedFeedback.subscribe((response) => {
        this.feedback = response;
        this.feedbackFG?.patchValue({ assignee: response?.userId });
        if (response) {
          this.assigneeList = new UserList().deserialize(
            [
              this.userService.userPermissions,
              ...this.userService.userPermissions.childUser,
            ],
            response.departmentName
          );
        }
      })
    );
  }

  /**
   * @function getUserPermission function to get user permission details
   */
  getUserPermission() {
    this.$subscription.add(
      this.userService
        .getUserPermission(
          this.feedbackType === '' ? feedback.types.stay : this.feedbackType
        )
        .subscribe(
          (response) => {
            this.userPermissions = new Departmentpermissions().deserialize(
              response.userCategoryPermission
            );
            this.userService.userPermissions = response;
          },
          ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
        )
    );
  }

  /**
   * @function openGuestInfo Function to open guest info details.
   */
  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }

  /**
   * @function setAssignee Function to change feedback assignee.
   * @param event
   */
  setAssignee(event) {
    this.$subscription.add(
      this.cardService
        .updateFeedbackAssignee(this.feedback.id, event.value)
        .subscribe(
          (response) => {
            this.cardService.$assigneeChange.next({ status: true });
            this._snackbarService.openSnackBarAsText('Assignee updated.', '', {
              panelClass: 'success',
            });
          },
          ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
        )
    );
  }

  /**
   * @function checkForNumber Function to check if number or not.
   */
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
        departmentName: this.feedback.departmentName,
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
    const data = {
      status: card.feedbackState.resolved,
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
    const data = {
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
        this.feedbackFG.patchValue({ comment: '' });
        this.refreshFeedbackData();
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

  downloadFeedback(event, id) {
    event.stopPropagation();
    this.$subscription.add(
      this.cardService.getFeedbackPdf(id).subscribe(
        (response) => {
          const link = document.createElement('a');
          link.href = response.fileDownloadUri;
          link.target = '_blank';
          link.download = response.fileName;
          link.click();
          link.remove();
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  refreshFeedbackData() {
    this.$subscription.add(
      this.cardService
        .getFeedbackByID(this.feedback.id)
        .subscribe((response) => {
          this.feedback = new FeedbackRecord().deserialize(
            response,
            this.outlets,
            this.feedbackType,
            this.colorMap
          );
          setTimeout(() => {
            this.feedbackChat.nativeElement.scrollTop = this.feedbackChat.nativeElement.scrollHeight;
          }, 1000);
        })
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
