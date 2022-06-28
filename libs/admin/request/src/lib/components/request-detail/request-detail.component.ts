import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { request } from '../../constants/request';
import { InhouseData } from '../../data-models/inhouse-list.model';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'hospitality-bot-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnInit {
  data: InhouseData;
  status = false;
  statusList = request.status;
  $subscription = new Subscription();
  hotelId: string;
  @Output() guestInfo = new EventEmitter();

  requestFG: FormGroup;
  constructor(
    private _requestService: RequestService,
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private _snackbarService: SnackBarService,
    private _globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
    this.initFG();
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.listenForSelectedRequest();
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

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) =>
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ])
      )
    );
  }

  /**
   * @function getHotelId To set the hotel id after extractinf from filter array.
   * @param globalQueries The filter list with date and hotel filters.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
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
    const requestData = {
      jobID: this.data.jobID,
      roomNo: this.data.rooms[0].roomNumber,
      lastName: this.data.guestDetails.primaryGuest.lastName,
    };

    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          cmsUserType: 'Bot',
          hotelId: this.hotelId,
        },
      ]),
    };
    this.$subscription.add(
      this._requestService.closeRequest(config, requestData).subscribe(
        (response) =>
          this._snackbarService.openSnackBarAsText(
            `Job: ${this.data.jobID} closed`,
            '',
            { panelClass: 'success' }
          ),

        ({ error }) => {
          this.requestFG.patchValue({ status: this.data.action });
          this._snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.error.some_thing_wrong',
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }
}
