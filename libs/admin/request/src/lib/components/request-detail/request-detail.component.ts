import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { NotificationService } from 'apps/admin/src/app/core/theme/src/lib/services/notification.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { InhouseData } from '../../data-models/inhouse-list.model';
import { RequestService } from '../../services/request.service';
import { CMSUpdateJobData } from '../../types/request.type';

@Component({
  selector: 'hospitality-bot-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
  providers: [DatePipe],
})
export class RequestDetailComponent implements OnInit, OnDestroy {
  data: InhouseData;
  status = false;
  statusList: Option[] = [];
  assigneeList: Option[] = [];
  $subscription = new Subscription();
  entityId: string;
  @Output() guestInfo = new EventEmitter();
  @Input() guestInfoEnable;
  closedTimestamp: number;
  formattedClosedTimestamp: string;
  jobId: string;
  isAssigneeLoading: boolean = false;

  alreadyAssignedName: Option[] = [];

  requestFG: FormGroup;
  constructor(
    private _requestService: RequestService,
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private notificationService: NotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.registerListeners();
    this.initFG();
  }

  get allAssigneeList() {
    if (this.data.assigneeId && this.data.isFocused) {
      return this.assigneeList.length
        ? this.assigneeList
        : this.alreadyAssignedName;
    } else {
      return this.alreadyAssignedName;
    }
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.listenForSelectedRequest();
    this.listenForNotificationRequest();
  }

  /**
   * @function listenForSelectedRequest To listen for request selection.
   */
  listenForSelectedRequest() {
    this.$subscription.add(
      this._requestService.selectedRequest.subscribe((res) => {
        if (res) {
          this.jobId = res.id;
          this.getJobDetails();
        }
      })
    );
  }

  listenForNotificationRequest() {
    this.notificationService.$requestNotification.subscribe((requestId) => {
      if (requestId) {
        this.jobId = requestId;
        this.getJobDetails();
      }
    });
  }

  /**
   * @function getJobDetails To get the job details.
   * @description This function is used to get the job details.
   * @returns
   **/
  getJobDetails() {
    this.$subscription.add(
      this._requestService.getStatusList(this.jobId).subscribe((response) => {
        if (response) {
          this.data = new InhouseData().deserialize(response);
          if (this.data?.assigneeName) {
            this.alreadyAssignedName = [
              {
                label: this.data.assigneeName,
                value: this.data?.assigneeId ?? this.data.assigneeName,
              },
            ];
            // this.requestFG.get('assignee').disable();
          }

          this.requestFG.patchValue({
            status: response.action,
            assignee:
              this.data.assigneeId && this.data.isFocused
                ? response.assigneeId
                : response.assigneeName,
          });

          this._requestService.selectedRequestStatus.next({
            jobId: this.jobId,
            status: response.action,
          });
          this.closedTimestamp = response?.closedTime;
          this.getAssigneeList(response.itemId);
          this.getStatusList(response.nextStates);
          this.status = true;
          this.formattedDate();
        } else {
          this.data = new InhouseData();
          this.status = false;
        }
      })
    );
  }

  /**
   * @function getStatusList To get the status list.
   * @param status The status list from response.
   * @description This function is used to get the status list.
   * @returns
   **/
  getStatusList(status: string[]) {
    this.statusList = status.map((item) => {
      return {
        label: convertToTitleCase(item),
        value: item,
      };
    });

    this.statusList.push({
      label: convertToTitleCase(this.data.action),
      value: this.data.action,
    } as Option);
  }
  getAssigneeList(itemId) {
    this.isAssigneeLoading = true;
    this.$subscription.add(
      this._requestService
        .getItemDetails(this.entityId, itemId, {
          params: '?includeActiveUsers=true',
        })
        .subscribe(
          (response) => {
            this.assigneeList =
              response?.requestItemUsers?.map((item) => {
                return {
                  label: item.firstName + ' ' + item.lastName,
                  value: item.userId,
                };
              }) ?? [];
            this.isAssigneeLoading = false;
          },
          (error) => {
            this.isAssigneeLoading = false;
          }
        )
    );
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe(
        (data) => this.globalFilterService.entityId
      )
    );
  }

  /**
   * @function initFG To initialize FormGroup.
   */
  initFG() {
    this.requestFG = this.fb.group({
      status: [''],
      assignee: [''],
    });
  }

  /**
   * @function To check for data existence.
   * @returns The length of the object.
   */
  checkForData(): number {
    return this.data && Object.keys(this.data).length;
  }

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }

  /**
   * @function handleStatusChange To handle the status drop down value change.
   * @param event the mat selection change event.
   */

  handleStatusChange(event) {
    const requestData: CMSUpdateJobData = {
      jobID: this.data.id,
      roomNo: this.data.rooms[0].roomNumber,
      lastName: this.data.guestDetails.primaryGuest.lastName,
    };

    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          cmsUserType: 'Admin',
          entityId: this.entityId,
          actionType: event.value,
          entityType: 'Inhouse', // cannot be hardcoded - refactor
        },
      ]),
    };
    this.$subscription.add(
      this._requestService
        .updateJobRequestStatus(this.entityId , config, requestData)
        .subscribe(
          (response) => {
            this.snackbarService.openSnackBarAsText(
              `Job: ${
                this.data.jobNo
              } status updated successfully to ${convertToTitleCase(
                event.value
              )}.`,
              '',
              { panelClass: 'success' }
            );
            this.data.action = event.value;
            this.formattedDate();
            this.getJobDetails(); // to refresh the data
            this._requestService.refreshData.next(true);
          },
          ({ error }) => {
            this.requestFG.patchValue({ status: this.data.action });
          }
        )
    );
  }

  formattedDate() {
    const dateObject: Date = this.closedTimestamp
      ? new Date(this.closedTimestamp)
      : new Date();
    this.formattedClosedTimestamp = this.datePipe.transform(
      dateObject,
      "EEEE, MMMM d, y, 'at' h:mm a"
    );
  }

  handleAssigneeChange(event) {
    this._requestService
      .assignComplaintToUser(this.data.id, {
        assignedTo: event.value,
      })
      .subscribe(() => {
        const user =
          this.assigneeList.find((item) => item.value === event.value)?.label ??
          '';

        this.snackbarService.openSnackBarAsText(
          `Job ${this.data?.jobID} Assignee To ${user}  Successfully`,
          '',
          { panelClass: 'success' }
        );
        this.requestFG.patchValue({ assignee: event.value });

        this._requestService.refreshData.next(true);
      }),
      ({ error }) => {
        this.requestFG.patchValue({ assignee: this.data.assigneeId });
      };
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
