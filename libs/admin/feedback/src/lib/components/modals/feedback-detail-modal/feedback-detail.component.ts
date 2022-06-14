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

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
