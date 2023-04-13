import { Component, Input, OnInit } from '@angular/core';
import { DateService } from '@hospitality-bot/shared/utils';
import { SnackBarService } from 'libs/shared/material/src';
import { MetaData } from '../../../models/guest-table.model';
import { ReservationService } from '../../../services/reservation.service';

@Component({
  selector: 'hospitality-bot-default-package',
  templateUrl: './default-package.component.html',
  styleUrls: ['./default-package.component.scss'],
})
export class DefaultPackageComponent implements OnInit {
  @Input() parentForm;
  @Input() paidAmenityFG;
  @Input() index;
  metaDataList: MetaData[] = [];
  @Input() set config(value) {
    this.getMetaDataList(value);
  }

  constructor(
    protected snackbarService: SnackBarService,
    private _reservationService: ReservationService
  ) {}

  ngOnInit(): void {}

  updatePackageStatus(status) {
    const data = {
      stepName: 'PACKAGE',
      state: status,
      remarks: this.paidAmenityFG.get('remarks').value,
      packageId: this.paidAmenityFG.get('id').value,
    };

    this._reservationService
      .updateStepStatus(
        this.parentForm.get('reservationDetails').get('bookingId').value,
        data
      )
      .subscribe(
        (response) => {
          this.paidAmenityFG
            .get('status')
            .patchValue(status === 'ACCEPT' ? 'COMPLETED' : 'FAILED');
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.REQUEST_STATUS_UPDATED`,
              priorityMessage: 'Request status updated',
            },
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => { }
      );
  }

  getMetaDataList(value) {
    let format: string = 'DD-MM-YYYY , HH:mm A';
    this.metaDataList = Object.entries(value.metaData as MetaData).map(
      ([key, value]) => ({
        label: (key.charAt(0).toUpperCase() + key.slice(1)).replace(
          /([A-Z])/g,
          ' $1'
        ),
        value:
          key == 'pickupTime' ? this.convertEpochToDate(value, format) : value,
      })
    );
  }

  convertEpochToDate(epochTime: any, format: string) {
    return DateService.getDateFromTimeStamp(epochTime * 1000, format).replace(
      ',',
      'at'
    );
  }
}
