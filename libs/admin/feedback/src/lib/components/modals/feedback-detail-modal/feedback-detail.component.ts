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
  implements OnInit {
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
        feedbackType: this.feedbackType,
        ids: this.data.feedback.id,
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
      status: 'RESOLVED',
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
