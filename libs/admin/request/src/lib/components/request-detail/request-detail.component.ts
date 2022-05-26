import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
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
  statusList = [
    { label: 'To-Do', value: 'Immediate' },
    { label: 'Timeout', value: 'Timeout' },
    { label: 'Closed', value: 'Closed' },
  ];
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

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  initFG() {
    this.requestFG = this.fb.group({
      status: [''],
    });
  }

  checkForData() {
    return this.data && Object.keys(this.data).length;
  }

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }

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
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }
}
