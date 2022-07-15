import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  UserService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import {
  Departmentpermission,
  Departmentpermissions,
  UserList,
} from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';
import { FeedbackTableService } from '../../../services/table.service';
import { FeedbackDetailComponent } from '../../card';
import * as FileSaver from 'file-saver';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  Feedback,
  StayFeedback,
} from '../../../data-models/feedback-datatable.model';

@Component({
  selector: 'hospitality-bot-feedback-detail-modal',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class FeedbackDetailModalComponent extends FeedbackDetailComponent
  implements OnInit, OnDestroy {
  @ViewChild('feedbackChatRef') private feedbackChatRef: ElementRef;
  @Output() onDetailsClose = new EventEmitter();
  globalFeedbackConfig = feedback;
  userPermissions: Departmentpermission[];
  $subscription = new Subscription();
  assigneeList;
  guestInfoEnable = false;
  constructor(
    protected cardService: CardService,
    public _globalFilterService: GlobalFilterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected userService: UserService,
    protected _adminUtilityService: AdminUtilityService,
    protected tableService: FeedbackTableService,
    protected _snackbarService: SnackBarService
  ) {
    super(
      cardService,
      _globalFilterService,
      userService,
      _adminUtilityService,
      tableService,
      _snackbarService
    );
    this.feedbackFG = new FormGroup({
      assignee: new FormControl(''),
    });
    this.cardService.$selectedFeedback.next(this.data.feedback);
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

  /**
   * @function exportCSV To export CSV report for feedback.
   */
  exportCSV(): void {
    const queries = [
      ...this.data.globalQueries,
      {
        feedbackType: this.data.feedbackType,
        ids: this.data.feedback.id,
      },
    ];
    if (this.data.feedback.departmentName)
      queries.push({ departmentName: this.data.feedback.departmentName });
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
      status: 'RESOLVED',
    };
    this.tableService
      .updateFeedbackState(this.data.feedback.departmentId, data)
      .subscribe(
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
          this.cardService.$assigneeChange.next({ status: true });
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

  addComment(event) {
    const data = {
      notes: event.data.comment,
    };
    this.tableService
      .updateFeedbackState(this.data.feedback.departmentId, data)
      .subscribe(
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

  refreshFeedbackData() {
    this.$subscription.add(
      this.cardService
        .getFeedbackByID(this.data.feedback.feedbackId)
        .subscribe((response) => {
          this.data.feedback =
            this.data.feedbackType === feedback.types.stay
              ? new StayFeedback().deserialize(
                  {
                    ...response.feedback,
                    status: response.status,
                    departmentId: response.id,
                    departmentLabel: response.departmentLabel,
                    departmentName: response.departmentName,
                    userId: response.userId,
                    userName: response.userName,
                    remarks: response.remarks,
                    timeOut: response.timeOut,
                    feedbackId: response.id,
                  },
                  this.data.outlets,
                  this.data.colorMap
                )
              : new Feedback().deserialize(
                  {
                    ...response.feedback,
                    status: response.status,
                    departmentId: response.id,
                    departmentLabel: response.departmentLabel,
                    departmentName: response.departmentName,
                    userId: response.userId,
                    userName: response.userName,
                    remarks: response.remarks,
                    timeOut: response.timeOut,
                    feedbackId: response.id,
                  },
                  this.data.outlets
                );
          setTimeout(() => {
            this.feedbackChatRef.nativeElement.scrollTop = this.feedbackChatRef.nativeElement.scrollHeight;
          }, 1000);
        })
    );
  }

  get feedbackServices() {
    if (this.data.feedback) {
      if (this.data.feedbackType === feedback.types.transactional)
        return this.data.feedback.services.services;
      return this.data.feedback.services;
    } else [];
  }

  openGuestInfo() {
    this.guestInfoEnable = true;
  }

  closeGuestInfo(event) {
    this.guestInfoEnable = false;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
