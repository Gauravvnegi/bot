import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { DateService } from '@hospitality-bot/shared/utils';
import { MessageService } from '../../services/messages.service';

@Component({
  selector: 'hospitality-bot-guest-requests',
  templateUrl: './guest-requests.component.html',
  styleUrls: ['./guest-requests.component.scss'],
})
export class GuestRequestsComponent implements OnChanges {
  @Input() requestList;
  @Input() entityId;
  requestFG: FormGroup;
  constructor(
    private snackbarService: SnackBarService,
    private messageService: MessageService,
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
            cmsUserType: 'Admin',
            entityId: this.entityId,
          },
        ]),
      };
      this.messageService.closeRequest(config, requestData).subscribe(
        (response) => {
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.REQUEST_STATUS_UPDATED`,
              priorityMessage: 'Request status updated',
            },
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.requestFG.patchValue({
            [request.id]: request.action,
          }); 
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
    this.messageService
      .updatePreArrivalRequest(request.id, requestData)
      .subscribe(
        (response) => {
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.REQUEST_STATUS_UPDATED`,
              priorityMessage: 'Request status updated',
            },
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.requestFG.patchValue({
            [request.id]: request.action,
          }); 
        }
      );
  }
}
