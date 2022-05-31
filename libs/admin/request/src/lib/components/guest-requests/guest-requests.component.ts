import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'hospitality-bot-guest-requests',
  templateUrl: './guest-requests.component.html',
  styleUrls: ['./guest-requests.component.scss'],
})
export class GuestRequestsComponent implements OnChanges {
  @Input() requestList;
  @Input() hotelId;
  requestFG: FormGroup;
  constructor(
    private _snackbarService: SnackBarService,
    private requestService: RequestService,
    private _adminUtilityService: AdminUtilityService,
    private fb: FormBuilder
  ) {}
  optionLabels = ['Pending', 'Closed', 'Timeout'];

  preArrivalOptions = ['Accept', 'Reject', 'Closed', 'Pending'];

  ngOnChanges() {
    this.initFG();
  }

  initFG() {
    this.requestFG = this.fb.group({});
    this.requestList.forEach((item) => {
      this.requestFG.addControl(item.id, new FormControl(item.action));
    });
  }

  handleStatusChange(request, event) {
    if (request.journey === 'INHOUSE') {
      if (event.value !== 'Closed') return;
      const requestData = {
        jobID: request.jobID,
        roomNo: request.rooms[0].roomNumber,
        lastName: request.guestDetails.primaryGuest.lastName,
      };

      const config = {
        queryObj: this._adminUtilityService.makeQueryParams([
          {
            cmsUserType: 'Bot',
            hotelId: this.hotelId,
          },
        ]),
      };
      this.requestService.closeRequest(config, requestData).subscribe(
        (response) => {
          this._snackbarService.openSnackBarAsText(
            `Request status updated`,
            '',
            {
              panelClass: 'success',
            }
          );
        },
        ({ error }) => {
          this.requestFG.patchValue({
            [request.id]: request.action,
          });
          this._snackbarService.openSnackBarAsText(error.message);
        }
      );
      return;
    }
    this.preArrivalStatusChange(request, event);
  }

  preArrivalStatusChange(request, event) {
    const requestData = {
      systemDateTime: DateService.currentDate('DD-MMM-YYYY HH:mm:ss'),
      action: event.value,
    };
    this.requestService
      .updatePreArrivalRequest(request.id, requestData)
      .subscribe(
        (response) => {
          this._snackbarService.openSnackBarAsText(
            `Request status updated`,
            '',
            {
              panelClass: 'success',
            }
          );
        },
        ({ error }) => {
          this.requestFG.patchValue({
            [request.id]: request.action,
          });
          this._snackbarService.openSnackBarAsText(error.message);
        }
      );
  }
}
