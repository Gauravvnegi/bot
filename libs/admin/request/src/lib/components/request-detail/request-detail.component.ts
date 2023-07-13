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
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { RequestStatus } from '../../constants/request';
import { InhouseData } from '../../data-models/inhouse-list.model';
import { RequestService } from '../../services/request.service';
import { CMSUpdateJobData } from '../../types/request.type';

@Component({
  selector: 'hospitality-bot-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnInit, OnDestroy {
  data: InhouseData;
  status = false;
  statusList: Option[] = [];
  $subscription = new Subscription();
  entityId: string;
  @Output() guestInfo = new EventEmitter();
  @Input() guestInfoEnable;

  requestFG: FormGroup;
  constructor(
    private _requestService: RequestService,
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;

    this.registerListeners();
    this.initFG();
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.listenForSelectedRequest();
    this.listenForStatusValue();
  }

  /**
   * @function listenForSelectedRequest To listen for request selection.
   */
  listenForSelectedRequest() {
    this.$subscription.add(
      this._requestService.selectedRequest.subscribe((response) => {
        if (response) {
          this.data = response;
          this.requestFG.patchValue({ status: response.action });
          this.status = true;
        } else {
          this.data = new InhouseData();
          this.status = false;
        }
      })
    );
  }

  listenForStatusValue() {
    this.$subscription.add(
      this._requestService.requestStatus.subscribe((response) => {
        if (!!this.statusList.length) return;

        response.forEach((item) => {
          if (item !== RequestStatus.TIMEOUT)
            this.statusList.push({
              label: convertToTitleCase(item),
              value: item,
            });
        });
      })
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
      jobID: this.data.jobID,
      roomNo: this.data.rooms[0].roomNumber,
      lastName: this.data.guestDetails.primaryGuest.lastName,
    };

    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          cmsUserType: 'Bot',
          entityId: this.entityId,
          actionType: event.value,
        },
      ]),
    };
    this.$subscription.add(
      this._requestService
        .updateJobRequestStatus(config, requestData)
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

            this._requestService.refreshData.next(true);
          },
          ({ error }) => {
            this.requestFG.patchValue({ status: this.data.action });
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
